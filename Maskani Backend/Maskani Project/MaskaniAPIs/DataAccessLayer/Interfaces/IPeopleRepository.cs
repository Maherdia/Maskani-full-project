using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MaskaniDataAccessLayer.DTOs;

namespace MaskaniDataAccess.Interfaces
{
    public interface IPeopleRepository:IBasicRepository<clsPeopleDTO, clsAddPeopleDTO, clsUpdatePeopleDTO>
    {
        Task<bool> DoesPersonExistByEmailAsync(string email);
    }
}
