using MaskaniDataAccess.DTOs;
using MaskaniDataAccessLayer.DTOs;

namespace MaskaniDataAccess.Interfaces
{
    public interface IStudentRepository:IBasicRepository<clsStudentDTO,clsAddStudentDTO,clsUpdateStudentDTO>
    {
        public Task<bool> ChangePasswordAsync(int studentID, string newPassword);
        public Task<clsStudentDTO> GetStudentByEmail(string email);
        public Task<clsStudentDTO> GetStudentByPersonID(int personID);
    }
}
