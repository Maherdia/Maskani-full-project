using DataAccessLayer.Interfaces;
using Microsoft.AspNetCore.Http;
using Repositry_DataAccess_.DTOs;

namespace MaskaniBusinessLayer
{
    public class DormImageService
    {
        private const long MaxFileSizeBytes =
            5 * 1024 * 1024;

        private const int MaxImagesPerDorm = 15;

        private static readonly HashSet<string>
            AllowedContentTypes =
                new(StringComparer.OrdinalIgnoreCase)
                {
                    "image/jpeg",
                    "image/png",
                    "image/webp"
                };

        private readonly IDormImageRepository
            _dormImageRepository;

        private readonly CloudinaryService
            _cloudinaryService;

        public DormImageService(
            IDormImageRepository dormImageRepository,
            CloudinaryService cloudinaryService)
        {
            _dormImageRepository =
                dormImageRepository;

            _cloudinaryService =
                cloudinaryService;
        }

        public async Task<clsDormImageDTO>
            UploadDormImageAsync(
                string dormId,
                IFormFile file)
        {
            if (string.IsNullOrWhiteSpace(dormId))
            {
                throw new ArgumentException(
                    "Dorm ID is required.",
                    nameof(dormId));
            }

            if (file == null || file.Length == 0)
            {
                throw new ArgumentException(
                    "No file was provided.",
                    nameof(file));
            }

            if (file.Length > MaxFileSizeBytes)
            {
                throw new ArgumentException(
                    "The image exceeds the 5 MB limit.",
                    nameof(file));
            }

            if (!AllowedContentTypes.Contains(
                    file.ContentType))
            {
                throw new ArgumentException(
                    "Only JPEG, PNG, or WEBP images are allowed.",
                    nameof(file));
            }

            string normalizedDormId = dormId.Trim();

            int currentCount =
                await _dormImageRepository
                    .CountDormImagesAsync(
                        normalizedDormId);

            if (currentCount >= MaxImagesPerDorm)
            {
                throw new InvalidOperationException(
                    $"This dorm already has the maximum of {MaxImagesPerDorm} images.");
            }

            var uploadResult =
                await _cloudinaryService
                    .UploadImageAsync(file);

            string url = uploadResult.Url;
            string publicId = uploadResult.PublicId;

            int newImageId =
                await _dormImageRepository
                    .AddDormImageAsync(
                        normalizedDormId,
                        url,
                        publicId,
                        currentCount);

            return new clsDormImageDTO
            {
                ImageID = newImageId,
                DormID = normalizedDormId,
                ImageUrl = url,
                PublicId = publicId,
                DisplayOrder = currentCount,
                UploadedAt = DateTime.UtcNow
            };
        }

        public async Task<List<clsDormImageDTO>>
            GetDormImagesAsync(string dormId)
        {
            if (string.IsNullOrWhiteSpace(dormId))
            {
                return new List<clsDormImageDTO>();
            }

            return await _dormImageRepository
                .GetDormImagesAsync(
                    dormId.Trim());
        }

        public async Task<clsDormImageDTO?>
            GetDormImageByIdAsync(int imageId)
        {
            if (imageId <= 0)
            {
                return null;
            }

            return await _dormImageRepository
                .GetDormImageByIdAsync(imageId);
        }

        public async Task<bool> DeleteDormImageAsync(
            int imageId)
        {
            if (imageId <= 0)
            {
                return false;
            }

            var image =
                await _dormImageRepository
                    .GetDormImageByIdAsync(imageId);

            if (image == null)
            {
                return false;
            }

            if (!string.IsNullOrWhiteSpace(
                    image.PublicId))
            {
                await _cloudinaryService
                    .DeleteImageAsync(
                        image.PublicId);
            }

            return await _dormImageRepository
                .DeleteDormImageAsync(imageId);
        }
    }
}