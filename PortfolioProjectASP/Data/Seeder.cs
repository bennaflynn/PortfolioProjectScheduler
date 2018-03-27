using Microsoft.AspNetCore.Identity;
using Portfolio_Project.Models;
using Portfolio_Project.Repos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Portfolio_Project.Data
{
    public class Seeder
    {
        UserManager<ApplicationUser> userManager;
        ApplicationDbContext context;
        IServiceProvider service;
        public Seeder(UserManager<ApplicationUser> userManager, ApplicationDbContext context, IServiceProvider service)
        {
            this.userManager = userManager;
            this.context = context;
            this.service = service;
        }
        public async Task SeedDataAsync()
        {
            var users = context.Users;
            if(users.Count() > 0)
            {
                return;
            }

            string password = "Test-0";

            var manager = new ApplicationUser
            {
                UserName = "manager@restaurant.com",
                Email = "manager@restaurant.com"
            };
            var result = await userManager.CreateAsync(manager, password);
            if (result.Succeeded)
            {             
                UserRoleRepo repo = new UserRoleRepo(service);
                await repo.AddUserRole(manager.Email, "Manager");

                UserRepo userRepo = new UserRepo(context, service);
                userRepo.AddUserDetails(manager.Id, "Default", "Manager"); 
            }

            var user1 = new ApplicationUser
            {
                UserName = "Jack@restaurant.com",
                Email = "Jack@restaurant.com"
            };
            var result1 = await userManager.CreateAsync(user1, password);
            if (result1.Succeeded)
            {
                UserRoleRepo repo = new UserRoleRepo(service);
                await repo.AddUserRole(user1.Email, "Employee");

                UserRepo userRepo = new UserRepo(context, service);
                userRepo.AddUserDetails(user1.Id, "Jack", "Employee");
            }
            var user2 = new ApplicationUser
            {
                UserName = "Matthew@restaurant.com",
                Email = "Matthew@restaurant.com"
            };
            var result2 = await userManager.CreateAsync(user2, password);
            if (result2.Succeeded)
            {
                UserRoleRepo repo = new UserRoleRepo(service);
                await repo.AddUserRole(user2.Email, "Employee");

                UserRepo userRepo = new UserRepo(context, service);
                userRepo.AddUserDetails(user2.Id, "Matthew", "Employee");
            }
            var user3 = new ApplicationUser
            {
                UserName = "Chris@restaurant.com",
                Email = "Chris@restaurant.com"
            };
            var result3 = await userManager.CreateAsync(user3, password);
            if (result3.Succeeded)
            {
                UserRoleRepo repo = new UserRoleRepo(service);
                await repo.AddUserRole(user3.Email, "Employee");

                UserRepo userRepo = new UserRepo(context, service);
                userRepo.AddUserDetails(user3.Id, "Chris", "Employee");
            }
        }
    }
}
