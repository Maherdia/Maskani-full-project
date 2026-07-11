using System.Data;
using System.Data.SqlClient;
using DataAccessLayer.Interfaces;
using MaskaniDataAccess.DTOs;
using MaskaniDataAccess.Interfaces;
using MaskaniDataAccessLayer.DataHelper;
using Microsoft.Extensions.Configuration;

namespace MaskaniDataAccess.DataAccess
{
    public class UniversityRepository : BaseRepository, IUniversityRepository
    {
        public UniversityRepository(IConfiguration config)
            : base(config.GetConnectionString("DefaultConnection")) { }

        public Task<List<clsUniversityDTO>> GetAllAsync()
        {
            return ExecuteCommandAsync("SP_GetAllUniversities", cmd => { }, async cmd =>
            {
                var list = new List<clsUniversityDTO>();
                using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    list.Add(new clsUniversityDTO(
                        reader.GetInt32(reader.GetOrdinal("ID")),
                        reader.GetString(reader.GetOrdinal("Name")),
                        reader.GetString(reader.GetOrdinal("address"))
                    ));
                }
                return list;
            });
        }

        public Task<clsUniversityDTO?> GetByIdAsync(int id)
        {
            return ExecuteCommandAsync("SP_GetUniversityInfoByID", cmd =>
            {
                cmd.Parameters.AddWithValue("@ID", id);
            }, async cmd =>
            {
                using var reader = await cmd.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    return new clsUniversityDTO(
                        reader.GetInt32(reader.GetOrdinal("ID")),
                        reader.GetString(reader.GetOrdinal("Name")),
                        reader.GetString(reader.GetOrdinal("address"))
                    );
                }
                return null;
            });
        }

        public Task<int> AddAsync(clsAddUniversityDTO dto)
        {
            return ExecuteCommandAsync("SP_AddNewUniversity", cmd =>
            {
                cmd.Parameters.AddWithValue("@Name", dto.Name);
                cmd.Parameters.AddWithValue("@Address", dto.Address);
            }, async cmd => Convert.ToInt32(await cmd.ExecuteScalarAsync()));
        }

        public Task<bool> UpdateAsync(clsUpdateUniversityDTO dto)
        {
            return ExecuteCommandAsync("SP_UpdateUniversity", cmd =>
            {
                cmd.Parameters.AddWithValue("@ID", dto.ID);
                cmd.Parameters.AddWithValue("@Name", dto.Name);
                cmd.Parameters.AddWithValue("@Address", dto.Address);
            }, async cmd => await cmd.ExecuteNonQueryAsync() > 0);
        }

        public Task<bool> DeleteAsync(int id)
        {
            return ExecuteCommandAsync("SP_DeleteUniversity", cmd =>
            {
                cmd.Parameters.AddWithValue("@ID", id);
            }, async cmd => await cmd.ExecuteNonQueryAsync() > 0);
        }
    }
}
