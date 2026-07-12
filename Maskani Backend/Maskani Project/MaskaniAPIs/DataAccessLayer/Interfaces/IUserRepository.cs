using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MaskaniDataAccess.DTOs;
using MaskaniDataAccessLayer.DTOs;

namespace MaskaniDataAccess.Interfaces
{
    public interface IUserRepository:IBasicRepository<clsUserDTO,clsAddUserDTO,clsUpdateUserDTO>
    {
        public Task<bool> ChangePasswordAsync(int ID, string newPassword);
        public Task<clsUserDTO> GetUserByEmailAsync(string email);
        public Task<clsUserDTO?> GetUserByPersonID(int PersonID);
    }
}
