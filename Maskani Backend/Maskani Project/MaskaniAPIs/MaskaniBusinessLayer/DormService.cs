using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;
using DataAccessLayer.Interfaces;
using Repositry_DataAccess_.DataAccess;
using Repositry_DataAccess_.DTOs;

namespace MaskaniBusinessLayer
{
    public class DormService
    {
        private readonly IDormRepository _dormRepository;
        public DormService(IDormRepository dormRepository)
        {
            _dormRepository = dormRepository;
        }
        public async Task<List<clsDormDTO>> GetAllDormsAsync() => await _dormRepository.GetAllDormsAsync();
        public async Task<clsDormDTO> GetDormByIdAsync(string dormId) => await _dormRepository.GetDormByIdAsync(dormId);
        public async Task<string> AddDormAsync(clsAddDormDTO dorm) => await _dormRepository.AddDormAsync(dorm);
        public async Task<bool> UpdateDormAsync(clsUpdateDormDTO dorm) => await _dormRepository.UpdateDormAsync(dorm);
        public async Task<bool> DeleteDormAsync(string dormId) => await _dormRepository.DeleteDormAsync(dormId);
        public async Task<List<clsDormDTO>> GetDormsByUniversityAsync(string universityName) => await _dormRepository.GetDormsByUniversityAsync(universityName);
        public async Task<List<clsDormDTO>> GetDormsByOwnerAsync(string ownerName) => await _dormRepository.GetDormsByOwnerAsync(ownerName);
        public async Task<List<clsDormDTO>> GetDormsByFurnishingAsync(bool furnishedOrNot) => await _dormRepository.GetDormsByFurnishingAsync(furnishedOrNot);
        public async Task<List<clsDormDTO>> GetDormsByDistanceAsync(double maxDistance) => await _dormRepository.GetDormsByDistanceAsync(maxDistance);
        public async Task<List<clsDormDTO>> GetDormsByAddressAsync(string address) => await _dormRepository.GetDormsByAddressAsync(address);
        public async Task<List<clsDormDTO>> GetDormsByOwnerIdAsync(int ownerID) => await _dormRepository.GetDormsByOwnerIDAsync(ownerID);
        public async Task<List<clsDormDTO>> SearchDormsAsync
            (string? university = null, bool? furnished = null, double? maxDistance = null, string? address = null,string? dormName=null) => await _dormRepository.SearchDormsAsync(university, furnished, maxDistance, address, dormName);
        public async Task<int> GetDormCountByUniversityAsync(string universityName) => await _dormRepository.GetDormCountByUniversityAsync(universityName);
        public async Task<List<clsDormDTO>> GetDormsPagedAsync(int pageIndex, int pageSize) => await _dormRepository.GetDormsPagedAsync(pageIndex, pageSize);
        public async Task<int> GetTotalDormsAsync() => await _dormRepository.GetTotalDormsAsync();
        public async Task<bool> DormExistsAsync(string dormId) => await _dormRepository.DormExistsAsync(dormId);
        public async Task<bool> DormNameExistsAsync(string dormName) => await _dormRepository.DormNameExistsAsync(dormName);

    }
}
