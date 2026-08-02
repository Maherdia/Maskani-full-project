using MaskaniDataAccess.DTOs;
using MaskaniDataAccess.Interfaces;

namespace DataAccessLayer.Interfaces
{
    public interface IAcademicTermRepository : IBasicRepository<clsAcademicTermDTO, clsAddAcademicTermDTO, clsUpdateAcademicTermDTO>
    {
        Task<List<clsAcademicTermDTO>> GetActiveTermsAsync();
    }
}