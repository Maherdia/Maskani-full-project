using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace MaskaniBusinessLayer
{
    public class CloudinaryService
    {
        private readonly Cloudinary _cloudinary;

        public CloudinaryService(
            IConfiguration configuration)
        {
            string cloudName =
                configuration["Cloudinary:CloudName"]
                ?? throw new InvalidOperationException(
                    "Cloudinary cloud name is missing.");

            string apiKey =
                configuration["Cloudinary:ApiKey"]
                ?? throw new InvalidOperationException(
                    "Cloudinary API key is missing.");

            string apiSecret =
                configuration["Cloudinary:ApiSecret"]
                ?? throw new InvalidOperationException(
                    "Cloudinary API secret is missing.");

            if (string.IsNullOrWhiteSpace(cloudName) ||
                string.IsNullOrWhiteSpace(apiKey) ||
                string.IsNullOrWhiteSpace(apiSecret))
            {
                throw new InvalidOperationException(
                    "Cloudinary configuration is incomplete.");
            }

            var account =
                new Account(
                    cloudName,
                    apiKey,
                    apiSecret);

            _cloudinary = new Cloudinary(account)
            {
                Api =
                {
                    Secure = true
                }
            };
        }

        public async Task<(string Url, string PublicId)>
            UploadImageAsync(IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                throw new ArgumentException(
                    "No image was provided.",
                    nameof(file));
            }

            await using Stream stream =
                file.OpenReadStream();

            var uploadParameters =
                new ImageUploadParams
                {
                    File =
                        new FileDescription(
                            file.FileName,
                            stream),

                    Folder = "maskani/dorms",

                    Transformation =
                        new Transformation()
                            .Quality("auto")
                            .FetchFormat("auto")
                };

            ImageUploadResult result =
                await _cloudinary.UploadAsync(
                    uploadParameters);

            if (result.Error != null)
            {
                throw new InvalidOperationException(
                    "Failed to upload image.");
            }

            if (result.SecureUrl == null ||
                string.IsNullOrWhiteSpace(
                    result.PublicId))
            {
                throw new InvalidOperationException(
                    "Cloudinary returned an invalid upload result.");
            }

            return (
                result.SecureUrl.ToString(),
                result.PublicId);
        }

        public async Task DeleteImageAsync(
            string publicId)
        {
            if (string.IsNullOrWhiteSpace(publicId))
            {
                return;
            }

            var deletionParameters =
                new DeletionParams(publicId);

            DeletionResult result =
                await _cloudinary.DestroyAsync(
                    deletionParameters);

            if (result.Error != null)
            {
                throw new InvalidOperationException(
                    "Failed to delete the image.");
            }
        }
    }
}