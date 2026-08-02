using System.Data;
using Microsoft.Data.SqlClient;
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
            return await ExecuteCommandAsync(
                "SP_AddNewUser",
                cmd =>
                {
                    cmd.Parameters.AddWithValue(
                        "@FirstName",
                        createDTO.FirstName);

                    cmd.Parameters.AddWithValue(
                        "@LastName",
                        createDTO.LastName);

                    cmd.Parameters.AddWithValue(
                        "@Phone",
                        createDTO.Phone);

                    cmd.Parameters.AddWithValue(
                        "@Email",
                        createDTO.Email);

                    cmd.Parameters.AddWithValue(
                        "@Password",
                        createDTO.Password);

                    cmd.Parameters.AddWithValue(
                        "@Role",
                        "User");

                    var idParam = new SqlParameter(
                        "@NewUserID",
                        SqlDbType.Int)
                    {
                        Direction = ParameterDirection.Output
                    };

                    cmd.Parameters.Add(idParam);
                },
                async cmd =>
                    Convert.ToInt32(
                        await cmd.ExecuteScalarAsync()));
        }

        public async Task<bool> ChangePasswordAsync(
            int userId,
            string passwordHash)
        {
            return await ExecuteCommandAsync(
                "dbo.SP_ChangeUserPassword",
                cmd =>
                {
                    cmd.Parameters.Add(
                        "@UserID",
                        SqlDbType.Int).Value = userId;

                    cmd.Parameters.Add(
                        "@NewPassword",
                        SqlDbType.NVarChar,
                        255).Value = passwordHash;
                },
                async cmd =>
                {
                    object? result =
                        await cmd.ExecuteScalarAsync();

                    return result != null &&
                           result != DBNull.Value &&
                           Convert.ToBoolean(result);
                });
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await ExecuteCommandAsync(
                "SP_DeleteUser",
                cmd =>
                {
                    cmd.Parameters.AddWithValue(
                        "@UserID",
                        id);
                },
                async cmd =>
                    await cmd.ExecuteNonQueryAsync() > 0);
        }

        public async Task<List<clsUserDTO>> GetAllAsync()
        {
            return await ExecuteCommandAsync(
                "SP_GetAllUsers",
                cmd => { },
                async cmd =>
                {
                    var userList =
                        new List<clsUserDTO>();

                    using var reader =
                        await cmd.ExecuteReaderAsync();

                    while (await reader.ReadAsync())
                    {
                        userList.Add(
                            new clsUserDTO(
                                reader.GetInt32(
                                    reader.GetOrdinal("PersonID")),

                                reader.GetString(
                                    reader.GetOrdinal("FirstName")),

                                reader.GetString(
                                    reader.GetOrdinal("LastName")),

                                reader.GetString(
                                    reader.GetOrdinal("Phone")),

                                reader.GetString(
                                    reader.GetOrdinal("Email")),

                                reader.GetInt32(
                                    reader.GetOrdinal("UserID")),

                                null
                            ));
                    }

                    return userList;
                });
        }

        public async Task<clsUserDTO?> GetByIdAsync(int id)
        {
            return await ExecuteCommandAsync(
                "SP_GetUserInfoByID",
                cmd =>
                {
                    cmd.Parameters.AddWithValue(
                        "@UserID",
                        id);
                },
                async cmd =>
                {
                    using var reader =
                        await cmd.ExecuteReaderAsync();

                    if (await reader.ReadAsync())
                    {
                        return new clsUserDTO(
                            reader.GetInt32(
                                reader.GetOrdinal("PersonID")),

                            reader.GetString(
                                reader.GetOrdinal("FirstName")),

                            reader.GetString(
                                reader.GetOrdinal("LastName")),

                            reader.GetString(
                                reader.GetOrdinal("Phone")),

                            reader.GetString(
                                reader.GetOrdinal("Email")),

                            reader.GetInt32(
                                reader.GetOrdinal("UserID")),

                            null
                        );
                    }

                    return null;
                });
        }

        public Task<clsUserDTO?> GetUserByEmailAsync(
            string email)
        {
            return ExecuteCommandAsync(
                "SP_GetUserByEmail",
                cmd =>
                {
                    cmd.Parameters.AddWithValue(
                        "@Email",
                        email);
                },
                async cmd =>
                {
                    using var reader =
                        await cmd.ExecuteReaderAsync();

                    if (await reader.ReadAsync())
                    {
                        return new clsUserDTO(
                            reader.GetInt32(
                                reader.GetOrdinal("PersonID")),

                            reader.GetString(
                                reader.GetOrdinal("FirstName")),

                            reader.GetString(
                                reader.GetOrdinal("LastName")),

                            reader.GetString(
                                reader.GetOrdinal("Phone")),

                            reader.GetString(
                                reader.GetOrdinal("Email")),

                            reader.GetInt32(
                                reader.GetOrdinal("UserID")),

                            reader.GetString(
                                reader.GetOrdinal("Password"))
                        );
                    }

                    return null;
                });
        }

        public Task<clsUserDTO?> GetUserByPersonID(
            int personID)
        {
            return ExecuteCommandAsync(
                "SP_GetUserByPersonID",
                cmd =>
                {
                    cmd.Parameters.AddWithValue(
                        "@PersonID",
                        personID);
                },
                async cmd =>
                {
                    using var reader =
                        await cmd.ExecuteReaderAsync();

                    if (await reader.ReadAsync())
                    {
                        return new clsUserDTO(
                            reader.GetInt32(
                                reader.GetOrdinal("PersonID")),

                            reader.GetString(
                                reader.GetOrdinal("FirstName")),

                            reader.GetString(
                                reader.GetOrdinal("LastName")),

                            reader.GetString(
                                reader.GetOrdinal("Phone")),

                            reader.GetString(
                                reader.GetOrdinal("Email")),

                            reader.GetInt32(
                                reader.GetOrdinal("UserID")),

                            null
                        );
                    }

                    return null;
                });
        }

        public async Task<bool> UpdateAsync(
            clsUpdateUserDTO updateDTO)
        {
            return await ExecuteCommandAsync(
                "dbo.SP_UpdateUser",
                cmd =>
                {
                    cmd.Parameters.AddWithValue(
                        "@UserID",
                        updateDTO.UserID);

                    cmd.Parameters.AddWithValue(
                        "@FirstName",
                        updateDTO.FirstName);

                    cmd.Parameters.AddWithValue(
                        "@LastName",
                        updateDTO.LastName);

                    cmd.Parameters.AddWithValue(
                        "@Phone",
                        updateDTO.Phone);

                    cmd.Parameters.AddWithValue(
                        "@Email",
                        updateDTO.Email);

                    cmd.Parameters.AddWithValue(
                        "@Role",
                        "User");
                },
                async cmd =>
                    await cmd.ExecuteNonQueryAsync() > 0);
        }
    }
}