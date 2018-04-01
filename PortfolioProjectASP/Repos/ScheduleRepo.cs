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

        public List<DisplayShiftVM> GetShiftsPerEmployee(string email)
        {
            List<DisplayShiftVM> theShifts = new List<DisplayShiftVM>();

            //var user = context.Users.Where(u => u.Email == email).FirstOrDefault();
            //var shifts = context.Schedule.Where(s => s.EmpId == user.Email);

            var query = from u in context.Users
                        from s in context.Schedule
                        from ud in context.UserDetails
                        where u.Email == email
                        where u.Id == s.EmpId
                        where ud.EmpId == u.Id
                        select new
                        {
                            s.ShiftId,
                            ud.Firstname,
                            ud.Lastname,
                            s.Day,
                            s.Week,
                            s.StartTime
                        };

            foreach(var shift in query)
            {
                DisplayShiftVM addShift = new DisplayShiftVM
                {
                    ShiftId = shift.ShiftId,
                    Firstname = shift.Firstname,
                    Lastname = shift.Lastname,
                    Day = shift.Day,
                    Week = shift.Week,
                    StartTime = shift.StartTime.ToString()
                };
                theShifts.Add(addShift);
            }
            return theShifts;
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
