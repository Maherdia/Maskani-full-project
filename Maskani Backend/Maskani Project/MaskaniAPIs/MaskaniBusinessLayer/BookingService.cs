using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccessLayer.DTOs;
using DataAccessLayer.Interfaces;

namespace MaskaniBusinessLayer
{
    public class BookingService
    {
        private readonly IBookingRepository _bookingRepository;
        public BookingService(IBookingRepository bookingRepository)
        {
            _bookingRepository = bookingRepository;
        }
        public async Task<List<clsBookingDTO>> GetBookingsByOwnerIdAsync(int ownerId)=> await _bookingRepository.GetBookingsByOwnerIdAsync(ownerId);
        public async Task<List<clsBookingDTO>> GetBookingsByStudentIdAsync(int studentId) => await _bookingRepository.GetBookingsByStudentIdAsync(studentId);
        public async Task<bool> BookingExistsAsync(int studentId, int roomId, int bookID) => await _bookingRepository.BookingExistsAsync(studentId, roomId, bookID);
        public async Task<List<clsBookingDTO>> GetBookingsByStatusAsync(string status) => await _bookingRepository.GetBookingsByStatusAsync(status);
        public async Task<int> GetBookingCountAsync() => await _bookingRepository.GetBookingCountAsync();
        public async Task<int> AddBookingAsync(clsAddBookingDTO dto)
        {
            bool hasDuplicate = await _bookingRepository.CheckDuplicateBooking(
                dto.StudentID, dto.RoomID, null);
            if (hasDuplicate)
                throw new InvalidOperationException("You already have a booking for that room.");

            return await _bookingRepository.AddAsync(dto);
        }
        public async Task<bool> UpdateBookingAsync(clsUpdateBookingDTO dto)
        {
            bool duplicate = await _bookingRepository.CheckDuplicateBooking(
                dto.StudentID, dto.RoomID, dto.BookID
            );
            if (duplicate)
                throw new InvalidOperationException("Another booking for this student + room already exists.");

            return await _bookingRepository.UpdateAsync(dto);
        }
        public async Task<bool> DeleteBookingAsync(int bookingId) => await _bookingRepository.DeleteAsync(bookingId);
        public async Task<clsBookingDTO?> GetBookingByIdAsync(int bookingId) => await _bookingRepository.GetByIdAsync(bookingId);
        public async Task<List<clsBookingDTO>> GetAllBookingsAsync() => await _bookingRepository.GetAllAsync();
        public async Task<bool> IsDuplicateBookingAsync(int StudentID,int RoomID,int? BookID=null)
            => await _bookingRepository.CheckDuplicateBooking(StudentID, RoomID,BookID);

        public async Task<clsUpdateBookingDTO> CancelBookingAsync(int bookingId)
        {
            var booking = await _bookingRepository.GetByIdAsync(bookingId);
            if (booking != null)
            {
                booking.Status = "Cancelled";
                return await _bookingRepository.CancelBookingAsync(bookingId);
            }
            else
                return null ?? new clsUpdateBookingDTO
                {
                    BookID = bookingId,
                    Status = "Cancelled"
                };
        }
        public async Task<clsUpdateBookingDTO>ConfirmedBookingAsync(int BookID)
        {
            var booking = await _bookingRepository.GetByIdAsync(BookID);
            if (booking != null)
            {
                booking.Status = "Confirmed";
                return await _bookingRepository.ConfirmBookingAsync(BookID);
            }
            else
                return null ?? new clsUpdateBookingDTO
                {
                    BookID = BookID,
                    Status = "Confirmed"
                };
        }
    }
}
