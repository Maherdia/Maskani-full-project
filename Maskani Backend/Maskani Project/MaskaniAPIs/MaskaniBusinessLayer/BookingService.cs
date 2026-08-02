using DataAccessLayer.DTOs;
using DataAccessLayer.Interfaces;
using Microsoft.Data.SqlClient;

namespace MaskaniBusinessLayer
{
    public class BookingService
    {
        private readonly IBookingRepository _bookingRepository;

        public BookingService(IBookingRepository bookingRepository)
        {
            _bookingRepository = bookingRepository;
        }

        public async Task<List<clsBookingDTO>> GetBookingsByOwnerIdAsync(int ownerId)
            => await _bookingRepository.GetBookingsByOwnerIdAsync(ownerId);

        public async Task<List<clsBookingDTO>> GetBookingsByStudentIdAsync(int studentId)
            => await _bookingRepository.GetBookingsByStudentIdAsync(studentId);

        public async Task<bool> BookingExistsAsync(int studentId, int roomId, int bookID)
            => await _bookingRepository.BookingExistsAsync(studentId, roomId, bookID);

        public async Task<List<clsBookingDTO>> GetBookingsByStatusAsync(string status)
            => await _bookingRepository.GetBookingsByStatusAsync(status);

        public async Task<int> GetBookingCountAsync()
            => await _bookingRepository.GetBookingCountAsync();

        public async Task<List<clsBookingDTO>> GetAllBookingsAsync()
            => await _bookingRepository.GetAllAsync();

        public async Task<clsBookingDTO?> GetBookingByIdAsync(int bookingId)
            => await _bookingRepository.GetByIdAsync(bookingId);

        public async Task<bool> IsDuplicateBookingAsync(int studentID, int roomID, int? bookID = null)
            => await _bookingRepository.CheckDuplicateBooking(studentID, roomID, bookID);

        public async Task<int> AddBookingAsync(clsAddBookingDTO dto)
        {
            bool hasDuplicate = await _bookingRepository.CheckDuplicateBooking(
                dto.StudentID,
                dto.RoomID,
                null);

            if (hasDuplicate)
                throw new InvalidOperationException("You already have a booking for that room.");

            return await _bookingRepository.AddAsync(dto);
        }

        public async Task<bool> UpdateBookingAsync(clsUpdateBookingDTO dto)
        {
            bool duplicate = await _bookingRepository.CheckDuplicateBooking(
                dto.StudentID,
                dto.RoomID,
                dto.BookID);

            if (duplicate)
                throw new InvalidOperationException("Another booking for this student + room already exists.");

            return await _bookingRepository.UpdateAsync(dto);
        }

        public async Task<bool> DeleteBookingAsync(int bookingId, int studentId)
        {
            bool ownsBooking = await _bookingRepository.StudentOwnsBookingAsync(bookingId, studentId);

            if (!ownsBooking)
                throw new UnauthorizedAccessException("You are not allowed to delete this booking.");

            return await _bookingRepository.DeleteAsync(bookingId);
        }

        public async Task<bool> DeleteBookingAsAdminAsync(int bookingId)
            => await _bookingRepository.DeleteAsync(bookingId);

        // ===========================
        // CANCEL (ADMIN)
        // ===========================
        public async Task<clsUpdateBookingDTO> CancelBookingAsAdminAsync(int bookingId)
        {
            try
            {
                return await _bookingRepository.CancelBookingAsync(bookingId);
            }
            catch (SqlException ex)
            {
                if (ex.Message.Contains("already cancelled"))
                    throw new InvalidOperationException("Booking is already cancelled.");

                if (ex.Message.Contains("Booking not found"))
                    throw new KeyNotFoundException("Booking not found.");

                throw;
            }
        }

        // ===========================
        // CONFIRM (ADMIN)
        // ===========================
        public async Task<clsUpdateBookingDTO> ConfirmBookingAsAdminAsync(int bookingId)
        {
            try
            {
                return await _bookingRepository.ConfirmBookingAsync(bookingId);
            }
            catch (SqlException ex)
            {
                if (ex.Message.Contains("already confirmed"))
                    throw new InvalidOperationException("Booking is already confirmed.");

                if (ex.Message.Contains("Booking not found"))
                    throw new KeyNotFoundException("Booking not found.");

                throw;
            }
        }

        // ===========================
        // CANCEL (STUDENT)
        // ===========================
        public async Task<clsUpdateBookingDTO> CancelBookingAsync(int bookingId, int studentId)
        {
            bool ownsBooking = await _bookingRepository.StudentOwnsBookingAsync(bookingId, studentId);

            if (!ownsBooking)
                throw new UnauthorizedAccessException("You are not allowed to cancel this booking.");

            try
            {
                return await _bookingRepository.CancelBookingAsync(bookingId);
            }
            catch (SqlException ex)
            {
                if (ex.Message.Contains("already cancelled"))
                    throw new InvalidOperationException("Booking is already cancelled.");

                if (ex.Message.Contains("Booking not found"))
                    throw new KeyNotFoundException("Booking not found.");

                throw;
            }
        }

        // ===========================
        // CANCEL (OWNER)
        // ===========================
        public async Task<clsUpdateBookingDTO> CancelBookingByOwnerAsync(int bookingId, int ownerId)
        {
            bool ownsBooking = await _bookingRepository.OwnerOwnsBookingAsync(bookingId, ownerId);

            if (!ownsBooking)
                throw new UnauthorizedAccessException("You do not own this booking.");

            try
            {
                return await _bookingRepository.CancelBookingAsync(bookingId);
            }
            catch (SqlException ex)
            {
                if (ex.Message.Contains("already cancelled"))
                    throw new InvalidOperationException("Booking is already cancelled.");

                if (ex.Message.Contains("Booking not found"))
                    throw new KeyNotFoundException("Booking not found.");

                throw;
            }
        }

        // ===========================
        // CONFIRM (OWNER)
        // ===========================
        public async Task<clsUpdateBookingDTO> ConfirmedBookingAsync(int bookingId, int ownerId)
        {
            bool ownsBooking = await _bookingRepository.OwnerOwnsBookingAsync(bookingId, ownerId);

            if (!ownsBooking)
                throw new UnauthorizedAccessException("You do not own this booking.");

            try
            {
                return await _bookingRepository.ConfirmBookingAsync(bookingId);
            }
            catch (SqlException ex)
            {
                if (ex.Message.Contains("already confirmed"))
                    throw new InvalidOperationException("Booking is already confirmed.");

                if (ex.Message.Contains("Booking not found"))
                    throw new KeyNotFoundException("Booking not found.");

                throw;
            }
        }
    }
}