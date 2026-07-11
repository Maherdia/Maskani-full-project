using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccessLayer.Interfaces;
using MaskaniDataAccess.DataAccess;
using MaskaniDataAccess.DTOs;

namespace MaskaniBusinessLayer
{
    public class UniversityService
    {
        private readonly IUniversityRepository _universityRepository;
        public UniversityService(IUniversityRepository universityRepository) => _universityRepository = universityRepository;
        public async Task<List<clsUniversityDTO>> GetAllUniversitiesAsync() => await _universityRepository.GetAllAsync();
        public async Task<clsUniversityDTO?> GetUniversityByIdAsync(int id) => await _universityRepository.GetByIdAsync(id);
        public async Task<int> AddUniversityAsync(clsAddUniversityDTO dto) => await _universityRepository.AddAsync(dto);
        public async Task<bool> UpdateUniversityAsync(clsUpdateUniversityDTO dto) => await _universityRepository.UpdateAsync(dto);
        public async Task<bool> DeleteUniversityAsync(int id) => await _universityRepository.DeleteAsync(id);
    }
}
