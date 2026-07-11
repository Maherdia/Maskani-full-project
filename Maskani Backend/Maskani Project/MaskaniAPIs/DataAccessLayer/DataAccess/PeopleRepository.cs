using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;
using MaskaniDataAccess.Interfaces;
using MaskaniDataAccessLayer.DataHelper;
using MaskaniDataAccessLayer.DTOs;
using Microsoft.Extensions.Configuration;

namespace MaskaniDataAccessLayer.DataAccess
{
    public class PeopleRepository : BaseRepository,IPeopleRepository
    {
        public PeopleRepository(IConfiguration configuration)
            : base(configuration.GetConnectionString("DefaultConnection")) { }

        public async Task<int> AddAsync(clsAddPeopleDTO createDTO)
        {
            return await ExecuteCommandAsync("SP_AddNewPerson", cmd =>
            {
                cmd.Parameters.AddWithValue("@FirstName", createDTO.FirstName);
                cmd.Parameters.AddWithValue("@LastName", createDTO.LastName);
                cmd.Parameters.AddWithValue("@Phone", createDTO.Phone);
                cmd.Parameters.AddWithValue("@Email", createDTO.Email);
                cmd.Parameters.AddWithValue("@Role", createDTO.Role);
                cmd.Parameters.AddWithValue("@VerificationToken", clsPeopleDTO.GenerateVerificationToken());
                cmd.Parameters.AddWithValue("@IsVerified", false);
            }, async cmd => Convert.ToInt32(await cmd.ExecuteScalarAsync()));
        }

        public async Task<bool> DeleteAsync(int id)
        {
            return await ExecuteCommandAsync("SP_DeletePerson",
                cmd => cmd.Parameters.AddWithValue("@PersonID", id),
                async cmd => await cmd.ExecuteNonQueryAsync() > 0);
        }

        public async Task<List<clsPeopleDTO>> GetAllAsync()
        {
            return await ExecuteCommandAsync("SP_GetAllPeople", cmd => { }, async cmd =>
            {
                var peopleList = new List<clsPeopleDTO>();
                using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    peopleList.Add(new clsPeopleDTO
                    {
                        PersonID = reader.GetInt32(reader.GetOrdinal("PersonID")),
                        FirstName = reader.GetString(reader.GetOrdinal("FirstName")),
                        LastName = reader.GetString(reader.GetOrdinal("LastName")),
                        Phone = reader.GetString(reader.GetOrdinal("Phone")),
                        Email = reader.GetString(reader.GetOrdinal("Email")),
                        Role = reader.GetString(reader.GetOrdinal("Role"))
                    });
                }
                return peopleList;
            });
        }

        public async Task<clsPeopleDTO?> GetByIdAsync(int id)
        {
            return await ExecuteCommandAsync("SP_GetPersonInfoByID", cmd => cmd.Parameters.AddWithValue("@PersonID", id), async cmd =>
            {
                using var reader = await cmd.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    return new clsPeopleDTO
                    {
                        PersonID = reader.GetInt32(reader.GetOrdinal("PersonID")),
                        FirstName = reader.GetString(reader.GetOrdinal("FirstName")),
                        LastName = reader.GetString(reader.GetOrdinal("LastName")),
                        Phone = reader.GetString(reader.GetOrdinal("Phone")),
                        Email = reader.GetString(reader.GetOrdinal("Email")),
                        Role = reader.GetString(reader.GetOrdinal("Role"))
                    };
                }
                return null;
            });
        }

        public async Task<bool> UpdateAsync(clsUpdatePeopleDTO updateDTO)
        {
            return await ExecuteCommandAsync("SP_UpdatePerson", cmd =>
            {
                cmd.Parameters.AddWithValue("@PersonID", updateDTO.PersonID);
                cmd.Parameters.AddWithValue("@FirstName", updateDTO.FirstName);
                cmd.Parameters.AddWithValue("@LastName", updateDTO.LastName);
                cmd.Parameters.AddWithValue("@Phone", updateDTO.Phone);
                cmd.Parameters.AddWithValue("@Email", updateDTO.Email);
                cmd.Parameters.AddWithValue("@Role", updateDTO.Role);
            }, async cmd => await cmd.ExecuteNonQueryAsync() > 0);
        }

        public async Task<bool> DoesPersonExistByEmailAsync(string email)
        {
            return await ExecuteCommandAsync("[SP_DoesPersonExistsByEmail]", cmd =>
            {
                cmd.Parameters.AddWithValue("@Email", email);

                var returnParam = new SqlParameter("@ReturnVal", SqlDbType.Int)
                {
                    Direction = ParameterDirection.ReturnValue
                };
                cmd.Parameters.Add(returnParam);
            },
            async cmd =>
            {
                await cmd.ExecuteNonQueryAsync();
                return Convert.ToInt32(cmd.Parameters["@ReturnVal"].Value) == 1;
            });
        }

    }
}
