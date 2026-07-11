using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccessLayer.Interfaces;
using MaskaniDataAccessLayer.DataHelper;
using Microsoft.Extensions.Configuration;
using Repositry_DataAccess_.DTOs;

namespace Repositry_DataAccess_.DataAccess
{
    public class DormRepository : BaseRepository, IDormRepository
    {
        public DormRepository(IConfiguration configuration) : base(configuration.GetConnectionString("DefaultConnection")) { }

        public Task<string> AddDormAsync(clsAddDormDTO dorm)
        {
            return ExecuteCommandAsync("SP_AddNewDorm", cmd =>
            {
                cmd.Parameters.AddWithValue("@DormID", dorm.DormID);
                cmd.Parameters.AddWithValue("@OwnerID", dorm.OwnerID);
                cmd.Parameters.AddWithValue("@UniversityID", dorm.UniversityID);
                cmd.Parameters.AddWithValue("@DormName", dorm.DormName);
                cmd.Parameters.AddWithValue("@Address", dorm.Address);
                cmd.Parameters.AddWithValue("@FurnishedOrNot", dorm.FurnishedOrNot);
                cmd.Parameters.AddWithValue("@Distance", dorm.Distance);
            }, async cmd =>
            {
                var result = await cmd.ExecuteScalarAsync();
                return result?.ToString() ?? string.Empty;
            });
        }

        public Task<bool> DeleteDormAsync(string dormId)
        {
            return ExecuteCommandAsync("SP_DeleteDorm", cmd =>
            {
                cmd.Parameters.AddWithValue("@DormID", dormId);
            }, async cmd =>
            {
                var result = await cmd.ExecuteNonQueryAsync();
                return result > 0;
            });
        }

        public Task<bool> DormExistsAsync(string dormId)
        {
            return ExecuteCommandAsync("SP_DormExists", cmd =>
            {
                cmd.Parameters.AddWithValue("@DormID", dormId);
            }, async cmd =>
            {
                var result = await cmd.ExecuteScalarAsync();
                 return Convert.ToBoolean(result);
            });
        }

        public Task<bool> DormNameExistsAsync(string dormName)
        {
            return ExecuteCommandAsync("SP_DormNameExists", cmd =>
            {
                cmd.Parameters.AddWithValue("@DormName", dormName);
            }, async cmd =>
            {
                var result = await cmd.ExecuteScalarAsync();
                return Convert.ToBoolean(result);
            });
        }

        public Task<List<clsDormDTO>> GetAllDormsAsync()
        {
            return ExecuteCommandAsync("SP_GetAllDorms", cmd => { }, async cmd =>
            {
                var dorms = new List<clsDormDTO>();
                await using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    var dorm = new clsDormDTO(
                        reader["DormID"].ToString(),
                        reader["DormName"].ToString(),
                        reader["Address"].ToString(),
                        Convert.ToBoolean(reader["FurnishedOrNot"]),
                        Convert.ToDouble(reader["Distance"]),
                        reader["UniversityName"].ToString(),
                        reader["OwnerName"].ToString(),
                        reader["Phone"].ToString()
                    );
                    dorms.Add(dorm);
                }
                return dorms;
            });
        }

        public  Task<clsDormDTO?> GetDormByIdAsync(string dormId)
        {
            return ExecuteCommandAsync("SP_GetOwnerDataByDormID", cmd =>
            {
                cmd.Parameters.AddWithValue("@DormID", dormId);
            }, async cmd =>
            {
                await using var reader = await cmd.ExecuteReaderAsync();


                if (await reader.ReadAsync())
                {
                    var Dorm = new clsDormDTO(
                        reader["DormID"].ToString(),
                        reader["DormName"].ToString(),
                        reader["Address"].ToString(),
                        Convert.ToBoolean(reader["FurnishedOrNot"]),
                        Convert.ToDouble(reader["Distance"]),
                        reader["UniversityName"].ToString(),
                        reader["OwnerName"].ToString(),
                        reader["Phone"].ToString(),
                        reader["Email"].ToString()
                    );
                    return Dorm;
                }
                else
                    return null;

            });
        }

        //public Task<int> GetDormCountAsync()
        //{
        //    return ExecuteCommandAsync("SP_GetDormCount", cmd => { }, async cmd =>
        //    {
        //        var result = await cmd.ExecuteScalarAsync();
        //        return Convert.ToInt32(result);
        //    });
        //}

        public Task<int> GetDormCountByUniversityAsync(string universityName)
        {
            return ExecuteCommandAsync("SP_GetDormCountByUniversity", cmd =>
            {
                cmd.Parameters.AddWithValue("@UniversityName", universityName);
            }, async cmd =>
            {
                var result = await cmd.ExecuteScalarAsync();
                return Convert.ToInt32(result);
            });
        }

        public Task<List<clsDormDTO>> GetDormsByAddressAsync(string address)
        {
            return ExecuteCommandAsync("SP_GetDormsByAddress", cmd =>
            {
                cmd.Parameters.AddWithValue("@Address", address);
            }, async cmd =>
            {
                var dorms = new List<clsDormDTO>();
                await using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    var dorm = new clsDormDTO(
                        reader["DormID"].ToString(),
                        reader["DormName"].ToString(),
                        reader["Address"].ToString(),
                        Convert.ToBoolean(reader["FurnishedOrNot"]),
                        Convert.ToDouble(reader["Distance"]),
                        reader["UniversityName"].ToString(),
                        reader["OwnerName"].ToString(),
                        reader["Phone"].ToString()
                    );
                    dorms.Add(dorm);
                }
                return dorms;
            });
        }

        public Task<List<clsDormDTO>> GetDormsByDistanceAsync(double maxDistance)
        {
            return ExecuteCommandAsync("SP_GetDormsByDistance", cmd =>
            {
                cmd.Parameters.AddWithValue("@MaxDistance", maxDistance);
            }, async cmd =>
            {
                var dorms = new List<clsDormDTO>();
                await using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    var dorm = new clsDormDTO(
                        reader["DormID"].ToString(),
                        reader["DormName"].ToString(),
                        reader["Address"].ToString(),
                        Convert.ToBoolean(reader["FurnishedOrNot"]),
                        Convert.ToDouble(reader["Distance"]),
                        reader["UniversityName"].ToString(),
                        reader["OwnerName"].ToString(),
                        reader["Phone"].ToString()
                    );
                    dorms.Add(dorm);
                }
                return dorms;
            });
        }

        public Task<List<clsDormDTO>> GetDormsByFurnishingAsync(bool furnishedOrNot)
        {
            return ExecuteCommandAsync("SP_GetDormsByFurnishing", cmd =>
            {
                cmd.Parameters.AddWithValue("@FurnishedOrNot", furnishedOrNot);
            }, async cmd =>
            {
                var dorms = new List<clsDormDTO>();
                await using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    var dorm = new clsDormDTO(
                        reader["DormID"].ToString(),
                        reader["DormName"].ToString(),
                        reader["Address"].ToString(),
                        Convert.ToBoolean(reader["FurnishedOrNot"]),
                        Convert.ToDouble(reader["Distance"]),
                        reader["UniversityName"].ToString(),
                        reader["OwnerName"].ToString(),
                        reader["Phone"].ToString()
                    );
                    dorms.Add(dorm);
                }
                return dorms;
            });
        }

        public Task<List<clsDormDTO>> GetDormsByOwnerAsync(string ownerName)
        {
            return ExecuteCommandAsync("SP_GetDormsByOwner", cmd =>
            {
                cmd.Parameters.AddWithValue("@OwnerName", ownerName);
            }, async cmd =>
            {
                var dorms = new List<clsDormDTO>();
                await using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    var dorm = new clsDormDTO(
                        reader["DormID"].ToString(),
                        reader["DormName"].ToString(),
                        reader["Address"].ToString(),
                        Convert.ToBoolean(reader["FurnishedOrNot"]),
                        Convert.ToDouble(reader["Distance"]),
                        reader["UniversityName"].ToString(),
                        reader["OwnerName"].ToString(),
                        reader["Phone"].ToString()
                    );
                    dorms.Add(dorm);
                }
                return dorms;
            });
        }

        public Task<List<clsDormDTO>> GetDormsByOwnerIDAsync(int ownerID)
        {
            return ExecuteCommandAsync("SP_GetDormsByOwnerID", cmd =>
            {
                cmd.Parameters.AddWithValue("@OwnerID", ownerID);
            }, async cmd =>
            {
                var dorms = new List<clsDormDTO>();
                await using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    var dorm = new clsDormDTO(
                        reader["DormID"].ToString(),
                        reader["DormName"].ToString(),
                        reader["Address"].ToString(),
                        Convert.ToBoolean(reader["FurnishedOrNot"]),
                        Convert.ToDouble(reader["Distance"]),
                        reader["UniversityName"].ToString(),
                        reader["OwnerName"].ToString(),
                        reader["Phone"].ToString()
                    );
                    dorms.Add(dorm);
                }
                return dorms;
            });
        }

        public Task<List<clsDormDTO>> GetDormsByUniversityAsync(string universityName)
        {
            return ExecuteCommandAsync("SP_GetDormsByUniversityName", cmd =>
            {
                cmd.Parameters.AddWithValue("@UniversityName", universityName);
            }, async cmd =>
            {
                var dorms = new List<clsDormDTO>();
                await using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    var dorm = new clsDormDTO(
                        reader["DormID"].ToString(),
                        reader["DormName"].ToString(),
                        reader["Address"].ToString(),
                        Convert.ToBoolean(reader["FurnishedOrNot"]),
                        Convert.ToDouble(reader["Distance"]),
                        reader["UniversityName"].ToString(),
                        reader["OwnerName"].ToString(),
                        reader["Phone"].ToString()
                    );
                    dorms.Add(dorm);
                }
                return dorms;
            });
        }

        public Task<List<clsDormDTO>> GetDormsPagedAsync(int pageIndex, int pageSize)
        {
            return ExecuteCommandAsync("SP_GetDormsPaged", cmd =>
            {
                cmd.Parameters.AddWithValue("@PageNumber", pageIndex);
                cmd.Parameters.AddWithValue("@PageSize", pageSize);
            }, async cmd =>
            {
                var dorms = new List<clsDormDTO>();
                await using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    var dorm = new clsDormDTO(
                        reader["DormID"].ToString(),
                        reader["DormName"].ToString(),
                        reader["Address"].ToString(),
                        Convert.ToBoolean(reader["FurnishedOrNot"]),
                        Convert.ToDouble(reader["Distance"]),
                        reader["UniversityName"].ToString(),
                        reader["OwnerName"].ToString(),
                        reader["Phone"].ToString()
                    );
                    dorms.Add(dorm);
                }
                return dorms;
            });
        }

        public Task<int> GetTotalDormsAsync()
        {
            return ExecuteCommandAsync("SP_GetTotalDorms", cmd => { }, async cmd =>
            {
                var result = await cmd.ExecuteScalarAsync();
                return Convert.ToInt32(result);
            });
        }

        public Task<List<clsDormDTO>> SearchDormsAsync(string? university = null, bool? furnished = null, double? maxDistance = null, string? address = null,string? DormName=null)
        {
            return ExecuteCommandAsync("SP_SearchDorms", cmd =>
            {
                if (!string.IsNullOrEmpty(university))
                    cmd.Parameters.AddWithValue("@UniversityName", university);
                if (furnished.HasValue)
                    cmd.Parameters.AddWithValue("@FurnishedOrNot", furnished.Value);
                if (maxDistance.HasValue)
                    cmd.Parameters.AddWithValue("@Distance", maxDistance.Value);
                if (!string.IsNullOrEmpty(address))
                    cmd.Parameters.AddWithValue("@Address", address);
                if (!string.IsNullOrEmpty(DormName))
                    cmd.Parameters.AddWithValue("@DormName", DormName);
            }, async cmd =>
            {
                var dorms = new List<clsDormDTO>();
                await using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    var dorm = new clsDormDTO(
                        reader["DormID"].ToString(),
                        reader["DormName"].ToString(),
                        reader["Address"].ToString(),
                        Convert.ToBoolean(reader["FurnishedOrNot"]),
                        Convert.ToDouble(reader["Distance"]),
                        reader["UniversityName"].ToString(),
                        reader["OwnerName"].ToString(),
                        reader["Phone"].ToString()
                    );
                    dorms.Add(dorm);
                }
                return dorms;
            });
        }

        public Task<bool> UpdateDormAsync(clsUpdateDormDTO dorm)
        {
            return ExecuteCommandAsync("SP_UpdateDorm", cmd =>
            {
                cmd.Parameters.AddWithValue("@DormID", dorm.DormID);
                cmd.Parameters.AddWithValue("@DormName", dorm.DormName);
                cmd.Parameters.AddWithValue("@Address", dorm.Address);
                cmd.Parameters.AddWithValue("@FurnishedOrNot", dorm.FurnishedOrNot);
                cmd.Parameters.AddWithValue("@Distance", dorm.Distance);
                cmd.Parameters.AddWithValue("@UniversityID", dorm.UniversityID);
                cmd.Parameters.AddWithValue("@OwnerID", dorm.OwnerID);
            }, async cmd =>
            {
                var result = await cmd.ExecuteNonQueryAsync();
                return result > 0;
            });
        }

        
    }
}
