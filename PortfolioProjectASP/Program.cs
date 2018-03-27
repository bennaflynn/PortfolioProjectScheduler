using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Portfolio_Project.Repos;
using Microsoft.Extensions.DependencyInjection;
using Portfolio_Project.Data;
using Microsoft.AspNetCore.Identity;
using Portfolio_Project.Models;

namespace Portfolio_Project
{
    public class Program
    {
        public static void Main(string[] args)
        {
            
            var host = BuildWebHost(args);

            using (var scope = host.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                try
                {
                    var context = services.GetRequiredService<ApplicationDbContext>();
                    var usermanager = services.GetRequiredService<UserManager<ApplicationUser>>();

                    //create the initial roles and add them to the database
                    RoleRepo roleRepo = new RoleRepo(context);
                    roleRepo.CreateInitialRoles();
                    Seeder seeder = new Seeder(usermanager, context, services);
                    seeder.SeedDataAsync().Wait();
                } catch(Exception e)
                {
                    var logger = services.GetRequiredService<ILogger<Program>>();
                    logger.LogError(e, "An error occurred while seeding the database.");
                }
            }
            host.Run();
        }

        public static IWebHost BuildWebHost(string[] args) =>
            WebHost.CreateDefaultBuilder(args)
                .UseStartup<Startup>()
                .Build();
    }
}
