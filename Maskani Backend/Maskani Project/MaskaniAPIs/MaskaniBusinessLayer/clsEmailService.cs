using System;
using System.Net;
using System.Net.Mail;

namespace Business_Layer
{
    public static class clsEmailService
    {
        public static void SendVerificationEmail(string toEmail, string token)
        {
            string verificationUrl = $"http://Maskani.com/verify-email?token={token}";

            using var mail = new MailMessage();
            mail.From = new MailAddress("your-email@example.com");
            mail.To.Add(toEmail);
            mail.Subject = "Verify your email";
            mail.Body = $"Click the following link to verify your email: <a href='{verificationUrl}'>Verify Email</a>";
            mail.IsBodyHtml = true;

            using var smtp = new SmtpClient("smtp.example.com")
            {
                Port = 587,
                Credentials = new NetworkCredential(
                    "your-email@example.com",
                    "your-email-password"),
                EnableSsl = true
            };

            try
            {
                // smtp.Send(mail);
            }
            catch
            {
                throw new InvalidOperationException("Failed to send verification email.");
            }
        }
    }
}