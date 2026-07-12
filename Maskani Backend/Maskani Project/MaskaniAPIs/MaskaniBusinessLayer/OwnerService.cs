using DataAccessLayer;
using MaskaniBusinessLayer.Utility;
using MaskaniDataAccess.DTOs;
using MaskaniDataAccess.Interfaces;
using MaskaniDataAccessLayer.DTOs;

namespace MaskaniBusinessLayer
{
    public class OwnerService
    {
        private readonly IOwnerRepository _ownerRepository;

        public OwnerService(IOwnerRepository ownerRepository) => _ownerRepository = ownerRepository;
        public async Task<int> AddOwnerAsync(clsAddOwnerDTO dto)
        {
            if (await clsEmailValidator.IsEmailRealAsync(dto.Email))
            {
                return await _ownerRepository.AddAsync(dto);
            }
            else
            {
                throw new ArgumentException("Invalid email address.");
            }
        }
        public async Task<bool> UpdateOwnerAsync(clsUpdateOwnerDTO dto)
        {
            if (await clsEmailValidator.IsEmailRealAsync(dto.Email))
            {
                return await _ownerRepository.UpdateAsync(dto);
            }
            else
            {
                throw new ArgumentException("Invalid email address.");
            }
        }
        public async Task<bool> DeleteOwnerAsync(int ownerId) => await _ownerRepository.DeleteAsync(ownerId);
        public async Task<List<clsOwnerDTO>> GetAllOwnersAsync() => await _ownerRepository.GetAllAsync();
        public async Task<clsOwnerDTO?> GetOwnerByIdAsync(int ownerId) => await _ownerRepository.GetByIdAsync(ownerId);
        public async Task<bool> ChangePasswordAsync(int ownerId, string newPassword) => 
            await _ownerRepository.ChangePasswordAsync(ownerId, newPassword);
        public async Task<clsOwnerDTO?> LoginAsync(string email, string password)
        {
            var owner = await _ownerRepository.GetByEmailAsync(email);

            if (owner == null)
                return null;

            if (!clsHashing.VerifyPassword(password, owner.Password))
                return null;

            owner.Password = null;

            return owner;
        }

        public async Task<bool> VerifyPasswordAsync(string email, string password)
        {
            var owner = await _ownerRepository.GetByEmailAsync(email);

            if (owner == null)
                return false;

            return clsHashing.VerifyPassword(password, owner.Password);
        }
        public async Task<clsOwnerDTO> GetOwnerByPersonID(int personID)=> await _ownerRepository.GetOwnerByPersonID(personID);
        public async Task<clsOwnerDTO?> GetByEmailAsync(string email)=> await _ownerRepository.GetByEmailAsync(email);
    }
}
