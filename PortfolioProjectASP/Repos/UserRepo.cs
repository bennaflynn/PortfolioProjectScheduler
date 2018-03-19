using Portfolio_Project.Data;
using Portfolio_Project.Models;
using Portfolio_Project.Models.AccountViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Portfolio_Project.Repos
{
    public class UserRepo
    {
        ApplicationDbContext context;
        IServiceProvider service;

        public UserRepo(ApplicationDbContext context, IServiceProvider service)
        {
            this.context = context;
            this.service = service;
        }
        public void DeleteUser(string Email)
        {
            var user = context.Users.Where(u => u.Email == Email).FirstOrDefault();
            var userDetails = context.UserDetails.Where(d => d.EmpId == user.Id).FirstOrDefault();
            context.UserDetails.Remove(userDetails);
            context.Users.Remove(user);
            context.SaveChanges();

        }

        public bool AddUserDetails(string Id, string firstname, string lastname)
        {
            var user = context.Users.Where(u => u.Id == Id).FirstOrDefault();
            context.UserDetails.Add(new UserDetails
            {
                EmpId = Id,
                Firstname = firstname,
                Lastname = lastname,
                User = user
            });
            context.SaveChanges();
            return true;
        }

        public EmployeeVM GetEmployeeDetails(string Id)
        {
            var query = context.UserDetails.Where(u => u.EmpId == Id).FirstOrDefault();
            EmployeeVM employee = new EmployeeVM
            {
                Id = query.EmpId,
                Firstname = query.Firstname,
                Lastname = query.Lastname
            };
            return employee;
        }

        //this is going to return all the users in the database and their details
        public async Task<List<UserVM>> GetAllUsersAsync()
        {
            UserRoleRepo repo = new UserRoleRepo(service);

            List<UserVM> users = new List<UserVM>();

            var query = from u in context.Users
                        from d in context.UserDetails
                        where d.EmpId == u.Id
                        select new
                        {
                            u.UserName,
                            d.Firstname,
                            d.Lastname
                        };
            foreach(var q in query)
            {
                RoleVM role = await repo.GetUserRole(q.UserName);
                UserVM user = new UserVM
                {
                    Email = q.UserName,
                    FirstName = q.Firstname,
                    LastName = q.Lastname,
                    Role = role.RoleName
                };
                users.Add(user);
            }

            return users;

        }

        //this is going to return all the employees only
        public async Task<List<EmployeeVM>> GetAllEmployeesAsync()
        {
            UserRoleRepo repo = new UserRoleRepo(service);

            List<EmployeeVM> users = new List<EmployeeVM>();

            var query = from u in context.Users
                        from d in context.UserDetails
                        where d.EmpId == u.Id
                        select new
                        {
                            u.Id,
                            u.UserName,
                            d.Firstname,
                            d.Lastname
                        };
            foreach (var q in query)
            {
                RoleVM role = await repo.GetUserRole(q.UserName);
                if(role.RoleName == "Employee")
                {
                    EmployeeVM user = new EmployeeVM
                    {
                        Id = q.Id,
                        Firstname = q.Firstname,
                        Lastname = q.Lastname

                    };
                    users.Add(user);
                }
                
            }

            return users;
        }

    }
}
