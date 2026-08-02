using System.Data;
using Microsoft.Data.SqlClient;
using MaskaniDataAccess.DTOs;
using MaskaniDataAccess.Interfaces;
using MaskaniDataAccessLayer.DataHelper;
using MaskaniDataAccessLayer.DTOs;
using Microsoft.Extensions.Configuration;

namespace MaskaniDataAccess.DataAccess
{
    public class OwnerRepository : BaseRepository, IOwnerRepository
    {
        public OwnerRepository(IConfiguration configuration)
            : base(
                configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException(
                    "Connection string 'DefaultConnection' is missing."))
        {
        }

        public async Task<int> AddAsync(clsAddOwnerDTO createDTO)
        {
            ArgumentNullException.ThrowIfNull(createDTO);

            return await ExecuteCommandAsync(
                "dbo.SP_AddNewDormOwner",
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
                        "Owner");

                    cmd.Parameters.Add(
                        new SqlParameter(
                            "@NewOwnerID",
                            SqlDbType.Int)
                        {
                            Direction = ParameterDirection.Output
                        });
                },
                async cmd =>
                {
                    await cmd.ExecuteNonQueryAsync();

                    object? outputValue =
                        cmd.Parameters["@NewOwnerID"].Value;

                    if (outputValue == null ||
                        outputValue == DBNull.Value)
                    {
                        throw new InvalidOperationException(
                            "SP_AddNewDormOwner did not return an OwnerID.");
                    }

                    int ownerId =
                        Convert.ToInt32(outputValue);

                    if (ownerId <= 0)
                    {
                        throw new InvalidOperationException(
                            "SP_AddNewDormOwner returned an invalid OwnerID.");
                    }

                    return ownerId;
                });
        }

        public async Task<bool> ChangePasswordAsync(
            int ownerId,
            string passwordHash)
        {
            return await ExecuteCommandAsync(
                "dbo.SP_ChangeOwnerPassword",
                cmd =>
                {
                    cmd.Parameters.Add(
                        "@OwnerID",
                        SqlDbType.Int).Value = ownerId;

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
                "dbo.SP_DeleteOwner",
                cmd =>
                {
                    cmd.Parameters.AddWithValue(
                        "@OwnerID",
                        id);
                },
                async cmd =>
                    await cmd.ExecuteNonQueryAsync() > 0);
        }

        public async Task<List<clsOwnerDTO>> GetAllAsync()
        {
            return await ExecuteCommandAsync(
                "dbo.SP_GetAllDormsOwner",
                cmd =>
                {
                },
                async cmd =>
                {
                    var ownerList =
                        new List<clsOwnerDTO>();

                    using var reader =
                        await cmd.ExecuteReaderAsync();

                    while (await reader.ReadAsync())
                    {
                        ownerList.Add(
                            new clsOwnerDTO(
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
                                    reader.GetOrdinal("OwnerID")),
                                null));
                    }

                    return ownerList;
                });
        }

        public Task<clsOwnerDTO?> GetByEmailAsync(
            string email)
        {
            return ExecuteCommandAsync(
                "dbo.SP_GetOwnerByEmail",
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
                        return new clsOwnerDTO(
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
                                reader.GetOrdinal("OwnerID")),
                            reader.GetString(
                                reader.GetOrdinal("Password")));
                    }

                    return null;
                });
        }

        public async Task<clsOwnerDTO?> GetByIdAsync(
            int id)
        {
            return await ExecuteCommandAsync(
                "dbo.SP_GetOwnerInfoByID",
                cmd =>
                {
                    cmd.Parameters.AddWithValue(
                        "@OwnerID",
                        id);
                },
                async cmd =>
                {
                    using var reader =
                        await cmd.ExecuteReaderAsync();

                    if (await reader.ReadAsync())
                    {
                        return new clsOwnerDTO(
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
                                reader.GetOrdinal("OwnerID")),
                            null);
                    }

                    return null;
                });
        }

        public Task<clsOwnerDTO?> GetOwnerByPersonID(
            int personID)
        {
            return ExecuteCommandAsync(
                "dbo.SP_GetOwnerByPersonID",
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
                        return new clsOwnerDTO(
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
                                reader.GetOrdinal("OwnerID")),
                            null);
                    }

                    return null;
                });
        }

        public async Task<bool> UpdateAsync(
     clsUpdateOwnerDTO updateDTO)
        {
            ArgumentNullException.ThrowIfNull(updateDTO);

            return await ExecuteCommandAsync(
                "dbo.SP_UpdateDormOwner",
                cmd =>
                {
                    cmd.Parameters.Add(
                        "@OwnerID",
                        SqlDbType.Int).Value =
                        updateDTO.OwnerID;

                    cmd.Parameters.Add(
                        "@FirstName",
                        SqlDbType.NVarChar,
                        100).Value =
                        updateDTO.FirstName;

                    cmd.Parameters.Add(
                        "@LastName",
                        SqlDbType.NVarChar,
                        100).Value =
                        updateDTO.LastName;

                    cmd.Parameters.Add(
                        "@Phone",
                        SqlDbType.NVarChar,
                        50).Value =
                        updateDTO.Phone;

                    cmd.Parameters.Add(
                        "@Email",
                        SqlDbType.NVarChar,
                        100).Value =
                        updateDTO.Email;

                    cmd.Parameters.Add(
                        "@Role",
                        SqlDbType.NVarChar,
                        50).Value =
                        "Owner";
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
    }
}