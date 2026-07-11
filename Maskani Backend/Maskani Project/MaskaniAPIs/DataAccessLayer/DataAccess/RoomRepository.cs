using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccessLayer.DTOs;
using DataAccessLayer.Interfaces;
using MaskaniDataAccessLayer.DataHelper;
using Microsoft.Extensions.Configuration;

namespace DataAccessLayer.DataAccess
{
    public class RoomRepository:BaseRepository,IRoomRepository
    {
        public RoomRepository(IConfiguration configuration) : base(configuration.GetConnectionString("DefaultConnection")) { }

        public Task<int> AddAsync(clsAddRoomDTO createDTO)
        {
            return ExecuteCommandAsync("SP_AddNewRoom", cmd =>
            {
                cmd.Parameters.AddWithValue("@DormID", createDTO.DormID);
                cmd.Parameters.AddWithValue("@RoomNumber", createDTO.RoomNumber);
                cmd.Parameters.AddWithValue("@Price", createDTO.Price);
                cmd.Parameters.AddWithValue("@Description", createDTO.Description);
                var idParam = new SqlParameter("@NewRoomID", SqlDbType.Int)
                {
                    Direction = ParameterDirection.Output
                };
                cmd.Parameters.Add(idParam);
            }, async cmd => Convert.ToInt32(await cmd.ExecuteScalarAsync()));
        }

        public Task<bool> DeleteAsync(int id)
        {
            return ExecuteCommandAsync("SP_DeleteRoom", cmd => { cmd.Parameters.AddWithValue("@RoomID", id);},
                async cmd => await cmd.ExecuteNonQueryAsync() > 0);
        }

        public Task<List<clsRoomDTO>> GetAllAsync()
        {
            return ExecuteCommandAsync("SP_GetAllRooms", cmd => {}, async cmd =>
            {
                using var reader = await cmd.ExecuteReaderAsync();
                var rooms = new List<clsRoomDTO>();
                while (await reader.ReadAsync())
                {
                    rooms.Add (new clsRoomDTO(
                        reader.GetInt32(reader.GetOrdinal("RoomID")),
                        reader.GetString(reader.GetOrdinal("DormID")),
                        reader.GetInt32(reader.GetOrdinal("RoomNumber")),
                        reader.GetString(reader.GetOrdinal("DormName")),
                        reader.GetDecimal(reader.GetOrdinal("Price")),
                        reader.GetString(reader.GetOrdinal("Description"))));
                }
                return rooms;
            });
        }

        public Task<clsRoomDTO?> GetByIdAsync(int id)
        {
            return ExecuteCommandAsync("SP_GetRoomInfoByID", cmd => cmd.Parameters.AddWithValue("@RoomID", id), async cmd =>
            {
                using var reader = await cmd.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    return new clsRoomDTO(
                        reader.GetInt32(reader.GetOrdinal("RoomID")),
                        reader.GetString(reader.GetOrdinal("DormID")),
                        reader.GetInt32(reader.GetOrdinal("RoomNumber")),
                        reader.GetString(reader.GetOrdinal("DormName")),
                        reader.GetDecimal(reader.GetOrdinal("Price")),
                        reader.GetString(reader.GetOrdinal("Description"))
                        );
                }
                else
                    return null;
            });
        }

        public Task<List<clsRoomDTO>> GetRoomsByDormIdAsync(string dormId)
        {
            return ExecuteCommandAsync("SP_GetRoomByDormID", cmd => cmd.Parameters.AddWithValue("@DormID", dormId), async cmd =>
            {
                var rooms = new List<clsRoomDTO>();
               await using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    rooms.Add(new clsRoomDTO(
                        reader.GetInt32(reader.GetOrdinal("RoomID")),
                        reader.GetString(reader.GetOrdinal("DormID")),
                        reader.GetInt32(reader.GetOrdinal("RoomNumber")),
                        reader.GetString(reader.GetOrdinal("DormName")),
                        reader.GetDecimal(reader.GetOrdinal("Price")),
                        reader.GetString(reader.GetOrdinal("Description"))
                    ));
                }
                return rooms;
            });
        }

        public Task<List<clsRoomDTO>> GetRoomsByPriceRangeAsync(decimal minPrice, double maxPrice)
        {
            return ExecuteCommandAsync("SP_GetRoomsByPriceRange", cmd =>
            {
                cmd.Parameters.AddWithValue("@MinPrice", minPrice);
                cmd.Parameters.AddWithValue("@MaxPrice", maxPrice);
            },
            async cmd =>
            {
                var rooms = new List<clsRoomDTO>();
                using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                {
                    rooms.Add(new clsRoomDTO(
                        reader.GetInt32(reader.GetOrdinal("RoomID")),
                        reader.GetString(reader.GetOrdinal("DormID")),
                        reader.GetInt32(reader.GetOrdinal("RoomNumber")),
                        reader.GetString(reader.GetOrdinal("DormName")),
                        reader.GetDecimal(reader.GetOrdinal("Price")),
                        reader.GetString(reader.GetOrdinal("Description"))
                    ));

                }
                return rooms;
            });
        }

        public Task<bool> RoomExistsAsync(int roomId)
        {
            return ExecuteCommandAsync("SP_DoesRoomExists", cmd =>
            {
                cmd.Parameters.AddWithValue("@RoomID", roomId);
                var returnParam = cmd.Parameters.Add("@ReturnValue", SqlDbType.Int);
                returnParam.Direction = ParameterDirection.ReturnValue;
            }, async cmd =>
            {
                await cmd.ExecuteNonQueryAsync();
                var returnValue = (int)cmd.Parameters["@ReturnValue"].Value;
                return returnValue == 1;
            });
        }
        public Task<bool> UpdateAsync(clsUpdateRoomDTO updateDTO)
        {
            return ExecuteCommandAsync("SP_UpdateRoom", cmd =>
            {
                cmd.Parameters.AddWithValue("@RoomID", updateDTO.RoomID);
                cmd.Parameters.AddWithValue("@DormID", updateDTO.DormID);
                cmd.Parameters.AddWithValue("@Description", updateDTO.Description);
                cmd.Parameters.AddWithValue("@Price", updateDTO.Price);
                cmd.Parameters.AddWithValue("@RoomNumber", updateDTO.RoomNumber);
            },
            async cmd => await cmd.ExecuteNonQueryAsync() > 0);
        }
    }
}
