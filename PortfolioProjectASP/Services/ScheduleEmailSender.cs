using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Net.Mime;
using System.Threading.Tasks;

namespace Portfolio_Project.Services
{
    class SchedulerEmailSender
    {
        
        public static void SendSchedule(IConfiguration config, string emailTo)
        {
            try
            {
                MailMessage mailMsg = new MailMessage();

                // To
                mailMsg.To.Add(new MailAddress(emailTo, "To Name"));

                // From
                mailMsg.From = new MailAddress("SchedulePosted@EasyScheduler.com", "From Name");

                // Subject and multipart/alternative Body
                mailMsg.Subject = "New Schedule Posted";
                string text = "Hello Restaurant Employee. A new schedule for the next two weeks has been posted and added to the EasyScheduler website";
                string html = @"<p>A new Schedule has been posted. Check the EasySchedule Website</p>";

                mailMsg.AlternateViews.Add(
                        AlternateView.CreateAlternateViewFromString(text,
                        null, MediaTypeNames.Text.Plain));
                mailMsg.AlternateViews.Add(
                        AlternateView.CreateAlternateViewFromString(html,
                        null, MediaTypeNames.Text.Html));

                // Init SmtpClient and send
                SmtpClient smtpClient
                = new SmtpClient("smtp.sendgrid.net", Convert.ToInt32(587));
                System.Net.NetworkCredential credentials
                = new System.Net.NetworkCredential(config["SendGridUsername"],
                                                   config["SendGridPassword"]);
                smtpClient.Credentials = credentials;
                smtpClient.Send(mailMsg);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
            }
            
        }
    }

}
