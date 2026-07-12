using System.Data;
using System.Data.SqlClient;
using DataAccessLayer;
using MaskaniDataAccess.DTOs;
using MaskaniDataAccess.Interfaces;
using MaskaniDataAccessLayer.DataHelper;
using MaskaniDataAccessLayer.DTOs;
using Microsoft.Extensions.Configuration;

namespace MaskaniDataAccess.DataAccess
{
    public class UserRepository : BaseRepository, IUserRepository
    {
        public UserRepository(IConfiguration configuration)
            : base(configuration.GetConnectionString("DefaultConnection"))
        {
        }

        public async Task<int> AddAsync(clsAddUserDTO createDTO)
        {
            return await ExecuteCommandAsync("SP_AddNewUser", cmd =>
            {
                cmd.Parameters.AddWithValue("@FirstName", createDTO.FirstName);
                cmd.Parameters.AddWithValue("@LastName", createDTO.LastName);
                cmd.Parameters.AddWithValue("@Phone", createDTO.Phone);
                cmd.Parameters.AddWithValue("@Email", createDTO.Email);
                cmd.Parameters.AddWithValue("@Password", createDTO.Password);
                cmd.Parameters.AddWithValue("@Role", "User");

                var idParam = new SqlParameter("@NewUserID", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };

                cmd.Parameters.Add(idParam);

            }, async cmd =>
            {
                var result = await cmd.ExecuteScalarAsync();
                return Convert.ToInt32(result);
            });
        }

        public async Task<bool> ChangePasswordAsync(int userID, string newPassword)
        {
            return await ExecuteCommandAsync("SP_ChangeUserPassword", cmd =>
            {
                cmd.Parameters.AddWithValue("@UserID", userID);
                cmd.Parameters.AddWithValue("@NewPassword", newPassword);

            }, async cmd => await cmd.ExecuteNonQueryAsync() > 0);
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await ExecuteCommandAsync("SP_DeleteUser", cmd =>
            {
                cmd.Parameters.AddWithValue("@UserID", id);

            }, async cmd => await cmd.ExecuteNonQueryAsync() > 0);
        }

        public async Task<List<clsUserDTO>> GetAllAsync()
        {
            return await ExecuteCommandAsync("SP_GetAllUsers", cmd => { }, async cmd =>
            {
                var userList = new List<clsUserDTO>();

                using var reader = await cmd.ExecuteReaderAsync();

                while (await reader.ReadAsync())
                {
                    userList.Add(new clsUserDTO(
                        reader.GetInt32(reader.GetOrdinal("PersonID")),
                        reader.GetString(reader.GetOrdinal("FirstName")),
                        reader.GetString(reader.GetOrdinal("LastName")),
                        reader.GetString(reader.GetOrdinal("Phone")),
                        reader.GetString(reader.GetOrdinal("Email")),
                        reader.GetInt32(reader.GetOrdinal("UserID")),
                        null
                    ));
                }

                return userList;
            });
        }

        public async Task<clsUserDTO?> GetByIdAsync(int id)
        {
            return await ExecuteCommandAsync("SP_GetUserInfoByID", cmd =>
            {
                cmd.Parameters.AddWithValue("@UserID", id);

            }, async cmd =>
            {
                clsUserDTO? user = null;

                using var reader = await cmd.ExecuteReaderAsync();

                if (await reader.ReadAsync())
                {
                    user = new clsUserDTO(
                        reader.GetInt32(reader.GetOrdinal("PersonID")),
                        reader.GetString(reader.GetOrdinal("FirstName")),
                        reader.GetString(reader.GetOrdinal("LastName")),
                        reader.GetString(reader.GetOrdinal("Phone")),
                        reader.GetString(reader.GetOrdinal("Email")),
                        reader.GetInt32(reader.GetOrdinal("UserID")),
                        null
                    );
                }

                return user;
            });
        }

        [Obsolete("Authentication is handled in UserService using PBKDF2.")]
        public Task<clsUserDTO?> LoginAsync(string email, string password)
        {
            throw new NotSupportedException(
                "Use GetUserByEmailAsync() and verify the password in UserService.");
        }

        public async Task<bool> UpdateAsync(clsUpdateUserDTO updateDTO)
        {
            return await ExecuteCommandAsync("SP_UpdateUser", cmd =>
            {
                cmd.Parameters.AddWithValue("@UserID", updateDTO.UserID);
                cmd.Parameters.AddWithValue("@FirstName", updateDTO.FirstName);
                cmd.Parameters.AddWithValue("@LastName", updateDTO.LastName);
                cmd.Parameters.AddWithValue("@Phone", updateDTO.Phone);
                cmd.Parameters.AddWithValue("@Email", updateDTO.Email);
                cmd.Parameters.AddWithValue("@Password", updateDTO.Password);
                cmd.Parameters.AddWithValue("@Role", "User");

            }, async cmd => await cmd.ExecuteNonQueryAsync() > 0);
        }

        public Task<clsUserDTO?> GetUserByEmailAsync(string email)
        {
            return ExecuteCommandAsync("SP_GetUserByEmail", cmd =>
            {
                cmd.Parameters.AddWithValue("@Email", email);

            }, async cmd =>
            {
                using var reader = await cmd.ExecuteReaderAsync();

                if (await reader.ReadAsync())
                {
                    return new clsUserDTO(
                        reader.GetInt32(reader.GetOrdinal("PersonID")),
                        reader.GetString(reader.GetOrdinal("FirstName")),
                        reader.GetString(reader.GetOrdinal("LastName")),
                        reader.GetString(reader.GetOrdinal("Phone")),
                        reader.GetString(reader.GetOrdinal("Email")),
                        reader.GetInt32(reader.GetOrdinal("UserID")),
                        reader.GetString(reader.GetOrdinal("Password"))
                    );
                }

                return null;
            });
        }

        public Task<clsUserDTO?> GetUserByPersonID(int personID)
        {
            return ExecuteCommandAsync("SP_GetUserByPersonID", cmd =>
            {
                cmd.Parameters.AddWithValue("@PersonID", personID);

            }, async cmd =>
            {
                using var reader = await cmd.ExecuteReaderAsync();

                if (await reader.ReadAsync())
                {
                    return new clsUserDTO(
                        reader.GetInt32(reader.GetOrdinal("PersonID")),
                        reader.GetString(reader.GetOrdinal("FirstName")),
                        reader.GetString(reader.GetOrdinal("LastName")),
                        reader.GetString(reader.GetOrdinal("Phone")),
                        reader.GetString(reader.GetOrdinal("Email")),
                        reader.GetInt32(reader.GetOrdinal("UserID")),
                        null
                    );
                }

                return null;
            });
        }
    }
}