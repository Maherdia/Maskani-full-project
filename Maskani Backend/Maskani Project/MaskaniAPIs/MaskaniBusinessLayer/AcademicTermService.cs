using MaskaniDataAccess.DTOs;
using DataAccessLayer.Interfaces;

namespace MaskaniBusinessLayer
{
    public class AcademicTermService
    {
        private readonly IAcademicTermRepository _repository;

        public AcademicTermService(IAcademicTermRepository repository)
        {
            _repository = repository;
        }

        public async Task<List<clsAcademicTermDTO>> GetAllTermsAsync() => await _repository.GetAllAsync();

        public async Task<List<clsAcademicTermDTO>> GetActiveTermsAsync() => await _repository.GetActiveTermsAsync();

        public async Task<clsAcademicTermDTO?> GetTermByIdAsync(int id) => await _repository.GetByIdAsync(id);

        public async Task<int> AddTermAsync(clsAddAcademicTermDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                throw new ArgumentException("Term name is required.");

            if (dto.EndDate <= dto.StartDate)
                throw new ArgumentException("End date must be after start date.");

            return await _repository.AddAsync(dto);
        }

        public async Task<bool> UpdateTermAsync(clsUpdateAcademicTermDTO dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Name))
                throw new ArgumentException("Term name is required.");

            if (dto.EndDate <= dto.StartDate)
                throw new ArgumentException("End date must be after start date.");

            return await _repository.UpdateAsync(dto);
        }

        public async Task<bool> DeleteTermAsync(int id) => await _repository.DeleteAsync(id);
    }
}