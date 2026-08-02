using System.Data;
using DataAccessLayer.Interfaces;
using MaskaniDataAccessLayer.DataHelper;
using Microsoft.Extensions.Configuration;
using Repositry_DataAccess_.DTOs;

namespace Repositry_DataAccess_.DataAccess
{
    public class DormImageRepository :
        BaseRepository,
        IDormImageRepository
    {
        public DormImageRepository(
            IConfiguration configuration)
            : base(
                configuration.GetConnectionString(
                    "DefaultConnection"))
        {
        }

        public Task<int> AddDormImageAsync(
            string dormId,
            string imageUrl,
            string publicId,
            int displayOrder)
        {
            return ExecuteCommandAsync(
                "SP_AddDormImage",
                cmd =>
                {
                    cmd.Parameters
                        .Add(
                            "@DormID",
                            SqlDbType.NVarChar,
                            100)
                        .Value = dormId;

                    cmd.Parameters
                        .Add(
                            "@ImageUrl",
                            SqlDbType.NVarChar,
                            -1)
                        .Value = imageUrl;

                    cmd.Parameters
                        .Add(
                            "@PublicId",
                            SqlDbType.NVarChar,
                            500)
                        .Value = publicId;

                    cmd.Parameters
                        .Add(
                            "@DisplayOrder",
                            SqlDbType.Int)
                        .Value = displayOrder;
                },
                async cmd =>
                {
                    object? result =
                        await cmd.ExecuteScalarAsync();

                    if (result == null ||
                        result == DBNull.Value)
                    {
                        throw new InvalidOperationException(
                            "The image could not be created.");
                    }

                    return Convert.ToInt32(result);
                });
        }

        public Task<List<clsDormImageDTO>>
            GetDormImagesAsync(string dormId)
        {
            return ExecuteCommandAsync(
                "SP_GetDormImages",
                cmd =>
                {
                    cmd.Parameters
                        .Add(
                            "@DormID",
                            SqlDbType.NVarChar,
                            100)
                        .Value = dormId;
                },
                async cmd =>
                {
                    var images =
                        new List<clsDormImageDTO>();

                    await using var reader =
                        await cmd.ExecuteReaderAsync();

                    while (await reader.ReadAsync())
                    {
                        images.Add(MapDormImage(reader));
                    }

                    return images;
                });
        }

        public Task<clsDormImageDTO?>
            GetDormImageByIdAsync(int imageId)
        {
            return ExecuteCommandAsync(
                "SP_GetDormImageById",
                cmd =>
                {
                    cmd.Parameters
                        .Add(
                            "@ImageID",
                            SqlDbType.Int)
                        .Value = imageId;
                },
                async cmd =>
                {
                    await using var reader =
                        await cmd.ExecuteReaderAsync();

                    if (!await reader.ReadAsync())
                    {
                        return null;
                    }

                    return MapDormImage(reader);
                });
        }

        public Task<bool> DeleteDormImageAsync(
            int imageId)
        {
            return ExecuteCommandAsync(
                "SP_DeleteDormImage",
                cmd =>
                {
                    cmd.Parameters
                        .Add(
                            "@ImageID",
                            SqlDbType.Int)
                        .Value = imageId;
                },
                async cmd =>
                {
                    int affectedRows =
                        await cmd.ExecuteNonQueryAsync();

                    return affectedRows > 0;
                });
        }

        public Task<int> CountDormImagesAsync(
            string dormId)
        {
            return ExecuteCommandAsync(
                "SP_CountDormImages",
                cmd =>
                {
                    cmd.Parameters
                        .Add(
                            "@DormID",
                            SqlDbType.NVarChar,
                            100)
                        .Value = dormId;
                },
                async cmd =>
                {
                    object? result =
                        await cmd.ExecuteScalarAsync();

                    if (result == null ||
                        result == DBNull.Value)
                    {
                        return 0;
                    }

                    return Convert.ToInt32(result);
                });
        }

        private static clsDormImageDTO MapDormImage(
            System.Data.Common.DbDataReader reader)
        {
            int imageIdOrdinal =
                reader.GetOrdinal("ImageID");

            int dormIdOrdinal =
                reader.GetOrdinal("DormID");

            int imageUrlOrdinal =
                reader.GetOrdinal("ImageUrl");

            int publicIdOrdinal =
                reader.GetOrdinal("PublicId");

            int displayOrderOrdinal =
                reader.GetOrdinal("DisplayOrder");

            int uploadedAtOrdinal =
                reader.GetOrdinal("UploadedAt");

            return new clsDormImageDTO
            {
                ImageID =
                    reader.GetInt32(imageIdOrdinal),

                DormID =
                    reader.IsDBNull(dormIdOrdinal)
                        ? string.Empty
                        : reader.GetString(dormIdOrdinal),

                ImageUrl =
                    reader.IsDBNull(imageUrlOrdinal)
                        ? string.Empty
                        : reader.GetString(imageUrlOrdinal),

                PublicId =
                    reader.IsDBNull(publicIdOrdinal)
                        ? string.Empty
                        : reader.GetString(publicIdOrdinal),

                DisplayOrder =
                    reader.GetInt32(displayOrderOrdinal),

                UploadedAt =
                    reader.GetDateTime(uploadedAtOrdinal)
            };
        }
    }
}