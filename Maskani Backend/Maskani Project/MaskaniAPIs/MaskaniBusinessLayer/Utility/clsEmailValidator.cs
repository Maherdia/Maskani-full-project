using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;
using System.Threading.Tasks;

namespace MaskaniBusinessLayer.Utility
{
    public static class clsEmailValidator
    {
        public static bool IsValidEmailFormat(string email)
        {
            string pattern = @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";
            return Regex.IsMatch(email, pattern);
        }

        public static bool IsDomainValid(string email)
        {
            try
            {
                string domain = email.Split('@')[1];
                IPHostEntry host = Dns.GetHostEntry(domain);
                return host.AddressList.Length > 0;
            }
            catch
            {
                return false; // Domain does not exist
            }
        }
        public static async Task<bool> VerifyUsingHunterAPI(string email)
        {
            string apiKey = "04bac30660e109c1bb624d3854683d78f4ddb4af"; // Your Hunter.io API key
            string apiUrl = $"https://api.hunter.io/v2/email-verifier?email={email}&api_key={apiKey}";

            using (HttpClient client = new HttpClient())
            {
                try
                {
                    HttpResponseMessage response = await client.GetAsync(apiUrl);
                    if (!response.IsSuccessStatusCode)
                    {
                        string errorResponse = await response.Content.ReadAsStringAsync();
                        Console.WriteLine($"Error: {response.StatusCode} - {errorResponse}");
                        return false;
                    }

                    string result = await response.Content.ReadAsStringAsync();
                    Console.WriteLine($"API Response: {result}");

                    // Parse the response more systematically using JsonDocument
                    using (JsonDocument document = JsonDocument.Parse(result))
                    {
                        JsonElement root = document.RootElement;
                        if (root.TryGetProperty("data", out JsonElement data))
                        {
                            // Get status
                            string? status = data.TryGetProperty("status", out JsonElement statusElement) ? statusElement.GetString() : "";

                            // Get result
                            string? deliverability = data.TryGetProperty("result", out JsonElement resultElement) ? resultElement.GetString() : "";

                            // Get disposable status
                            bool isDisposable = data.TryGetProperty("disposable", out JsonElement disposableElement)
                                ? disposableElement.GetBoolean() : false;

                            // Check all conditions
                            if (status == "valid" && deliverability == "deliverable" && !isDisposable)
                            {
                                return true;
                            }
                        }
                    }
                    return false;
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Exception in Hunter API verification: {ex.Message}");
                    return false;
                }
            }
        }
        public static async Task<bool> IsEmailRealAsync(string email)
        {
            //check in email format 
            if (!clsEmailValidator.IsValidEmailFormat(email))
                return false;

            //check if domain is valid
            if (!clsEmailValidator.IsDomainValid(email))
                return false;

            //  Verify using Hunter.io API
            return await clsEmailValidator.VerifyUsingHunterAPI(email);
        }
    }
}
