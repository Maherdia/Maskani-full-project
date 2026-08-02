using System;
using DataAccessLayer.Interfaces;
using MaskaniDataAccess.DTOs;
using MaskaniDataAccessLayer.DataHelper;
using Microsoft.Extensions.Configuration;

namespace MaskaniDataAccess.DataAccess
{
    public class AcademicTermRepository : BaseRepository, IAcademicTermRepository
    {
        public AcademicTermRepository(IConfiguration config)
            : base(config.GetConnectionString("DefaultConnection")) { }

        public Task<List<clsAcademicTermDTO>> GetAllAsync()
        {
            return ExecuteCommandAsync("SP_GetAllAcademicTerms", cmd => { }, async cmd =>
            {
                var list = new List<clsAcademicTermDTO>();
                using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    list.Add(new clsAcademicTermDTO(
                        reader.GetInt32(reader.GetOrdinal("TermId")),
                        reader.GetString(reader.GetOrdinal("Name")),
                        reader.GetFieldValue<DateOnly>(reader.GetOrdinal("StartDate")),
                        reader.GetFieldValue<DateOnly>(reader.GetOrdinal("EndDate")),
                        reader.GetBoolean(reader.GetOrdinal("IsActive"))
                    ));
                }
                return list;
            });
        }

        public Task<List<clsAcademicTermDTO>> GetActiveTermsAsync()
        {
            return ExecuteCommandAsync("SP_GetActiveAcademicTerms", cmd => { }, async cmd =>
            {
                var list = new List<clsAcademicTermDTO>();
                using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    list.Add(new clsAcademicTermDTO(
                        reader.GetInt32(reader.GetOrdinal("TermId")),
                        reader.GetString(reader.GetOrdinal("Name")),
                        reader.GetFieldValue<DateOnly>(reader.GetOrdinal("StartDate")),
                        reader.GetFieldValue<DateOnly>(reader.GetOrdinal("EndDate")),
                        reader.GetBoolean(reader.GetOrdinal("IsActive"))
                    ));
                }
                return list;
            });
        }

        public Task<clsAcademicTermDTO?> GetByIdAsync(int id)
        {
            return ExecuteCommandAsync("SP_GetAcademicTermByID", cmd =>
            {
                cmd.Parameters.AddWithValue("@TermId", id);
            }, async cmd =>
            {
                using var reader = await cmd.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    return new clsAcademicTermDTO(
                        reader.GetInt32(reader.GetOrdinal("TermId")),
                        reader.GetString(reader.GetOrdinal("Name")),
                        reader.GetFieldValue<DateOnly>(reader.GetOrdinal("StartDate")),
                        reader.GetFieldValue<DateOnly>(reader.GetOrdinal("EndDate")),
                        reader.GetBoolean(reader.GetOrdinal("IsActive"))
                    );
                }
                return null;
            });
        }

        public Task<int> AddAsync(clsAddAcademicTermDTO dto)
        {
            return ExecuteCommandAsync("SP_AddNewAcademicTerm", cmd =>
            {
                cmd.Parameters.AddWithValue("@Name", dto.Name);
                cmd.Parameters.AddWithValue("@StartDate", dto.StartDate.ToDateTime(TimeOnly.MinValue));
                cmd.Parameters.AddWithValue("@EndDate", dto.EndDate.ToDateTime(TimeOnly.MinValue));
            }, async cmd => Convert.ToInt32(await cmd.ExecuteScalarAsync()));
        }

        public Task<bool> UpdateAsync(clsUpdateAcademicTermDTO dto)
        {
            return ExecuteCommandAsync("SP_UpdateAcademicTerm", cmd =>
            {
                cmd.Parameters.AddWithValue("@TermId", dto.TermId);
                cmd.Parameters.AddWithValue("@Name", dto.Name);
                cmd.Parameters.AddWithValue("@StartDate", dto.StartDate.ToDateTime(TimeOnly.MinValue));
                cmd.Parameters.AddWithValue("@EndDate", dto.EndDate.ToDateTime(TimeOnly.MinValue));
                cmd.Parameters.AddWithValue("@IsActive", dto.IsActive);
            }, async cmd => await cmd.ExecuteNonQueryAsync() > 0);
        }

        public Task<bool> DeleteAsync(int id)
        {
            return ExecuteCommandAsync("SP_DeleteAcademicTerm", cmd =>
            {
                cmd.Parameters.AddWithValue("@TermId", id);
            }, async cmd => await cmd.ExecuteNonQueryAsync() > 0);
        }
    }
}