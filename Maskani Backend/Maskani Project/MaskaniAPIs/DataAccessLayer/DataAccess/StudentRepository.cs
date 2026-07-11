using DataAccessLayer;
using MaskaniDataAccess.DTOs;
using MaskaniDataAccess.Interfaces;
using MaskaniDataAccessLayer.DataHelper;
using MaskaniDataAccessLayer.DTOs;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace MaskaniDataAccess.DataAccess
{
    public class StudentRepository : BaseRepository, IStudentRepository
    {
        public StudentRepository(IConfiguration configuration)
            : base(configuration.GetConnectionString("DefaultConnection"))
        {
        }

        public async Task<int> AddAsync(clsAddStudentDTO createDTO)
        {
            return await ExecuteCommandAsync("SP_AddNewStudent", cmd =>
            {
                cmd.Parameters.AddWithValue("@FirstName", createDTO.FirstName);
                cmd.Parameters.AddWithValue("@LastName", createDTO.LastName);
                cmd.Parameters.AddWithValue("@Phone", createDTO.Phone);
                cmd.Parameters.AddWithValue("@Email", createDTO.Email);
                cmd.Parameters.AddWithValue("@Password",(createDTO.Password));
                cmd.Parameters.AddWithValue("@Role", "Student");
                var idParam = new SqlParameter("@NewStudentID", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                cmd.Parameters.Add(idParam);
            }, async cmd => Convert.ToInt32(await cmd.ExecuteScalarAsync()));
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await ExecuteCommandAsync("SP_DeleteStudent",
                cmd => cmd.Parameters.AddWithValue("@StudentID", id),
                async cmd => await cmd.ExecuteNonQueryAsync() > 0);
        }

        public async Task<List<clsStudentDTO>> GetAllAsync()
        {
            return await ExecuteCommandAsync("SP_GetAllStudent", cmd => { }, async cmd =>
            {
                var studentList = new List<clsStudentDTO>();
                using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    studentList.Add(new clsStudentDTO(
                        reader.GetInt32(reader.GetOrdinal("PersonID")),
                        reader.GetString(reader.GetOrdinal("FirstName")),
                        reader.GetString(reader.GetOrdinal("LastName")),
                        reader.GetString(reader.GetOrdinal("Phone")),
                        reader.GetString(reader.GetOrdinal("Email")),
                        reader.GetInt32(reader.GetOrdinal("StudentID")),
                        reader.GetString(reader.GetOrdinal("Password"))
                    ));
                }
                return studentList;
            });
        }

        public async Task<clsStudentDTO?> GetByIdAsync(int id)
        {
            return await ExecuteCommandAsync("SP_GetStudentInfoByID", cmd => cmd.Parameters.AddWithValue("@StudentID", id), async cmd =>
            {
                using var reader = await cmd.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    return new clsStudentDTO(
                        reader.GetInt32(reader.GetOrdinal("PersonID")),
                        reader.GetString(reader.GetOrdinal("FirstName")),
                        reader.GetString(reader.GetOrdinal("LastName")),
                        reader.GetString(reader.GetOrdinal("Phone")),
                        reader.GetString(reader.GetOrdinal("Email")),
                        reader.GetInt32(reader.GetOrdinal("StudentID")),
                        null
                    );
                }
                return null;
            });
        }

        public async Task<bool> UpdateAsync(clsUpdateStudentDTO updateDTO)
        {
            return await ExecuteCommandAsync("SP_UpdateStudent", cmd =>
            {
                cmd.Parameters.AddWithValue("@StudentID", updateDTO.StudentID);
                cmd.Parameters.AddWithValue("@FirstName", updateDTO.FirstName);
                cmd.Parameters.AddWithValue("@LastName", updateDTO.LastName);
                cmd.Parameters.AddWithValue("@Phone", updateDTO.Phone);
                cmd.Parameters.AddWithValue("@Email", updateDTO.Email);
                cmd.Parameters.AddWithValue("@Password", updateDTO.Password);
                cmd.Parameters.AddWithValue("@Role", "Student");
            }, async cmd => await cmd.ExecuteNonQueryAsync() > 0);
        }

        public async Task<bool> ChangePasswordAsync(int studentID, string newPassword)
        {
            return await ExecuteCommandAsync("SP_ChangeStudentPassword", cmd =>
            {
                cmd.Parameters.AddWithValue("@StudentID", studentID);
                cmd.Parameters.AddWithValue("@NewPassword", newPassword);
            }, async cmd => await cmd.ExecuteNonQueryAsync() > 0);
        }

        public async Task<clsStudentDTO?> LoginAsync(string email, string password)
        {
            return await ExecuteCommandAsync("SP_GetEmailAndPasswordFormStudent", cmd =>
            {
                cmd.Parameters.AddWithValue("@Email", email);
                cmd.Parameters.AddWithValue("@Password", password);
                cmd.Parameters.AddWithValue("@Role", "Student");
            }, async cmd =>
            {
                using var reader = await cmd.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    return new clsStudentDTO(
                        reader.GetInt32(reader.GetOrdinal("PersonID")),
                        reader.GetString(reader.GetOrdinal("FirstName")),
                        reader.GetString(reader.GetOrdinal("LastName")),
                        reader.GetString(reader.GetOrdinal("Phone")),
                        reader.GetString(reader.GetOrdinal("Email")),
                        reader.GetInt32(reader.GetOrdinal("StudentID")),
                        null
                    );
                }
                return null;
            });
        }

        public  Task <clsStudentDTO?> GetStudentByEmail(string email)
        {
            return ExecuteCommandAsync("SP_GetStudentByEmail", cmd => cmd.Parameters.AddWithValue("@Email", email), async cmd =>
                {
                    clsStudentDTO? student = null;
                    using var reader = await cmd.ExecuteReaderAsync();
                    if (await reader.ReadAsync())
                    {
                        student = new clsStudentDTO(
                        reader.GetInt32(reader.GetOrdinal("PersonID")),
                        reader.GetString(reader.GetOrdinal("FirstName")),
                        reader.GetString(reader.GetOrdinal("LastName")),
                        reader.GetString(reader.GetOrdinal("Phone")),
                        reader.GetString(reader.GetOrdinal("Email")),
                        reader.GetInt32(reader.GetOrdinal("StudentID")),
                        null);
                    }
                    return student;
                });
        }

        public Task<clsStudentDTO?> GetStudentByPersonID(int personID)
        {
            return ExecuteCommandAsync("SP_GetStudentByPersonID", cmd => cmd.Parameters.AddWithValue("@PersonID", personID), async cmd =>
            {
                using var reader = await cmd.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    return new clsStudentDTO(
                    reader.GetInt32(reader.GetOrdinal("PersonID")),
                    reader.GetString(reader.GetOrdinal("FirstName")),
                    reader.GetString(reader.GetOrdinal("LastName")),
                    reader.GetString(reader.GetOrdinal("Phone")),
                    reader.GetString(reader.GetOrdinal("Email")),
                    reader.GetInt32(reader.GetOrdinal("StudentID")),
                    null);
                }
                else
                    return null;
            });
        }
    }
}