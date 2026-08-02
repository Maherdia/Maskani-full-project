using System;

namespace DataAccessLayer.DTOs
{
    public class clsBookingDTO
    {
        public int BookID { get; set; }
        public string DormID { get; set; } = string.Empty;
        public string StudentName { get; set; } = string.Empty;
        public string DormName { get; set; } = string.Empty;
        public int RoomID { get; set; }
        public decimal PriceMonthly { get; set; }
        public DateTime BookingDate { get; set; }
        public int Period { get; set; }
        public decimal TotalAmount { get; set; }

        public string Status { get; set; } = string.Empty;
        public int OwnerID { get; set; }
        public string OwnerName { get; set; } = string.Empty;
        public int StudentID { get; set; }

        // Academic Term
        public int? TermId { get; set; }
        public string? TermName { get; set; }
        public DateOnly? TermStartDate { get; set; }
        public DateOnly? TermEndDate { get; set; }

        public clsBookingDTO() { }

        public clsBookingDTO(
            int bookID,
            string dormID,
            string studentName,
            string dormName,
            int roomID,
            decimal priceMonthly,
            DateTime bookingDate,
            int period,
            decimal totalAmount,
            string status,
            int ownerID,
            string ownerName,
            int studentID)
        {
            BookID = bookID;
            DormID = dormID;
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
        }
    }

    public class clsAddBookingDTO
    {
        public int StudentID { get; set; }
        public int RoomID { get; set; }
        public string DormID { get; set; } = string.Empty;
        public decimal PriceMonthly { get; set; }
        public DateTime BookingDate { get; set; }
        public int Period { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty;

        // Academic Term
        public int? TermId { get; set; }

        public clsAddBookingDTO() { }

        public clsAddBookingDTO(
            int studentID,
            string dormID,
            int roomID,
            decimal priceMonthly,
            DateTime bookingDate,
            int period,
            decimal totalAmount,
            string status,
            int? termId = null)
        {
            StudentID = studentID;
            DormID = dormID;
            RoomID = roomID;
            PriceMonthly = priceMonthly;
            BookingDate = bookingDate;
            Period = period;
            TotalAmount = totalAmount;
            Status = status;
            TermId = termId;
        }
    }

    public class clsUpdateBookingDTO
    {
        public int BookID { get; set; }
        public string DormID { get; set; } = string.Empty;
        public int StudentID { get; set; }
        public int RoomID { get; set; }
        public DateTime BookingDate { get; set; }
        public int Period { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } = string.Empty;

        // Academic Term
        public int? TermId { get; set; }

        public clsUpdateBookingDTO() { }

        public clsUpdateBookingDTO(
            int bookID,
            string dormID,
            int roomID,
            DateTime bookingDate,
            int period,
            decimal totalAmount,
            string status,
            int studentID,
            int? termId = null)
        {
            BookID = bookID;
            DormID = dormID;
            RoomID = roomID;
            BookingDate = bookingDate;
            Period = period;
            TotalAmount = totalAmount;
            Status = status;
            StudentID = studentID;
            TermId = termId;
        }
    }
}