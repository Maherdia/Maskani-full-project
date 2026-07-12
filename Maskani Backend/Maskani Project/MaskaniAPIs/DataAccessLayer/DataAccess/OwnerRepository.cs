using System.Data;
using System.Data.SqlClient;
using DataAccessLayer;
using MaskaniDataAccess.DTOs;
using MaskaniDataAccess.Interfaces;
using MaskaniDataAccessLayer.DataHelper;
using MaskaniDataAccessLayer.DTOs;
using Microsoft.Extensions.Configuration;
//using Microsoft.Extensions.Logging;

namespace MaskaniDataAccess.DataAccess
{
    public class OwnerRepository : BaseRepository, IOwnerRepository
    {
        public OwnerRepository(IConfiguration configuration)
            : base(configuration.GetConnectionString("DefaultConnection")) { }

        public async Task<int> AddAsync(clsAddOwnerDTO createDTO)
        {
            return await ExecuteCommandAsync("SP_AddNewDormOwner", cmd =>
            {
                cmd.Parameters.AddWithValue("@FirstName", createDTO.FirstName);
                cmd.Parameters.AddWithValue("@LastName", createDTO.LastName);
                cmd.Parameters.AddWithValue("@Phone", createDTO.Phone);
                cmd.Parameters.AddWithValue("@Email", createDTO.Email);
                cmd.Parameters.AddWithValue("@Password",(createDTO.Password));
                cmd.Parameters.AddWithValue("@Role", "Owner");
                var idParam = new SqlParameter("@NewOwnerID", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                cmd.Parameters.Add(idParam);
            }, async cmd => Convert.ToInt32(await cmd.ExecuteScalarAsync()));
        }

        public async Task<bool> ChangePasswordAsync(int ownerID, string newPassword)
        {
            return await ExecuteCommandAsync("SP_ChangeOwnerPassword", cmd =>
            {
                cmd.Parameters.AddWithValue("@OwnerID", ownerID);
                cmd.Parameters.AddWithValue("@NewPassword", newPassword);
            }, async cmd => await cmd.ExecuteNonQueryAsync() > 0);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await ExecuteCommandAsync("SP_DeleteOwner", cmd =>
            {
                cmd.Parameters.AddWithValue("@OwnerID", id);
            }, async cmd => await cmd.ExecuteNonQueryAsync() > 0);
        }

        public async Task<List<clsOwnerDTO>> GetAllAsync()
        {
            return await ExecuteCommandAsync("SP_GetAllDormsOwner", cmd => { }, async cmd =>
            {
                var ownerList = new List<clsOwnerDTO>();
                using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    ownerList.Add(new clsOwnerDTO(
                        reader.GetInt32(reader.GetOrdinal("PersonID")),
                        reader.GetString(reader.GetOrdinal("FirstName")),
                        reader.GetString(reader.GetOrdinal("LastName")),
                        reader.GetString(reader.GetOrdinal("Phone")),
                        reader.GetString(reader.GetOrdinal("Email")),
                        reader.GetInt32(reader.GetOrdinal("OwnerID")),
                        null
                    ));
                }
                return ownerList;
            });
        }

        public Task<clsOwnerDTO?> GetByEmailAsync(string email)
        {
            return ExecuteCommandAsync("SP_GetOwnerByEmail", cmd =>
            {
                cmd.Parameters.AddWithValue("@Email", email);
            }, async cmd =>
            {
                using var reader = await cmd.ExecuteReaderAsync();

                if (await reader.ReadAsync())
                {
                    return new clsOwnerDTO(
                        reader.GetInt32(reader.GetOrdinal("PersonID")),
                        reader.GetString(reader.GetOrdinal("FirstName")),
                        reader.GetString(reader.GetOrdinal("LastName")),
                        reader.GetString(reader.GetOrdinal("Phone")),
                        reader.GetString(reader.GetOrdinal("Email")),
                        reader.GetInt32(reader.GetOrdinal("OwnerID")),
                        reader.GetString(reader.GetOrdinal("Password"))
                    );
                }

                return null;
            });
        }

        public async Task<clsOwnerDTO?> GetByIdAsync(int id)
        {
            return await ExecuteCommandAsync("SP_GetOwnerInfoByID", cmd =>
            {
                cmd.Parameters.AddWithValue("@OwnerID", id);
            }, async cmd =>
            {
                clsOwnerDTO? owner = null;
                using var reader = await cmd.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    owner = new clsOwnerDTO(
                        reader.GetInt32(reader.GetOrdinal("PersonID")),
                        reader.GetString(reader.GetOrdinal("FirstName")),
                        reader.GetString(reader.GetOrdinal("LastName")),
                        reader.GetString(reader.GetOrdinal("Phone")),
                        reader.GetString(reader.GetOrdinal("Email")),
                        reader.GetInt32(reader.GetOrdinal("OwnerID")),
                        null
                    );
                }
                return owner;
            });
        }

        public  Task<clsOwnerDTO?> GetOwnerByPersonID(int PersonID)
        {
            return ExecuteCommandAsync("SP_GetOwnerByPersonID", cmd => cmd.Parameters.AddWithValue("@PersonID", PersonID), async cmd =>
            {
                using var reader = await cmd.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    return new clsOwnerDTO(
                        reader.GetInt32(reader.GetOrdinal("PersonID")),
                        reader.GetString(reader.GetOrdinal("FirstName")),
                        reader.GetString(reader.GetOrdinal("LastName")),
                        reader.GetString(reader.GetOrdinal("Phone")),
                        reader.GetString(reader.GetOrdinal("Email")),
                        reader.GetInt32(reader.GetOrdinal("OwnerID")),
                        null
                    );
                }
                return null;
            });
        }

        [Obsolete("Login is now handled in OwnerService using PBKDF2 verification.")]
        public Task<clsOwnerDTO?> LoginAsync(string email, string password)
        {
            throw new NotSupportedException(
                "Repository authentication has been removed. Use GetByEmailAsync().");
        }

        public async Task<bool> UpdateAsync(clsUpdateOwnerDTO updateDTO)
        {
            return await ExecuteCommandAsync("SP_UpdateDormOwner", cmd =>
            {
                cmd.Parameters.AddWithValue("@OwnerID", updateDTO.OwnerID);
                cmd.Parameters.AddWithValue("@FirstName", updateDTO.FirstName);
                cmd.Parameters.AddWithValue("@LastName", updateDTO.LastName);
                cmd.Parameters.AddWithValue("@Phone", updateDTO.Phone);
                cmd.Parameters.AddWithValue("@Email", updateDTO.Email);
                cmd.Parameters.AddWithValue("@Password", updateDTO.Password);
                cmd.Parameters.AddWithValue("@Role", "Owner");
            }, async cmd => await cmd.ExecuteNonQueryAsync() > 0);
        }
    }
}
