using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Portfolio_Project.Data;
using Portfolio_Project.Models;
using Portfolio_Project.Services;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.AspNetCore.Http;
using System.IO;

namespace Portfolio_Project
{
    public class Startup
    {
        //public Startup(IConfiguration configuration)
        //{
        //    Configuration = configuration;
        //}
        public Startup(IHostingEnvironment env)
        {
            var builder = new ConfigurationBuilder()
                .SetBasePath(env.ContentRootPath)
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true);

            // Use secrets.json if in development.
            if (env.IsDevelopment())
            {
                builder.AddUserSecrets<Startup>();
            }
            Configuration = builder.Build();
        }


        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            string testSecret = Configuration["TestSecret"];

            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlite(Configuration.GetConnectionString("DefaultConnection")));

            services.AddIdentity<ApplicationUser, IdentityRole>()
                .AddEntityFrameworkStores<ApplicationDbContext>()
                .AddDefaultTokenProviders();

            // Add application services.
            services.AddTransient<IEmailSender, EmailSender>();

            // Call this before AddMvc()
            services.AddCors(options => {
                options.AddPolicy("AllowAll",
                    builder =>
                    {
                        builder
                        .AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader()
                        .AllowCredentials();
                    });
            });

            // Add this before services.AddMvc()
            JwtSecurityTokenHandler.DefaultInboundClaimTypeMap.Clear();
            services.AddAuthentication()
            .AddJwtBearer(cfg => {
                cfg.RequireHttpsMetadata = false;
                cfg.SaveToken = true;
                cfg.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidIssuer = Configuration["TokenInformation:Issuer"],
                    ValidAudience = Configuration["TokenInformation:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["TokenInformation:Key"])),
                    ClockSkew = TimeSpan.Zero // remove delay of token when expire
    };
            });

            //policy makes it so that only managers can do certain thigns
            services.AddAuthorization(options =>
            {
                options.AddPolicy("OnlyManager", policy => policy.RequireRole("Manager"));
            });

            services.AddMvc();

            
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
            }

            ////add this at the start of Configure
            //app.Use(async (HttpContext context, Func<Task> next) =>
            //{
            //    await next.Invoke();

            //    if (context.Response.StatusCode == 404)
            //    {
            //        context.Request.Path = new PathString("/index.html");
            //        await next.Invoke();
            //    }
            //});

            // app.UseStaticFiles();

            // Place this code before app.UseMvc() inside Configure().
            //Set up so Angular routing can take over when item not found.
            app.Use(async (context, next) =>
            {
                await next();
                if (context.Response.StatusCode == 404)
                {
                    context.Request.Path = "/dist/index.html";
                    await next();
                }
            }).UseDefaultFiles().UseStaticFiles();

            //\/ this was added 
            //app.UseDefaultFiles();



            app.UseAuthentication();
            app.UseCors("AllowAll");


            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}
