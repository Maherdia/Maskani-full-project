using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DataAccessLayer.DTOs
{
    public class clsBookingDTO
    {
        public int BookID { get; set; }
        public string DormID { get; set; }
        public string StudentName { get; set; }
        public string DormName { get; set; }
        public int RoomID { get; set; }
        public decimal PriceMonthly { get; set; }
        public DateTime BookingDate { get; set; }
        public int Period { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; }
        public int OwnerID { get; set; }
        public string OwnerName { get; set; }
        public int StudentID { get; set; } 
        public clsBookingDTO(int bookID,string dormID, string studentName, string dormName, int roomID, decimal priceMonthly, DateTime bookingDate, int period, decimal totalAmount, string status, int ownerID, string ownerName, int studentID)
        {
            BookID = bookID;
            StudentName = studentName;
            DormName = dormName;
            RoomID = roomID;
            PriceMonthly = priceMonthly;
            BookingDate = bookingDate;
            Period = period;
            TotalAmount = totalAmount;
            Status = status;
            OwnerID = ownerID;
            OwnerName = ownerName;
            StudentID = studentID;
            DormID = dormID;
        }
        public clsBookingDTO()
        {
            // Default constructor
        }
    }

    public class clsAddBookingDTO
    {
        public int StudentID { get; set; }
        public int RoomID { get; set; }
        public string DormID { get; set; }
        public decimal PriceMonthly { get; set; }
        public DateTime BookingDate { get; set; }
        public int Period { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; }
        public clsAddBookingDTO(int studentID,string dormID, int roomID, decimal priceMonthly, DateTime bookingDate, int period, decimal totalAmount, string status)
        {
            StudentID = studentID;
            RoomID = roomID;
            PriceMonthly = priceMonthly;
            BookingDate = bookingDate;
            Period = period;
            TotalAmount = totalAmount;
            Status = status;
            DormID = dormID;
        }
        public clsAddBookingDTO()
        {
            // Default constructor
        }
    }

    public class clsUpdateBookingDTO
    {
        public int BookID { get; set; }
        public string DormID { get; set; }
        public int StudentID { get; set; }
        public int RoomID { get; set; }
        public DateTime BookingDate { get; set; }
        public int Period { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; }
        public clsUpdateBookingDTO(int bookID,string dormID, int roomID, DateTime bookingDate, int period, decimal totalAmount, string status, int studentID)
        {
            BookID = bookID;
            RoomID = roomID;
            BookingDate = bookingDate;
            Period = period;
            TotalAmount = totalAmount;
            Status = status;
            StudentID = studentID;
            DormID = dormID;
        }
        public clsUpdateBookingDTO()
        {
            // Default constructor
        }
    }

}
