using Portfolio_Project.Data;
using Portfolio_Project.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Portfolio_Project.Repos
{
    public class ScheduleRepo
    {
        ApplicationDbContext context;
        public ScheduleRepo(ApplicationDbContext context)
        {
            this.context = context;
        }

        
        public void AddScheduleItems(List<EmployeeShiftVM> shifts)
        {
            foreach(EmployeeShiftVM shift in shifts)
            {

                context.Schedule.Add(new Schedule
                {
                    EmpId = shift.Id,
                    Position = "Employee",
                    Day = shift.Day,
                    Week = Int32.Parse(shift.Week),
                    StartTime = TimeSpan.Parse(shift.StartTime)
                });
                context.SaveChanges();
            }
        }
    }
}
