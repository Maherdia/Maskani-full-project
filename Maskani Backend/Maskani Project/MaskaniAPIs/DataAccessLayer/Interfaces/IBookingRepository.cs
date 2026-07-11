using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccessLayer.DTOs;
using MaskaniDataAccess.Interfaces;

namespace DataAccessLayer.Interfaces
{
    public interface IBookingRepository:IBasicRepository<clsBookingDTO,clsAddBookingDTO,clsUpdateBookingDTO>
    {
        Task<List<clsBookingDTO>> GetBookingsByOwnerIdAsync(int ownerId);
        Task<List<clsBookingDTO>> GetBookingsByStudentIdAsync(int studentId);
        Task<bool> BookingExistsAsync(int studentId, int roomId,int bookID);
        Task<List<clsBookingDTO>> GetBookingsByStatusAsync(string status);
        Task<int> GetBookingCountAsync();
        public Task<bool> CheckDuplicateBooking(int StudentID, int RoomID, int? BookID = null);
        public Task<clsUpdateBookingDTO> CancelBookingAsync(int BookID);
        public Task<clsUpdateBookingDTO> ConfirmBookingAsync(int BookID);

    }
}
