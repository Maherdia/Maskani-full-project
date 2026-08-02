using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccessLayer.DTOs;
using DataAccessLayer.Interfaces;
using MaskaniDataAccessLayer.DataHelper;
using Microsoft.Extensions.Configuration;

namespace DataAccessLayer.DataAccess
{
    public class BookingRepository : BaseRepository, IBookingRepository
    {
        public BookingRepository(IConfiguration configuration) : base(configuration.GetConnectionString("DefaultConnection")) { }

        private static clsBookingDTO ReadBooking(SqlDataReader reader)
        {
            return new clsBookingDTO
            {
                BookID = reader.GetInt32(reader.GetOrdinal("BookID")),
                DormID = reader.GetString(reader.GetOrdinal("DormID")),
                StudentName = reader.GetString(reader.GetOrdinal("StudentName")),
                DormName = reader.GetString(reader.GetOrdinal("DormName")),
                RoomID = reader.GetInt32(reader.GetOrdinal("RoomID")),
                PriceMonthly = reader.GetDecimal(reader.GetOrdinal("PriceMonthly")),
                BookingDate = reader.GetDateTime(reader.GetOrdinal("BookingDate")),
                Period = reader.GetInt32(reader.GetOrdinal("Period")),
                TotalAmount = reader.GetDecimal(reader.GetOrdinal("TotalAmount")),
                Status = reader.GetString(reader.GetOrdinal("Status")),
                OwnerID = reader.GetInt32(reader.GetOrdinal("OwnerID")),
                OwnerName = reader.GetString(reader.GetOrdinal("OwnerName")),
                StudentID = reader.GetInt32(reader.GetOrdinal("StudentID")),
                TermId = reader.IsDBNull(reader.GetOrdinal("TermId")) ? null : reader.GetInt32(reader.GetOrdinal("TermId")),
                TermName = reader.IsDBNull(reader.GetOrdinal("TermName")) ? null : reader.GetString(reader.GetOrdinal("TermName")),
                TermStartDate = reader.IsDBNull(reader.GetOrdinal("TermStartDate")) ? null : reader.GetFieldValue<DateOnly>(reader.GetOrdinal("TermStartDate")),
                TermEndDate = reader.IsDBNull(reader.GetOrdinal("TermEndDate")) ? null : reader.GetFieldValue<DateOnly>(reader.GetOrdinal("TermEndDate")),
            };
        }

        public Task<int> AddAsync(clsAddBookingDTO createDTO)
        {
            return ExecuteCommandAsync("SP_AddNewBooking", cmd =>
            {
                cmd.Parameters.AddWithValue("@StudentID", createDTO.StudentID);
                cmd.Parameters.AddWithValue("@DormID", createDTO.DormID);
                cmd.Parameters.AddWithValue("@RoomID", createDTO.RoomID);
                cmd.Parameters.AddWithValue("@BookingDate", createDTO.BookingDate);
                cmd.Parameters.AddWithValue("@Period", createDTO.Period);
                cmd.Parameters.AddWithValue("@TotalAmount", createDTO.TotalAmount);
                cmd.Parameters.AddWithValue("@Status", createDTO.Status);
                cmd.Parameters.AddWithValue("@TermID", createDTO.TermId);
                var returnValue = cmd.Parameters.Add("@NewBookID", System.Data.SqlDbType.Int);
                returnValue.Direction = System.Data.ParameterDirection.Output;
            }, async cmd =>
            {
                await cmd.ExecuteNonQueryAsync();
                return (int)cmd.Parameters["@NewBookID"].Value;
            });
        }

        public Task<bool> BookingExistsAsync(int studentId, int roomId, int bookID)
        {
            return ExecuteCommandAsync("SP_DoesBookingExists", cmd =>
            {
                cmd.Parameters.AddWithValue("@StudentID", studentId);
                cmd.Parameters.AddWithValue("@RoomID", roomId);
                cmd.Parameters.AddWithValue("@BookID", bookID);
            }, async cmd =>
            {
                var result = await cmd.ExecuteScalarAsync();
                return result != null && Convert.ToInt32(result) > 0;
            });
        }

        public Task<bool> CheckDuplicateBooking(int StudentID, int RoomID, int? BookID = null)
        {
            return ExecuteCommandAsync("SP_CheckDuplicateBooking", cmd =>
            {
                cmd.Parameters.AddWithValue("@StudentID", StudentID);
                cmd.Parameters.AddWithValue("@RoomID", RoomID);
                cmd.Parameters.AddWithValue("@BookID", BookID ?? (object)DBNull.Value);
            }, async cmd =>
            {
                var result = await cmd.ExecuteScalarAsync();
                return result != null && Convert.ToInt32(result) == 1;
            });
        }

        public Task<bool> DeleteAsync(int id)
        {
            return ExecuteCommandAsync("SP_DeleteBooking", cmd => cmd.Parameters.AddWithValue("@BookID", id), async cmd =>
            {
                var result = await cmd.ExecuteNonQueryAsync();
                return result > 0;
            });
        }

        public Task<List<clsBookingDTO>> GetAllAsync()
        {
            return ExecuteCommandAsync("SP_GetAllBookings", cmd => { }, async cmd =>
            {
                var bookings = new List<clsBookingDTO>();
                await using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                    bookings.Add(ReadBooking(reader));
                return bookings;
            });
        }

        public Task<int> GetBookingCountAsync()
        {
            return ExecuteCommandAsync("SP_GetBookingCount", cmd => { }, async cmd =>
            {
                var result = await cmd.ExecuteScalarAsync();
                return result != null ? Convert.ToInt32(result) : 0;
            });
        }

        public Task<List<clsBookingDTO>> GetBookingsByOwnerIdAsync(int ownerId)
        {
            return ExecuteCommandAsync("SP_GetBookingsByOwnerId", cmd =>
            {
                cmd.Parameters.AddWithValue("@OwnerID", ownerId);
            }, async cmd =>
            {
                var bookings = new List<clsBookingDTO>();
                await using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                    bookings.Add(ReadBooking(reader));
                return bookings;
            });
        }

        public Task<List<clsBookingDTO>> GetBookingsByStatusAsync(string status)
        {
            return ExecuteCommandAsync("SP_GetBookingsByStatus", cmd =>
            {
                cmd.Parameters.AddWithValue("@Status", status);
            }, async cmd =>
            {
                var bookings = new List<clsBookingDTO>();
                await using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                    bookings.Add(ReadBooking(reader));
                return bookings;
            });
        }

        public Task<List<clsBookingDTO>> GetBookingsByStudentIdAsync(int studentId)
        {
            return ExecuteCommandAsync("SP_GetBookingsByStudentId", cmd =>
            {
                cmd.Parameters.AddWithValue("@StudentID", studentId);
            }, async cmd =>
            {
                var bookings = new List<clsBookingDTO>();
                await using var reader = await cmd.ExecuteReaderAsync();
                while (await reader.ReadAsync())
                    bookings.Add(ReadBooking(reader));
                return bookings;
            });
        }

        private string? GetDormIDByBookingIdAsync(int BookID)
        {
            return ExecuteCommandAsync("SP_GetDormIDByBookID", cmd =>
            {
                cmd.Parameters.AddWithValue("@BookID", BookID);
            }, async cmd =>
            {
                var result = await cmd.ExecuteScalarAsync();
                return result != null ? result.ToString() : string.Empty;
            }).Result;
        }

        public Task<clsBookingDTO?> GetByIdAsync(int id)
        {
            return ExecuteCommandAsync("SP_GetBookInfoByID", cmd =>
            {
                cmd.Parameters.AddWithValue("@BookID", id);
            }, async cmd =>
            {
                clsBookingDTO? booking = null;
                await using var reader = await cmd.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    booking = ReadBooking(reader);
                    booking.DormID = GetDormIDByBookingIdAsync(id) ?? string.Empty;
                }
                return booking;
            });
        }

        public Task<bool> UpdateAsync(clsUpdateBookingDTO updateDTO)
        {
            return ExecuteCommandAsync("SP_UpdateBooking", cmd =>
            {
                cmd.Parameters.AddWithValue("@BookID", updateDTO.BookID);
                cmd.Parameters.AddWithValue("@StudentID", updateDTO.StudentID);
                cmd.Parameters.AddWithValue("@RoomID", updateDTO.RoomID);
                cmd.Parameters.AddWithValue("@BookingDate", updateDTO.BookingDate);
                cmd.Parameters.AddWithValue("@Period", updateDTO.Period);
                cmd.Parameters.AddWithValue("@Status", updateDTO.Status);
                cmd.Parameters.AddWithValue("@DormID", updateDTO.DormID);
                cmd.Parameters.AddWithValue("@TotalAmount", updateDTO.TotalAmount);
                cmd.Parameters.AddWithValue("@TermID", updateDTO.TermId);
            },
            async cmd =>
            {
                var result = await cmd.ExecuteNonQueryAsync();
                return result > 0;
            });
        }

        public Task<clsUpdateBookingDTO?> CancelBookingAsync(int BookID)
        {
            return ExecuteCommandAsync("SP_CancelBooking", cmd => { cmd.Parameters.AddWithValue("BookID", BookID); }, async cmd =>
            {
                var reader = await cmd.ExecuteReaderAsync();
                if (await reader.ReadAsync())
                {
                    return new clsUpdateBookingDTO
                    {
                        BookID = reader.GetInt32("BookID"),
                        RoomID = reader.GetInt32("RoomID"),
                        BookingDate = reader.GetDateTime("BookingDate"),
                        Period = reader.GetInt32("Period"),
                        TotalAmount = reader.GetDecimal("TotalAmount"),
                        Status = reader.GetString("Status"),
                        StudentID = reader.GetInt32("StudentID"),
                        DormID = GetDormIDByBookingIdAsync(BookID) ?? string.Empty
                    };
                }
                else
                    return null;
            });
        }

        public Task<clsUpdateBookingDTO?> ConfirmBookingAsync(int BookID)
        {
            return ExecuteCommandAsync("SP_ConfirmBooking",
                cmd =>
                {
                    cmd.Parameters.AddWithValue("@BookID", BookID);
                },
                async cmd =>
                {
                    var dormID = GetDormIDByBookingIdAsync(BookID);

                    await using var reader = await cmd.ExecuteReaderAsync();

                    if (!await reader.ReadAsync())
                        return null;

                    return new clsUpdateBookingDTO
                    {
                        BookID = reader.GetInt32(reader.GetOrdinal("BookID")),
                        StudentID = reader.GetInt32(reader.GetOrdinal("StudentID")),
                        RoomID = reader.GetInt32(reader.GetOrdinal("RoomID")),
                        BookingDate = reader.GetDateTime(reader.GetOrdinal("BookingDate")),
                        Period = reader.GetInt32(reader.GetOrdinal("Period")),
                        TotalAmount = reader.GetDecimal(reader.GetOrdinal("TotalAmount")),
                        Status = reader.GetString(reader.GetOrdinal("Status")),
                        DormID = dormID ?? string.Empty
                    };
                });
        }
        public Task<bool> StudentOwnsBookingAsync(int bookingId, int studentId)
        {
            return ExecuteCommandAsync("", cmd =>
            {
                cmd.CommandType = CommandType.Text;
                cmd.CommandText = @"
            SELECT COUNT(*)
            FROM Booking
            WHERE BookID = @BookID
              AND StudentID = @StudentID";

                cmd.Parameters.AddWithValue("@BookID", bookingId);
                cmd.Parameters.AddWithValue("@StudentID", studentId);
            },
            async cmd =>
            {
                var result = await cmd.ExecuteScalarAsync();
                return Convert.ToInt32(result) > 0;
            });
        }

        public Task<bool> OwnerOwnsBookingAsync(int bookingId, int ownerId)
        {
            return ExecuteCommandAsync("", cmd =>
            {
                cmd.CommandType = CommandType.Text;
                cmd.CommandText = @"
        SELECT COUNT(*)
        FROM Booking B
        INNER JOIN Rooms R ON B.RoomID = R.RoomID
        INNER JOIN Dorms D ON R.DormID = D.DormID
        WHERE B.BookID = @BookID
          AND D.OwnerID = @OwnerID";

                cmd.Parameters.AddWithValue("@BookID", bookingId);
                cmd.Parameters.AddWithValue("@OwnerID", ownerId);
            },
            async cmd =>
            {
                var result = await cmd.ExecuteScalarAsync();
                return Convert.ToInt32(result) > 0;
            });
        }
    }
}