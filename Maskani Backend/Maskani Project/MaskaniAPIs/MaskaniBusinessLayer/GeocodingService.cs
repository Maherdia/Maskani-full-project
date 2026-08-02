using System.Globalization;
using System.Text.Json;
using Microsoft.Extensions.Configuration;

namespace MaskaniBusinessLayer
{
    public class GeocodingService
    {
        private static readonly SemaphoreSlim
            RateLimitLock = new(1, 1);

        private static DateTime
            _lastRequestTime = DateTime.MinValue;

        private readonly HttpClient _httpClient;

        public GeocodingService(
            HttpClient httpClient,
            IConfiguration configuration)
        {
            _httpClient = httpClient;

            string userAgent =
                configuration["Geocoding:UserAgent"]
                ?? "MaskaniApp/1.0";

            string? contactEmail =
                configuration[
                    "Geocoding:ContactEmail"];

            string completeUserAgent =
                string.IsNullOrWhiteSpace(contactEmail)
                    ? userAgent
                    : $"{userAgent} ({contactEmail})";

            _httpClient.DefaultRequestHeaders
                .UserAgent.ParseAdd(
                    completeUserAgent);
        }

        public async Task<(
            double? Latitude,
            double? Longitude)>
            GeocodeAddressAsync(string address)
        {
            if (string.IsNullOrWhiteSpace(address))
            {
                return (null, null);
            }

            await RespectRateLimitAsync();

            try
            {
                string encodedAddress =
                    Uri.EscapeDataString(
                        address.Trim());

                string requestUrl =
                    "https://nominatim.openstreetmap.org/" +
                    "search" +
                    $"?q={encodedAddress}" +
                    "&format=json" +
                    "&limit=1";

                using HttpResponseMessage response =
                    await _httpClient.GetAsync(
                        requestUrl);

                if (!response.IsSuccessStatusCode)
                {
                    return (null, null);
                }

                await using Stream responseStream =
                    await response.Content
                        .ReadAsStreamAsync();

                using JsonDocument document =
                    await JsonDocument.ParseAsync(
                        responseStream);

                if (document.RootElement.ValueKind !=
                        JsonValueKind.Array ||
                    document.RootElement
                        .GetArrayLength() == 0)
                {
                    return (null, null);
                }

                JsonElement firstResult =
                    document.RootElement[0];

                string? latitudeText =
                    firstResult
                        .GetProperty("lat")
                        .GetString();

                string? longitudeText =
                    firstResult
                        .GetProperty("lon")
                        .GetString();

                bool latitudeParsed =
                    double.TryParse(
                        latitudeText,
                        NumberStyles.Float,
                        CultureInfo.InvariantCulture,
                        out double latitude);

                bool longitudeParsed =
                    double.TryParse(
                        longitudeText,
                        NumberStyles.Float,
                        CultureInfo.InvariantCulture,
                        out double longitude);

                if (!latitudeParsed ||
                    !longitudeParsed)
                {
                    return (null, null);
                }

                return (latitude, longitude);
            }
            catch
            {
                return (null, null);
            }
        }

        private static async Task
            RespectRateLimitAsync()
        {
            await RateLimitLock.WaitAsync();

            try
            {
                TimeSpan elapsed =
                    DateTime.UtcNow -
                    _lastRequestTime;

                TimeSpan requiredDelay =
                    TimeSpan.FromSeconds(1) -
                    elapsed;

                if (requiredDelay >
                    TimeSpan.Zero)
                {
                    await Task.Delay(requiredDelay);
                }

                _lastRequestTime =
                    DateTime.UtcNow;
            }
            finally
            {
                RateLimitLock.Release();
            }
        }
    }
}