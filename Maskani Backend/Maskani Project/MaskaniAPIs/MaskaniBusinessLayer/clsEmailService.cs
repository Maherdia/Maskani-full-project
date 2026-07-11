using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace Business_Layer
{
    public static class clsEmailService
    {
        public static void SendVerificationEmail(string toEmail, string token)
        {
            string verficationUrl = $"http://Maskani.com/verfiy-email?token={token}";
            MailMessage mail = new MailMessage();
            mail.From = new MailAddress("your-email@example.com");
            mail.To.Add(toEmail);
            mail.Subject = "Verify your email";
            mail.Body = $"Click the following link to verify your email: <a href='{verficationUrl}'>Verify Email</a>";
            mail.IsBodyHtml = true;

            SmtpClient smtp = new SmtpClient("smpt.example.com");
            smtp.Port = 587;
            smtp.Credentials = new NetworkCredential("your-email@example.com", "your-email-password");
            smtp.EnableSsl = true;
            //smtp.Send(mail);
        }
    }
}
