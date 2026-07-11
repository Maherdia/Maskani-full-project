using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MaskaniDataAccess.Interfaces;
using Repositry_DataAccess_.DTOs;

namespace DataAccessLayer.Interfaces
{
    public interface IDormRepository
    {
        Task<List<clsDormDTO>> GetAllDormsAsync();
        Task<clsDormDTO> GetDormByIdAsync(string dormId);
        Task<string> AddDormAsync(clsAddDormDTO dorm);
        Task<bool> UpdateDormAsync(clsUpdateDormDTO dorm);
        Task<bool> DeleteDormAsync(string dormId);

        Task<List<clsDormDTO>> GetDormsByUniversityAsync(string universityName);
        Task<List<clsDormDTO>> GetDormsByOwnerAsync(string ownerName);
        Task<List<clsDormDTO>> GetDormsByOwnerIDAsync(int ownerID);
        Task<List<clsDormDTO>> GetDormsByFurnishingAsync(bool furnishedOrNot);
        Task<List<clsDormDTO>> GetDormsByDistanceAsync(double maxDistance);
        Task<List<clsDormDTO>> GetDormsByAddressAsync(string address);

        //these for admin panel
        Task<List<clsDormDTO>> SearchDormsAsync(string? university = null, bool? furnished = null, double? maxDistance = null, string? address = null,string? dormName = null);
        //Task<int> GetDormCountAsync();
        Task<int> GetDormCountByUniversityAsync(string universityName);
        Task<List<clsDormDTO>> GetDormsPagedAsync(int pageIndex, int pageSize);
        Task<int> GetTotalDormsAsync();
        Task<bool> DormExistsAsync(string dormId);
        Task<bool> DormNameExistsAsync(string dormName);
    }
}
