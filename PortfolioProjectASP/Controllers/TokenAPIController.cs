﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using Portfolio_Project.Models;
using Microsoft.Extensions.Configuration;
using Portfolio_Project.Models.AccountViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using System.ComponentModel.DataAnnotations;
using System.Security.Claims;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Portfolio_Project.Repos;
using Portfolio_Project.Data;

namespace Portfolio_Project.Controllers
{
    //a slight change
    
    [Route("[controller]/[action]")]
    public class TokenAPI : Controller
    {
        private readonly SignInManager<ApplicationUser> signInManager;
        private readonly UserManager<ApplicationUser> userManager;
        private readonly IConfiguration configuration;
        private ApplicationDbContext context;
        private IServiceProvider service;

        //constructor 
        public TokenAPI(
            UserManager<ApplicationUser> userManager,
            SignInManager<ApplicationUser> signInManager,
            IConfiguration configuration,
            ApplicationDbContext context,
            IServiceProvider service)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.configuration = configuration;
            this.context = context;
            this.service = service;
        }

        //generates a fake collection for demo purposes
        public List<LoginViewModel> GetFakeData()
        {
            List<LoginViewModel> logins = new List<LoginViewModel>();
            logins.Add(new LoginViewModel()
            {
                Email = "bob@home.com",
                Password = "password"
            });
            logins.Add(new LoginViewModel()
            {
                Email = "fakeuser@home.com",
                Password = "password"
            });
            return logins;

        }

        [HttpGet]
        public IEnumerable<LoginViewModel> GetPublicData()
        {
            //no jwt authorization needed here
            return GetFakeData();
        }

        //this will only be grabbed from authenticated users, notice the authentication scheme
        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public IEnumerable<LoginViewModel> GetPrivateData()
        {
            return GetFakeData();
        }

        // This Action method enables web api login but with the Identity framework
        // that was added when the project was generated by the wizard.
        [HttpPost]
        public async Task<object> Login([FromBody] LoginVM model)
        {
            var result = await signInManager.PasswordSignInAsync(model.Email, model.Password, false, false);
            if(result.Succeeded)
            {
                var appUser = userManager.Users.SingleOrDefault(u => u.Email == model.Email);
                return await GenerateJwtToken(model.Email, appUser); 
            }
            throw new ApplicationException("INVALID_LOGIN_ATTEMPT");
        }
        //now lets register users with the new framework. The users will never register themselves
        //The manager will be the only one able to register users as it is equivalent to hiring a new employee
        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<object> Register([FromBody] RegisterEmployeeVM model)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            if (!PatManagerVerify.CheckIfManager(token, context))
            {
                //if the user isn't a manager then quit the method. Only managers are able to hire new people
                return null;
            }

                var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email
            };
            var result = await userManager.CreateAsync(user, model.Password);
            if (result.Succeeded)
            {
                //add the user to the role of employee straight after being added by the manager
                UserRoleRepo repo = new UserRoleRepo(service);
                await repo.AddUserRole(model.Email, "employee");

                //now add the user details
                UserRepo userRepo = new UserRepo(context,service);
                userRepo.AddUserDetails(user.Id, model.FirstName, model.LastName);

                //The user is never signed in when they are registered. As they are only ever registered through the manager
                //creating the new user
                //await signInManager.SignInAsync(user, false);
                return await GenerateJwtToken(model.Email, user);
            }
            throw new ApplicationException("UNKNOWN_ERROR");
        }
        //this is the task that collects the POSTED schedule and adds it to the database. Only 
        // the manager will be able to post a schedule
        //POST - Schedule
        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public void PostSchedule([FromBody] List<EmployeeShiftVM> shifts)
        {
            // For more detail and better encapsulation (in a service see day 6 OnAuthorization())
            //This is our check to determine whether or not our user is a manager or not
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            if(PatManagerVerify.CheckIfManager(token, context))
            {
                ScheduleRepo sRepo = new ScheduleRepo(context);
                sRepo.AddScheduleItems(shifts);
            }

        }

        //generates a JWT token based upon our specifications in the appsettings.json
        private async Task<object> GenerateJwtToken(string email, IdentityUser user)
        {
            var claims = new List<Claim>
            {
                new Claim(JwtRegisteredClaimNames.Sub, email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                new Claim(ClaimTypes.NameIdentifier,user.Id)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                configuration["TokenInformation:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var expires = DateTime.Now.AddDays(Convert.ToDouble(1));
            var token = new JwtSecurityToken(
                configuration["TokenInformation:Issuer"],
                configuration["TokenInformation:Audience"],
                claims,
                expires: expires,
                signingCredentials: creds
            );
            var formattedToken = new JwtSecurityTokenHandler().WriteToken(token);
            return Ok(new { token = formattedToken });

        }
        [HttpPost]
        public async Task<RoleVM> getRole([FromBody] EmailVM email)
        {
            UserRoleRepo repo = new UserRoleRepo(service);
            RoleVM role = await repo.GetUserRole(email.Email);
            return role;
        }

        //this function is going to return a user vm model for each of the users in the database
        //not neccessary for the roles here but since it is possible for sensitive data to be
        // held in the employee list it makes sense not toi be able to let anyone access this
        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public async Task<List<UserVM>> GetAllUsers()
        {
            UserRepo repo = new UserRepo(context, service);
            List<UserVM> users = await repo.GetAllUsersAsync();
            return users;
        }
        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        //[Authorize(Roles = "Manager")]
        public async Task<List<EmployeeVM>> GetAllEmployees()
        {
            UserRepo repo = new UserRepo(context, service);
            List<EmployeeVM> employees = await repo.GetAllEmployeesAsync();
            return employees;
        }
        //As the employees will obviously need to see their shifts. This has only the authentication of
        // needing the bearer token. So any authorized user will be able to access this
        [HttpGet]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public List<DisplayShiftVM> GetAllShifts()
        {
            UserRepo uRepo = new UserRepo(context, service);

            List<DisplayShiftVM> schedule = new List<DisplayShiftVM>();

            var shifts = context.Schedule;
            if(shifts.Count() != 0)
            {
                foreach (var shift in shifts)
                {
                    EmployeeVM employee = uRepo.GetEmployeeDetails(shift.EmpId);
                    DisplayShiftVM displayShift = new DisplayShiftVM
                    {
                        ShiftId = shift.ShiftId,
                        Firstname = employee.Firstname,
                        Lastname = employee.Lastname,
                        Week = shift.Week,
                        Day = shift.Day,
                        StartTime = shift.StartTime.ToString()
                    };
                    schedule.Add(displayShift);
                }
            }
            

            return schedule;
            
        }

        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public List<DisplayShiftVM> GetShiftsForWeek([FromBody] int week)
        {
            UserRepo uRepo = new UserRepo(context, service);

            List<DisplayShiftVM> schedule = new List<DisplayShiftVM>();

            var shifts = context.Schedule;
            if (shifts.Count() != 0)
            {
                foreach (var shift in shifts)
                {
                    if(shift.Week == week)
                    {
                        EmployeeVM employee = uRepo.GetEmployeeDetails(shift.EmpId);
                        DisplayShiftVM displayShift = new DisplayShiftVM
                        {
                            ShiftId = shift.ShiftId,
                            Firstname = employee.Firstname,
                            Lastname = employee.Lastname,
                            Week = shift.Week,
                            Day = shift.Day,
                            StartTime = shift.StartTime.ToString()
                        };
                        schedule.Add(displayShift);
                    }
                    
                }
            }


            return schedule;
        }
        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public void DeleteShift([FromBody]ShiftIdVM shiftId)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            if (!PatManagerVerify.CheckIfManager(token, context))
            {
                //if the user isn't a manager then quit the method. Only managers are able to hire new people
                return;
            }
            //var query = context.Schedule.Where(s => s.ShiftId == shiftId.shiftId).FirstOrDefault();
            var query = (from s in context.Schedule where s.ShiftId == shiftId.ShiftId select s).First();
            context.Schedule.Remove(query);
            context.SaveChanges();
        }
        [HttpPost]
        [Authorize(AuthenticationSchemes = JwtBearerDefaults.AuthenticationScheme)]
        public void DeleteShiftDay([FromBody] DayShiftVM day)
        {
            var token = Request.Headers["Authorization"].ToString().Replace("Bearer ", "");
            if (!PatManagerVerify.CheckIfManager(token, context))
            {
                //if the user isn't a manager then quit the method. 
                return;
            }
            var query = (from s in context.Schedule where s.Week == day.Week && s.Day == day.Day select s);
            foreach(var q in query)
            {
                context.Schedule.Remove(q);
            }
            context.SaveChanges();
        }

        public class LoginVM
        {
            [Required]
            public string Email { get; set; }
            [Required]
            public string Password { get; set; }
        }
        public class RegisterVM
        {
            [Required]
            public string Email { get; set; }
            [Required]
            [StringLength(100,ErrorMessage = "PASSWORD_MIN_LENGTH", MinimumLength = 6)]
            public string Password { get; set; }
        }

        public static class PatManagerVerify
        {
            public static bool CheckIfManager(string token, ApplicationDbContext context)
            {
                var handler = new JwtSecurityTokenHandler();
                var tokenStr = handler.ReadJwtToken(token) as JwtSecurityToken;
                var userName = tokenStr.Claims.First(claim => claim.Type == "sub").Value;
                var userId = context.Users.Where(u => u.Email == userName).FirstOrDefault();
                var role = context.UserRoles.Where(r => r.UserId == userId.Id).FirstOrDefault();
                if(role.RoleId == "Manager")
                {
                    return true;
                } else
                {
                    return false;
                }
            }
        }
    }
}