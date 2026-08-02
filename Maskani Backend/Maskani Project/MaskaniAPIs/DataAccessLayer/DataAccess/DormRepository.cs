using System;
using System.Collections.Generic;
using System.Data.Common;
using System.Threading.Tasks;
using DataAccessLayer.Interfaces;
using MaskaniDataAccessLayer.DataHelper;
using Microsoft.Extensions.Configuration;
using Repositry_DataAccess_.DTOs;

namespace Repositry_DataAccess_.DataAccess
{
    public class DormRepository : BaseRepository, IDormRepository
    {
        public DormRepository(IConfiguration configuration)
            : base(
                configuration.GetConnectionString("DefaultConnection")
                ?? throw new InvalidOperationException(
                    "The DefaultConnection connection string is missing."))
        {
        }

        public Task<string> AddDormAsync(clsAddDormDTO dorm)
        {
            ArgumentNullException.ThrowIfNull(dorm);

            return ExecuteCommandAsync(
                "SP_AddNewDorm",
                cmd =>
                {
                    cmd.Parameters.AddWithValue("@DormID", dorm.DormID);
                    cmd.Parameters.AddWithValue("@OwnerID", dorm.OwnerID);
                    cmd.Parameters.AddWithValue(
                        "@UniversityID",
                        dorm.UniversityID);

                    cmd.Parameters.AddWithValue(
                        "@DormName",
                        dorm.DormName);

                    cmd.Parameters.AddWithValue(
                        "@Address",
                        dorm.Address);

                    cmd.Parameters.AddWithValue(
                        "@FurnishedOrNot",
                        dorm.FurnishedOrNot);

                    cmd.Parameters.AddWithValue(
                        "@Distance",
                        dorm.Distance);

                    cmd.Parameters.AddWithValue(
                        "@Latitude",
                        (object?)dorm.Latitude ?? DBNull.Value);

                    cmd.Parameters.AddWithValue(
                        "@Longitude",
                        (object?)dorm.Longitude ?? DBNull.Value);
                },
                async cmd =>
                {
                    object? result = await cmd.ExecuteScalarAsync();

                    return result == null || result == DBNull.Value
                        ? string.Empty
                        : result.ToString() ?? string.Empty;
                });
        }

        public Task<bool> DeleteDormAsync(string dormId)
        {
            return ExecuteCommandAsync(
                "SP_DeleteDorm",
                cmd =>
                {
                    cmd.Parameters.AddWithValue(
                        "@DormID",
                        dormId);
                },
                async cmd =>
                {
                    int affectedRows =
                        await cmd.ExecuteNonQueryAsync();

                    return affectedRows > 0;
                });
        }

        public Task<bool> DormExistsAsync(string dormId)
        {
            return ExecuteCommandAsync(
                "SP_DormExists",
                cmd =>
                {
                    cmd.Parameters.AddWithValue(
                        "@DormID",
                        dormId);
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

        public Task<bool> DormNameExistsAsync(string dormName)
        {
            return ExecuteCommandAsync(
                "SP_DormNameExists",
                cmd =>
                {
                    cmd.Parameters.AddWithValue(
                        "@DormName",
                        dormName);
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

        public Task<List<clsDormDTO>> GetAllDormsAsync()
        {
            return ExecuteCommandAsync(
                "SP_GetAllDorms",
                cmd => { },
                async cmd =>
                {
                    var dorms = new List<clsDormDTO>();

                    await using DbDataReader reader =
                        await cmd.ExecuteReaderAsync();

                    while (await reader.ReadAsync())
                    {
                        dorms.Add(MapDorm(reader));
                    }

                    return dorms;
                });
        }

        public Task<List<clsDormDTO>> GetPendingDormsAsync()
        {
            return ExecuteCommandAsync(
                "SP_GetPendingDorms",
                cmd => { },
                async cmd =>
                {
                    var dorms = new List<clsDormDTO>();

                    await using DbDataReader reader =
                        await cmd.ExecuteReaderAsync();

                    while (await reader.ReadAsync())
                    {
                        dorms.Add(MapDorm(reader));
                    }

                    return dorms;
                });
        }

        public Task<bool> UpdateDormStatusAsync(
            string dormId,
            string dormStatus)
        {
            return ExecuteCommandAsync(
                "SP_UpdateDormStatus",
                cmd =>
                {
                    cmd.Parameters.AddWithValue(
                        "@DormID",
                        dormId);

                    cmd.Parameters.AddWithValue(
                        "@DormStatus",
                        dormStatus);
                },
                async cmd =>
                {
                    int affectedRows =
                        await cmd.ExecuteNonQueryAsync();

                    return affectedRows > 0;
                });
        }

        public Task<clsDormDTO?> GetDormByIdAsync(
            string dormId)
        {
            return ExecuteCommandAsync(
                "SP_GetOwnerDataByDormID",
                cmd =>
                {
                    cmd.Parameters.AddWithValue(
                        "@DormID",
                        dormId);
                },
                async cmd =>
                {
                    await using DbDataReader reader =
                        await cmd.ExecuteReaderAsync();

                    if (!await reader.ReadAsync())
                    {
                        return null;
                    }

                    return MapDorm(reader);
                });
        }

        public Task<int> GetDormCountByUniversityAsync(
            string universityName)
        {
            return ExecuteCommandAsync(
                "SP_GetDormCountByUniversity",
                cmd =>
                {
                    cmd.Parameters.AddWithValue(
                        "@UniversityName",
                        universityName);
                },
                async cmd =>
                {
                    object? result =
                        await cmd.ExecuteScalarAsync();

                    return result == null ||
                           result == DBNull.Value
                        ? 0
                        : Convert.ToInt32(result);
                });
        }

        public Task<List<clsDormDTO>> GetDormsByAddressAsync(
            string address)
        {
            return ExecuteCommandAsync(
                "SP_GetDormsByAddress",
                cmd =>
                {
                    cmd.Parameters.AddWithValue(
                        "@Address",
                        address);
                },
                async cmd =>
                {
                    var dorms = new List<clsDormDTO>();

                    await using DbDataReader reader =
                        await cmd.ExecuteReaderAsync();

                    while (await reader.ReadAsync())
                    {
                        dorms.Add(MapDorm(reader));
                    }

                    return dorms;
                });
        }

        public Task<List<clsDormDTO>> GetDormsByDistanceAsync(
            double maxDistance)
        {
            return ExecuteCommandAsync(
                "SP_GetDormsByDistance",
                cmd =>
                {
                    cmd.Parameters.AddWithValue(
                        "@MaxDistance",
                        maxDistance);
                },
                async cmd =>
                {
                    var dorms = new List<clsDormDTO>();

                    await using DbDataReader reader =
                        await cmd.ExecuteReaderAsync();

                    while (await reader.ReadAsync())
                    {
                        dorms.Add(MapDorm(reader));
                    }

                    return dorms;
                });
        }

        public Task<List<clsDormDTO>> GetDormsByFurnishingAsync(
            bool furnishedOrNot)
        {
            return ExecuteCommandAsync(
                "SP_GetDormsByFurnishing",
                cmd =>
                {
                    cmd.Parameters.AddWithValue(
                        "@FurnishedOrNot",
                        furnishedOrNot);
                },
                async cmd =>
                {
                    var dorms = new List<clsDormDTO>();

                    await using DbDataReader reader =
                        await cmd.ExecuteReaderAsync();

                    while (await reader.ReadAsync())
                    {
                        dorms.Add(MapDorm(reader));
                    }

                    return dorms;
                });
        }

        public Task<List<clsDormDTO>> GetDormsByOwnerAsync(
            string ownerName)
        {
            return ExecuteCommandAsync(
                "SP_GetDormsByOwner",
                cmd =>
                {
                    cmd.Parameters.AddWithValue(
                        "@OwnerName",
                        ownerName);
                },
                async cmd =>
                {
                    var dorms = new List<clsDormDTO>();

                    await using DbDataReader reader =
                        await cmd.ExecuteReaderAsync();

                    while (await reader.ReadAsync())
                    {
                        dorms.Add(MapDorm(reader));
                    }

                    return dorms;
                });
        }

        public Task<List<clsDormDTO>> GetDormsByOwnerIDAsync(
            int ownerID)
        {
            return ExecuteCommandAsync(
                "SP_GetDormsByOwnerID",
                cmd =>
                {
                    cmd.Parameters.AddWithValue(
                        "@OwnerID",
                        ownerID);
                },
                async cmd =>
                {
                    var dorms = new List<clsDormDTO>();

                    await using DbDataReader reader =
                        await cmd.ExecuteReaderAsync();

                    while (await reader.ReadAsync())
                    {
                        dorms.Add(MapDorm(reader));
                    }

                    return dorms;
                });
        }

        public Task<List<clsDormDTO>> GetDormsByUniversityAsync(
            string universityName)
        {
            return ExecuteCommandAsync(
                "SP_GetDormsByUniversityName",
                cmd =>
                {
                    cmd.Parameters.AddWithValue(
                        "@UniversityName",
                        universityName);
                },
                async cmd =>
                {
                    var dorms = new List<clsDormDTO>();

                    await using DbDataReader reader =
                        await cmd.ExecuteReaderAsync();

                    while (await reader.ReadAsync())
                    {
                        dorms.Add(MapDorm(reader));
                    }

                    return dorms;
                });
        }

        public Task<List<clsDormDTO>> GetDormsPagedAsync(
            int pageIndex,
            int pageSize)
        {
            return ExecuteCommandAsync(
                "SP_GetDormsPaged",
                cmd =>
                {
                    cmd.Parameters.AddWithValue(
                        "@PageNumber",
                        pageIndex);

                    cmd.Parameters.AddWithValue(
                        "@PageSize",
                        pageSize);
                },
                async cmd =>
                {
                    var dorms = new List<clsDormDTO>();

                    await using DbDataReader reader =
                        await cmd.ExecuteReaderAsync();

                    while (await reader.ReadAsync())
                    {
                        dorms.Add(MapDorm(reader));
                    }

                    return dorms;
                });
        }

        public Task<int> GetTotalDormsAsync()
        {
            return ExecuteCommandAsync(
                "SP_GetTotalDorms",
                cmd => { },
                async cmd =>
                {
                    object? result =
                        await cmd.ExecuteScalarAsync();

                    return result == null ||
                           result == DBNull.Value
                        ? 0
                        : Convert.ToInt32(result);
                });
        }

        public Task<List<clsDormDTO>> SearchDormsAsync(
            string? university = null,
            bool? furnished = null,
            double? maxDistance = null,
            string? address = null,
            string? DormName = null)
        {
            return ExecuteCommandAsync(
                "SP_SearchDorms",
                cmd =>
                {
                    if (!string.IsNullOrWhiteSpace(university))
                    {
                        cmd.Parameters.AddWithValue(
                            "@UniversityName",
                            university);
                    }

                    if (furnished.HasValue)
                    {
                        cmd.Parameters.AddWithValue(
                            "@FurnishedOrNot",
                            furnished.Value);
                    }

                    if (maxDistance.HasValue)
                    {
                        cmd.Parameters.AddWithValue(
                            "@Distance",
                            maxDistance.Value);
                    }

                    if (!string.IsNullOrWhiteSpace(address))
                    {
                        cmd.Parameters.AddWithValue(
                            "@Address",
                            address);
                    }

                    if (!string.IsNullOrWhiteSpace(DormName))
                    {
                        cmd.Parameters.AddWithValue(
                            "@DormName",
                            DormName);
                    }
                },
                async cmd =>
                {
                    var dorms = new List<clsDormDTO>();

                    await using DbDataReader reader =
                        await cmd.ExecuteReaderAsync();

                    while (await reader.ReadAsync())
                    {
                        dorms.Add(MapDorm(reader));
                    }

                    return dorms;
                });
        }

        public Task<bool> UpdateDormAsync(
            clsUpdateDormDTO dorm)
        {
            ArgumentNullException.ThrowIfNull(dorm);

            return ExecuteCommandAsync(
                "SP_UpdateDorm",
                cmd =>
                {
                    cmd.Parameters.AddWithValue(
                        "@DormID",
                        dorm.DormID);

                    cmd.Parameters.AddWithValue(
                        "@DormName",
                        dorm.DormName);

                    cmd.Parameters.AddWithValue(
                        "@Address",
                        dorm.Address);

                    cmd.Parameters.AddWithValue(
                        "@FurnishedOrNot",
                        dorm.FurnishedOrNot);

                    cmd.Parameters.AddWithValue(
                        "@Distance",
                        dorm.Distance);

                    cmd.Parameters.AddWithValue(
                        "@UniversityID",
                        dorm.UniversityID);

                    cmd.Parameters.AddWithValue(
                        "@OwnerID",
                        dorm.OwnerID);

                    cmd.Parameters.AddWithValue(
                        "@Latitude",
                        (object?)dorm.Latitude ?? DBNull.Value);

                    cmd.Parameters.AddWithValue(
                        "@Longitude",
                        (object?)dorm.Longitude ?? DBNull.Value);
                },
                async cmd =>
                {
                    int affectedRows =
                        await cmd.ExecuteNonQueryAsync();

                    return affectedRows > 0;
                });
        }

        private static clsDormDTO MapDorm(
            DbDataReader reader)
        {
            return new clsDormDTO
            {
                DormID = GetString(reader, "DormID"),

                OwnerID = GetInt32(
                    reader,
                    "OwnerID"),

                DormName = GetString(
                    reader,
                    "DormName"),

                Address = GetString(
                    reader,
                    "Address"),

                FurnishedOrNot = GetBoolean(
                    reader,
                    "FurnishedOrNot"),

                Distance = GetDouble(
                    reader,
                    "Distance"),

                UniversityName = GetString(
                    reader,
                    "UniversityName"),

                OwnerName = GetString(
                    reader,
                    "OwnerName"),

                Phone = GetString(
                    reader,
                    "Phone"),

                Email = GetString(
                    reader,
                    "Email"),

                Latitude = GetNullableDouble(
                    reader,
                    "Latitude"),

                Longitude = GetNullableDouble(
                    reader,
                    "Longitude"),

                DormStatus = GetString(
                    reader,
                    "DormStatus")
            };
        }

        private static bool HasColumn(
            DbDataReader reader,
            string columnName)
        {
            for (int index = 0;
                 index < reader.FieldCount;
                 index++)
            {
                if (string.Equals(
                        reader.GetName(index),
                        columnName,
                        StringComparison.OrdinalIgnoreCase))
                {
                    return true;
                }
            }

            return false;
        }

        private static string GetString(
            DbDataReader reader,
            string columnName)
        {
            if (!HasColumn(reader, columnName))
            {
                return string.Empty;
            }

            object value = reader[columnName];

            return value == DBNull.Value
                ? string.Empty
                : value.ToString() ?? string.Empty;
        }

        private static int GetInt32(
            DbDataReader reader,
            string columnName)
        {
            if (!HasColumn(reader, columnName))
            {
                return 0;
            }

            object value = reader[columnName];

            return value == DBNull.Value
                ? 0
                : Convert.ToInt32(value);
        }

        private static double GetDouble(
            DbDataReader reader,
            string columnName)
        {
            if (!HasColumn(reader, columnName))
            {
                return 0;
            }

            object value = reader[columnName];

            return value == DBNull.Value
                ? 0
                : Convert.ToDouble(value);
        }

        private static double? GetNullableDouble(
            DbDataReader reader,
            string columnName)
        {
            if (!HasColumn(reader, columnName))
            {
                return null;
            }

            object value = reader[columnName];

            return value == DBNull.Value
                ? null
                : Convert.ToDouble(value);
        }

        private static bool GetBoolean(
            DbDataReader reader,
            string columnName)
        {
            if (!HasColumn(reader, columnName))
            {
                return false;
            }

            object value = reader[columnName];

            return value != DBNull.Value &&
                   Convert.ToBoolean(value);
        }
    }
}