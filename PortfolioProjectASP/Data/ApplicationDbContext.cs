using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Portfolio_Project.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Portfolio_Project.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            //specify the one to one relationship with applicationuser and userdetails
            builder.Entity<ApplicationUser>()
                .HasOne(u => u.UserDetails)
                .WithOne(i => i.User)
                .HasForeignKey<UserDetails>(fk => fk.EmpId)
                ;

            builder.Entity<Schedule>()
                 .HasOne(d => d.DroppedShift)
                 .WithOne(ds => ds.Schedule)
                 .HasForeignKey<DroppedShift>(fk => fk.ShiftId);

            builder.Entity<DroppedShift>()
                 .HasOne(d => d.UserDetails)
                 .WithMany(u => u.DroppedShifts)
                 .HasForeignKey(fk => fk.EmpId);

            //specify the many to one relationship with schedules to applicationuser
            builder.Entity<Schedule>()
                .HasOne(u => u.UserDetails)
                .WithMany(s => s.Schedules)
                .HasForeignKey(fk => fk.EmpId)
                ;

            base.OnModelCreating(builder);
            // Customize the ASP.NET Identity model and override the defaults if needed.
            // For example, you can rename the ASP.NET Identity table names and more.
            // Add your customizations after calling base.OnModelCreating(builder);
        }

        //specify the tables
        public DbSet<UserDetails> UserDetails { get; set; }
        public DbSet<Schedule> Schedule { get; set; }
        public DbSet<DroppedShift> DroppedShifts { get; set; }
    }
    public class UserDetails
    {
        [Key]
      //  [ForeignKey("Id")]
        public string EmpId { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        

        //refer to the parent tables
        public virtual ApplicationUser User { get; set; }

        //refer to the child table
        public IEnumerable<Schedule> Schedules { get; set; } 

        public IEnumerable<DroppedShift> DroppedShifts { get; set; }
           
    }
    public class Schedule
    {
        [Key]
        public string ShiftId { get; set; }
        [ForeignKey("EmpId")]
        public string EmpId { get; set; }
        public string Position { get; set; }
        public string Day { get; set; }
        public int Week { get; set; }
        public TimeSpan StartTime { get; set; }
        

        //refer to the parent table
        public virtual UserDetails UserDetails { get; set; }

        //refer to the 1 - 1 with droppedshift
        public virtual DroppedShift DroppedShift { get; set; }

    }
    public class DroppedShift
    {
        [Key]
        [ForeignKey("ShiftId")]
        public string ShiftId { get; set; }
        [ForeignKey("EmpId")]
        public string EmpId { get; set; }
        public string Day { get; set; }
        public int Week { get; set; }
        public TimeSpan StartTime { get; set; }

        //refer to the parent tables (1 -1 relationship with Schedule)
        public virtual Schedule Schedule { get; set; }
        public virtual UserDetails UserDetails { get; set; }
    }
}
