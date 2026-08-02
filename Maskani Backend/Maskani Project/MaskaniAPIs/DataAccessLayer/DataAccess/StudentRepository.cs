using System.Data;
using DataAccessLayer;
using MaskaniDataAccess.DTOs;
using MaskaniDataAccess.Interfaces;
using MaskaniDataAccessLayer.DataHelper;
using MaskaniDataAccessLayer.DTOs;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;

namespace MaskaniDataAccess.DataAccess
{
    public class StudentRepository : BaseRepository, IStudentRepository
    {
        public StudentRepository(IConfiguration configuration)
            : base(
                configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException(
                    "DefaultConnection is missing."))
        {
        }

        public async Task<int> AddAsync(
            clsAddStudentDTO createDTO)
        {
            ArgumentNullException.ThrowIfNull(createDTO);

            return await ExecuteCommandAsync(
                "SP_AddNewStudent",
                cmd =>
                {
                    cmd.Parameters.Add(
                        "@FirstName",
                        SqlDbType.NVarChar).Value =
                        createDTO.FirstName;

                    cmd.Parameters.Add(
                        "@LastName",
                        SqlDbType.NVarChar).Value =
                        createDTO.LastName;

                    cmd.Parameters.Add(
                        "@Phone",
                        SqlDbType.NVarChar).Value =
                        createDTO.Phone;

                    cmd.Parameters.Add(
                        "@Email",
                        SqlDbType.NVarChar).Value =
                        createDTO.Email;

                    cmd.Parameters.Add(
                        "@Password",
                        SqlDbType.NVarChar).Value =
                        createDTO.Password;

                    cmd.Parameters.Add(
                        "@Role",
                        SqlDbType.NVarChar).Value =
                        "Student";

                    cmd.Parameters.Add(
                        new SqlParameter(
                            "@NewStudentID",
                            SqlDbType.Int)
                        {
                            Direction =
                                ParameterDirection.Output
                        });
                },
                async cmd =>
                {
                    await cmd.ExecuteNonQueryAsync();

                    object? outputValue =
                        cmd.Parameters["@NewStudentID"].Value;

                    if (outputValue == null ||
                        outputValue == DBNull.Value)
                    {
                        throw new InvalidOperationException(
                            "SP_AddNewStudent did not return " +
                            "@NewStudentID.");
                    }

                    int newStudentId =
                        Convert.ToInt32(outputValue);

                    if (newStudentId <= 0)
                    {
                        throw new InvalidOperationException(
                            "SP_AddNewStudent returned an invalid " +
                            "student ID.");
                    }

                    return newStudentId;
                });
        }

        public async Task<bool> ChangePasswordAsync(
            int studentId,
            string passwordHash)
        {
            return await ExecuteCommandAsync(
                "dbo.SP_ChangeStudentPassword",
                cmd =>
                {
                    cmd.Parameters.Add(
                        "@StudentID",
                        SqlDbType.Int).Value =
                        studentId;

                    cmd.Parameters.Add(
                        "@NewPassword",
                        SqlDbType.NVarChar,
                        255).Value =
                        passwordHash;
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

        public async Task<bool> DeleteAsync(
            int id)
        {
            return await ExecuteCommandAsync(
                "SP_DeleteStudent",
                cmd =>
                {
                    cmd.Parameters.Add(
                        "@StudentID",
                        SqlDbType.Int).Value =
                        id;
                },
                async cmd =>
                    await cmd.ExecuteNonQueryAsync() > 0);
        }

        public async Task<List<clsStudentDTO>>
            GetAllAsync()
        {
            return await ExecuteCommandAsync(
                "SP_GetAllStudent",
                cmd => { },
                async cmd =>
                {
                    var studentList =
                        new List<clsStudentDTO>();

                    using var reader =
                        await cmd.ExecuteReaderAsync();

                    while (await reader.ReadAsync())
                    {
                        studentList.Add(
                            new clsStudentDTO(
                                reader.GetInt32(
                                    reader.GetOrdinal(
                                        "PersonID")),

                                reader.GetString(
                                    reader.GetOrdinal(
                                        "FirstName")),

                                reader.GetString(
                                    reader.GetOrdinal(
                                        "LastName")),

                                reader.GetString(
                                    reader.GetOrdinal(
                                        "Phone")),

                                reader.GetString(
                                    reader.GetOrdinal(
                                        "Email")),

                                reader.GetInt32(
                                    reader.GetOrdinal(
                                        "StudentID")),

                                null));
                    }

                    return studentList;
                });
        }

        public async Task<clsStudentDTO?>
            GetByIdAsync(int id)
        {
            return await ExecuteCommandAsync(
                "SP_GetStudentInfoByID",
                cmd =>
                {
                    cmd.Parameters.Add(
                        "@StudentID",
                        SqlDbType.Int).Value =
                        id;
                },
                async cmd =>
                {
                    using var reader =
                        await cmd.ExecuteReaderAsync();

                    if (!await reader.ReadAsync())
                    {
                        return null;
                    }

                    return new clsStudentDTO(
                        reader.GetInt32(
                            reader.GetOrdinal(
                                "PersonID")),

                        reader.GetString(
                            reader.GetOrdinal(
                                "FirstName")),

                        reader.GetString(
                            reader.GetOrdinal(
                                "LastName")),

                        reader.GetString(
                            reader.GetOrdinal(
                                "Phone")),

                        reader.GetString(
                            reader.GetOrdinal(
                                "Email")),

                        reader.GetInt32(
                            reader.GetOrdinal(
                                "StudentID")),

                        null);
                });
        }

        public Task<clsStudentDTO?>
            GetStudentByEmail(string email)
        {
            return ExecuteCommandAsync(
                "SP_GetStudentByEmail",
                cmd =>
                {
                    cmd.Parameters.Add(
                        "@Email",
                        SqlDbType.NVarChar).Value =
                        email;
                },
                async cmd =>
                {
                    using var reader =
                        await cmd.ExecuteReaderAsync();

                    if (!await reader.ReadAsync())
                    {
                        return null;
                    }

                    return new clsStudentDTO(
                        reader.GetInt32(
                            reader.GetOrdinal(
                                "PersonID")),

                        reader.GetString(
                            reader.GetOrdinal(
                                "FirstName")),

                        reader.GetString(
                            reader.GetOrdinal(
                                "LastName")),

                        reader.GetString(
                            reader.GetOrdinal(
                                "Phone")),

                        reader.GetString(
                            reader.GetOrdinal(
                                "Email")),

                        reader.GetInt32(
                            reader.GetOrdinal(
                                "StudentID")),

                        reader.GetString(
                            reader.GetOrdinal(
                                "Password")));
                });
        }

        public Task<clsStudentDTO?>
            GetStudentByPersonID(int personID)
        {
            return ExecuteCommandAsync(
                "SP_GetStudentByPersonID",
                cmd =>
                {
                    cmd.Parameters.Add(
                        "@PersonID",
                        SqlDbType.Int).Value =
                        personID;
                },
                async cmd =>
                {
                    using var reader =
                        await cmd.ExecuteReaderAsync();

                    if (!await reader.ReadAsync())
                    {
                        return null;
                    }

                    return new clsStudentDTO(
                        reader.GetInt32(
                            reader.GetOrdinal(
                                "PersonID")),

                        reader.GetString(
                            reader.GetOrdinal(
                                "FirstName")),

                        reader.GetString(
                            reader.GetOrdinal(
                                "LastName")),

                        reader.GetString(
                            reader.GetOrdinal(
                                "Phone")),

                        reader.GetString(
                            reader.GetOrdinal(
                                "Email")),

                        reader.GetInt32(
                            reader.GetOrdinal(
                                "StudentID")),

                        null);
                });
        }

        public async Task<bool> UpdateAsync(
     clsUpdateStudentDTO updateDTO)
        {
            ArgumentNullException.ThrowIfNull(updateDTO);

            return await ExecuteCommandAsync(
                "dbo.SP_UpdateStudent",
                cmd =>
                {
                    cmd.Parameters.Add(
                        "@StudentID",
                        SqlDbType.Int).Value =
                        updateDTO.StudentID;

                    cmd.Parameters.Add(
                        "@FirstName",
                        SqlDbType.NVarChar,
                        50).Value =
                        updateDTO.FirstName;

                    cmd.Parameters.Add(
                        "@LastName",
                        SqlDbType.NVarChar,
                        50).Value =
                        updateDTO.LastName;

                    cmd.Parameters.Add(
                        "@Phone",
                        SqlDbType.NVarChar,
                        10).Value =
                        updateDTO.Phone;

                    cmd.Parameters.Add(
                        "@Email",
                        SqlDbType.NVarChar,
                        50).Value =
                        updateDTO.Email;

                    cmd.Parameters.Add(
                        "@Role",
                        SqlDbType.NVarChar,
                        50).Value =
                        "Student";
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