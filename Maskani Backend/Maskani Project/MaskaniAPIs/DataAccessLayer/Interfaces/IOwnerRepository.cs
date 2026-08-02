using MaskaniDataAccess.DTOs;
using MaskaniDataAccessLayer.DTOs;

namespace MaskaniDataAccess.Interfaces
{
    public interface IOwnerRepository
        : IBasicRepository<clsOwnerDTO, clsAddOwnerDTO, clsUpdateOwnerDTO>
    {
        Task<bool> ChangePasswordAsync(int ownerId, string newPassword);

        Task<clsOwnerDTO?> GetByEmailAsync(string email);

        Task<clsOwnerDTO?> GetOwnerByPersonID(int personId);
    }
}