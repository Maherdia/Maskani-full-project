using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Repositry_DataAccess_.DTOs
{
    public class clsDormDTO
    {
        public string DormID { set; get; }
        public string DormName { set; get; }
        public string Address { set; get; }
        public bool FurnishedOrNot { set; get; }
        public double Distance { set; get; }
        public string UniversityName { set; get; }
        public string OwnerName { set; get; }
        public string Phone { set; get; }
        public string Email { set; get; }
        public clsDormDTO(string dormID, string dormName, string address, bool furnishedOrNot, double distance, string universityName, string ownerName, string phone)
        {
            DormID = dormID;
            DormName = dormName;
            Address = address;
            FurnishedOrNot = furnishedOrNot;
            Distance = distance;
            UniversityName = universityName;
            OwnerName = ownerName;
            Phone = phone;
        }

        public clsDormDTO(string dormID, string dormName, string address, bool furnishedOrNot, double distance, string universityName, string ownerName, string phone,string Email)
        {
            DormID = dormID;
            DormName = dormName;
            Address = address;
            FurnishedOrNot = furnishedOrNot;
            Distance = distance;
            UniversityName = universityName;
            OwnerName = ownerName;
            Phone = phone;
            this.Email = Email;
        }
        public clsDormDTO()
        {

        }
    }
    public class clsAddDormDTO
    {
        public string DormID { set; get; }
        public int OwnerID { set; get; }
        public int UniversityID { set; get; }
        public string DormName { set; get; }
        public string Address { set; get; }
        public bool FurnishedOrNot { set; get; }
        public double Distance { set; get; }
        public clsAddDormDTO(string DormID, string DormName, string Address, bool FurnishedOrNot, int UniversityID, double Distance, int OwnerID)
        {
            this.DormID = DormID;
            this.DormName = DormName;
            this.Address = Address;
            this.FurnishedOrNot = FurnishedOrNot;
            this.UniversityID = UniversityID;
            this.Distance = Distance;
            this.OwnerID = OwnerID;
        }
    }
    public class clsUpdateDormDTO
    {
        public string DormID { get; set; }
        public string DormName { get; set; }
        public string Address { get; set; }
        public bool FurnishedOrNot { get; set; }
        public double Distance { get; set; }
        public int UniversityID { get; set; }
        public int OwnerID { get; set; }

        public clsUpdateDormDTO(string dormID, string dormName, string address, bool furnishedOrNot, double distance, int universityID, int ownerID)
        {
            DormID = dormID;
            DormName = dormName;
            Address = address;
            FurnishedOrNot = furnishedOrNot;
            Distance = distance;
            UniversityID = universityID;
            OwnerID = ownerID;
        }
    }

}
