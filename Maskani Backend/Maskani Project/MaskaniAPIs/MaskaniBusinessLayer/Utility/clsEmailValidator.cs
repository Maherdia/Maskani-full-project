using System.Net;
using System.Text.Json;
using System.Text.RegularExpressions;
using Microsoft.Extensions.Configuration;

namespace MaskaniBusinessLayer.Utility
{
    public class clsEmailValidator
    {
        private static readonly Regex EmailRegex =
            new(
                @"^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$",
                RegexOptions.Compiled |
                RegexOptions.CultureInvariant);

        private readonly HttpClient _httpClient;
        private readonly string? _hunterApiKey;

        public clsEmailValidator(
            HttpClient httpClient,
            IConfiguration configuration)
        {
            _httpClient = httpClient;

            string? configuredApiKey =
                configuration["Hunter:ApiKey"];

            _hunterApiKey =
                string.IsNullOrWhiteSpace(configuredApiKey)
                    ? null
                    : configuredApiKey.Trim();
        }

        public bool IsValidEmailFormat(string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return false;
            }

            return EmailRegex.IsMatch(email.Trim());
        }

        public async Task<bool> IsDomainValidAsync(
            string email)
        {
            if (!IsValidEmailFormat(email))
            {
                return false;
            }

            string normalizedEmail = email.Trim();

            string domain =
                normalizedEmail.Split('@', 2)[1];

            try
            {
                IPAddress[] addresses =
                    await Dns.GetHostAddressesAsync(domain);

                return addresses.Length > 0;
            }
            catch
            {
                return false;
            }
        }

        public async Task<bool> VerifyUsingHunterApiAsync(
            string email)
        {
            if (!IsValidEmailFormat(email))
            {
                return false;
            }

            /*
             * Hunter is optional.
             *
             * When no Hunter API key is configured, the email has already
             * passed local format and domain validation, so registration
             * is allowed to continue.
             */
            if (string.IsNullOrWhiteSpace(_hunterApiKey))
            {
                return true;
            }

            string encodedEmail =
                Uri.EscapeDataString(email.Trim());

            string encodedApiKey =
                Uri.EscapeDataString(_hunterApiKey);

            string requestUrl =
                "https://api.hunter.io/v2/email-verifier" +
                $"?email={encodedEmail}" +
                $"&api_key={encodedApiKey}";

            try
            {
                using HttpResponseMessage response =
                    await _httpClient.GetAsync(requestUrl);

                if (!response.IsSuccessStatusCode)
                {
                    return false;
                }

                await using Stream responseStream =
                    await response.Content.ReadAsStreamAsync();

                using JsonDocument document =
                    await JsonDocument.ParseAsync(responseStream);

                if (!document.RootElement.TryGetProperty(
                        "data",
                        out JsonElement data))
                {
                    return false;
                }

                string? status =
                    data.TryGetProperty(
                        "status",
                        out JsonElement statusElement)
                        ? statusElement.GetString()
                        : null;

                string? result =
                    data.TryGetProperty(
                        "result",
                        out JsonElement resultElement)
                        ? resultElement.GetString()
                        : null;

                bool isDisposable =
                    data.TryGetProperty(
                        "disposable",
                        out JsonElement disposableElement) &&
                    disposableElement.ValueKind ==
                        JsonValueKind.True;

                return string.Equals(
                           status,
                           "valid",
                           StringComparison.OrdinalIgnoreCase) &&
                       string.Equals(
                           result,
                           "deliverable",
                           StringComparison.OrdinalIgnoreCase) &&
                       !isDisposable;
            }
            catch (
                HttpRequestException)
            {
                return false;
            }
            catch (
                TaskCanceledException)
            {
                return false;
            }
            catch (
                JsonException)
            {
                return false;
            }
        }

        public async Task<bool> IsEmailRealAsync(
            string email)
        {
            if (!IsValidEmailFormat(email))
            {
                return false;
            }

            string normalizedEmail = email.Trim();

            if (!await IsDomainValidAsync(normalizedEmail))
            {
                return false;
            }

            /*
             * Until Hunter approves your account, this returns true after
             * successful format and domain validation.
             */
            if (string.IsNullOrWhiteSpace(_hunterApiKey))
            {
                return true;
            }

            return await VerifyUsingHunterApiAsync(
                normalizedEmail);
        }
    }
}