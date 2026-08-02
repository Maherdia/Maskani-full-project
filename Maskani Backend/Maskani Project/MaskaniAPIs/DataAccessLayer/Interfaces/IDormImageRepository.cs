using Repositry_DataAccess_.DTOs;

namespace DataAccessLayer.Interfaces
{
    public interface IDormImageRepository
    {
        Task<int> AddDormImageAsync(
            string dormId,
            string imageUrl,
            string publicId,
            int displayOrder);

        Task<List<clsDormImageDTO>> GetDormImagesAsync(
            string dormId);

        Task<clsDormImageDTO?> GetDormImageByIdAsync(
            int imageId);

        Task<bool> DeleteDormImageAsync(
            int imageId);

        Task<int> CountDormImagesAsync(
            string dormId);
    }
}