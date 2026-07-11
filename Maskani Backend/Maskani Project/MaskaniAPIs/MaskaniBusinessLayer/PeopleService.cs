using System.Collections.Generic;
using System.Threading.Tasks;
using MaskaniDataAccess.DTOs;
using MaskaniDataAccess.Interfaces;
using MaskaniDataAccessLayer.DTOs;

namespace MaskaniBusinessLayer
{
    public class PeopleService
    {
        private readonly IPeopleRepository _peopleRepository;

        public PeopleService(IPeopleRepository peopleRepository)
        {
            _peopleRepository = peopleRepository;
        }

        public async Task<int> AddPersonAsync(clsAddPeopleDTO dto)
        {
            return await _peopleRepository.AddAsync(dto);
        }

        public async Task<bool> UpdatePersonAsync(clsUpdatePeopleDTO dto)
        {
            return await _peopleRepository.UpdateAsync(dto);
        }

        public async Task<bool> DeletePersonAsync(int personId)
        {
            return await _peopleRepository.DeleteAsync(personId);
        }

        public async Task<List<clsPeopleDTO>> GetAllPeopleAsync()
        {
            return await _peopleRepository.GetAllAsync();
        }

        public async Task<clsPeopleDTO?> GetPersonByIdAsync(int personId)
        {
            return await _peopleRepository.GetByIdAsync(personId);
        }

        public async Task<bool> DoesPersonExistByEmailAsync(string email)
        {
            return await _peopleRepository.DoesPersonExistByEmailAsync(email);
        }
    }
}
