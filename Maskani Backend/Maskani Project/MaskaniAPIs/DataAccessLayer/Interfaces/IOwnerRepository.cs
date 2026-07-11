using MaskaniDataAccess.DTOs;
using MaskaniDataAccessLayer.DTOs;

namespace MaskaniDataAccess.Interfaces
{
    public interface IOwnerRepository:IBasicRepository<clsOwnerDTO,clsAddOwnerDTO,clsUpdateOwnerDTO>
    {
        public Task<bool> ChangePasswordAsync(int OwnerID, string newPassword);
        public Task<clsOwnerDTO> LoginAsync(string email, string Password);
        Task<clsOwnerDTO?> GetByEmailAsync(string email); // <-- Added method
        Task<clsOwnerDTO> GetOwnerByPersonID(int PersonID);
    }
}
