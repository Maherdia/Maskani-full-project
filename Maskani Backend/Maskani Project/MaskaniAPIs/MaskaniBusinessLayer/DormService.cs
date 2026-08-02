using DataAccessLayer.Interfaces;
using Repositry_DataAccess_.DTOs;

namespace MaskaniBusinessLayer
{
    public class DormService
    {
        private static readonly string[] ValidStatuses =
        {
            "Pending",
            "Approved",
            "Rejected"
        };

        private readonly IDormRepository _dormRepository;
        private readonly GeocodingService _geocodingService;

        public DormService(
            IDormRepository dormRepository,
            GeocodingService geocodingService)
        {
            _dormRepository =
                dormRepository ??
                throw new ArgumentNullException(
                    nameof(dormRepository));

            _geocodingService =
                geocodingService ??
                throw new ArgumentNullException(
                    nameof(geocodingService));
        }

        public async Task<List<clsDormDTO>> GetAllDormsAsync()
        {
            return await _dormRepository.GetAllDormsAsync();
        }

        public async Task<clsDormDTO?> GetDormByIdAsync(
            string dormId)
        {
            if (string.IsNullOrWhiteSpace(dormId))
            {
                return null;
            }

            return await _dormRepository.GetDormByIdAsync(
                dormId.Trim());
        }

        public async Task<List<clsDormDTO>> GetPendingDormsAsync()
        {
            return await _dormRepository.GetPendingDormsAsync();
        }

        public async Task<bool> UpdateDormStatusAsync(
            string dormId,
            string dormStatus)
        {
            if (string.IsNullOrWhiteSpace(dormId))
            {
                throw new ArgumentException(
                    "Dorm ID is required.",
                    nameof(dormId));
            }

            if (string.IsNullOrWhiteSpace(dormStatus))
            {
                throw new ArgumentException(
                    "Dorm status is required.",
                    nameof(dormStatus));
            }

            string normalizedStatus =
                ValidStatuses.FirstOrDefault(
                    status =>
                        string.Equals(
                            status,
                            dormStatus.Trim(),
                            StringComparison.OrdinalIgnoreCase))
                ?? throw new ArgumentException(
                    $"Invalid status. Must be one of: " +
                    $"{string.Join(", ", ValidStatuses)}",
                    nameof(dormStatus));

            return await _dormRepository.UpdateDormStatusAsync(
                dormId.Trim(),
                normalizedStatus);
        }

        public async Task<string> AddDormAsync(
            clsAddDormDTO dorm)
        {
            ArgumentNullException.ThrowIfNull(dorm);

            if (NeedsGeocoding(
                    dorm.Latitude,
                    dorm.Longitude))
            {
                if (string.IsNullOrWhiteSpace(dorm.Address))
                {
                    throw new ArgumentException(
                        "A valid address is required when coordinates " +
                        "are not provided.",
                        nameof(dorm));
                }

                (double? latitude, double? longitude) =
                    await _geocodingService.GeocodeAddressAsync(
                        dorm.Address.Trim());

                if (latitude is null || longitude is null)
                {
                    throw new InvalidOperationException(
                        "The address could not be converted into coordinates.");
                }

                dorm.Latitude = latitude;
                dorm.Longitude = longitude;
            }

            return await _dormRepository.AddDormAsync(dorm);
        }

        public async Task<bool> UpdateDormAsync(
            clsUpdateDormDTO dorm)
        {
            ArgumentNullException.ThrowIfNull(dorm);

            if (NeedsGeocoding(
                    dorm.Latitude,
                    dorm.Longitude))
            {
                if (string.IsNullOrWhiteSpace(dorm.Address))
                {
                    throw new ArgumentException(
                        "A valid address is required when coordinates " +
                        "are not provided.",
                        nameof(dorm));
                }

                (double? latitude, double? longitude) =
                    await _geocodingService.GeocodeAddressAsync(
                        dorm.Address.Trim());

                if (latitude is null || longitude is null)
                {
                    throw new InvalidOperationException(
                        "The address could not be converted into coordinates.");
                }

                dorm.Latitude = latitude;
                dorm.Longitude = longitude;
            }

            return await _dormRepository.UpdateDormAsync(dorm);
        }

        public async Task<bool> DeleteDormAsync(
            string dormId)
        {
            return await _dormRepository.DeleteDormAsync(dormId);
        }

        public async Task<List<clsDormDTO>>
            GetDormsByUniversityAsync(
                string universityName)
        {
            return await _dormRepository
                .GetDormsByUniversityAsync(universityName);
        }

        public async Task<List<clsDormDTO>>
            GetDormsByOwnerAsync(
                string ownerName)
        {
            return await _dormRepository
                .GetDormsByOwnerAsync(ownerName);
        }

        public async Task<List<clsDormDTO>>
            GetDormsByFurnishingAsync(
                bool furnishedOrNot)
        {
            return await _dormRepository
                .GetDormsByFurnishingAsync(furnishedOrNot);
        }

        public async Task<List<clsDormDTO>>
            GetDormsByDistanceAsync(
                double maxDistance)
        {
            return await _dormRepository
                .GetDormsByDistanceAsync(maxDistance);
        }

        public async Task<List<clsDormDTO>>
            GetDormsByAddressAsync(
                string address)
        {
            return await _dormRepository
                .GetDormsByAddressAsync(address);
        }

        public async Task<List<clsDormDTO>>
            GetDormsByOwnerIdAsync(
                int ownerID)
        {
            return await _dormRepository
                .GetDormsByOwnerIDAsync(ownerID);
        }

        public async Task<List<clsDormDTO>> SearchDormsAsync(
            string? university = null,
            bool? furnished = null,
            double? maxDistance = null,
            string? address = null,
            string? dormName = null)
        {
            return await _dormRepository.SearchDormsAsync(
                university,
                furnished,
                maxDistance,
                address,
                dormName);
        }

        public async Task<int> GetDormCountByUniversityAsync(
            string universityName)
        {
            return await _dormRepository
                .GetDormCountByUniversityAsync(universityName);
        }

        public async Task<List<clsDormDTO>> GetDormsPagedAsync(
            int pageIndex,
            int pageSize)
        {
            return await _dormRepository.GetDormsPagedAsync(
                pageIndex,
                pageSize);
        }

        public async Task<int> GetTotalDormsAsync()
        {
            return await _dormRepository.GetTotalDormsAsync();
        }

        public async Task<bool> DormExistsAsync(
            string dormId)
        {
            return await _dormRepository.DormExistsAsync(dormId);
        }

        public async Task<bool> DormNameExistsAsync(
            string dormName)
        {
            return await _dormRepository
                .DormNameExistsAsync(dormName);
        }

        private static bool NeedsGeocoding(
            double? latitude,
            double? longitude)
        {
            return latitude is null ||
                   longitude is null ||
                   (latitude == 0 && longitude == 0);
        }
    }
}