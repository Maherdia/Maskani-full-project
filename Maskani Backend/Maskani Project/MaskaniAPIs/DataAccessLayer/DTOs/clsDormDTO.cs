namespace Repositry_DataAccess_.DTOs
{
    public class clsDormDTO
    {
        public string DormID { get; set; } = string.Empty;
        public int OwnerID { get; set; }
        public string DormName { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public bool FurnishedOrNot { get; set; }
        public double Distance { get; set; }
        public string UniversityName { get; set; } = string.Empty;
        public string OwnerName { get; set; } = string.Empty;
        public string Phone { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }
        public string DormStatus { get; set; } = "Approved";

        public clsDormDTO()
        {
        }

        public clsDormDTO(
            string dormID,
            string dormName,
            string address,
            bool furnishedOrNot,
            double distance,
            string universityName,
            string ownerName,
            string phone)
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

        public clsDormDTO(
            string dormID,
            string dormName,
            string address,
            bool furnishedOrNot,
            double distance,
            string universityName,
            string ownerName,
            string phone,
            string email)
        {
            DormID = dormID;
            DormName = dormName;
            Address = address;
            FurnishedOrNot = furnishedOrNot;
            Distance = distance;
            UniversityName = universityName;
            OwnerName = ownerName;
            Phone = phone;
            Email = email;
        }
    }

    public class clsAddDormDTO
    {
        public string DormID { get; set; } = string.Empty;
        public int OwnerID { get; set; }
        public int UniversityID { get; set; }
        public string DormName { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public bool FurnishedOrNot { get; set; }
        public double Distance { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }

        public clsAddDormDTO()
        {
        }

        public clsAddDormDTO(
            string dormID,
            string dormName,
            string address,
            bool furnishedOrNot,
            int universityID,
            double distance,
            int ownerID)
        {
            DormID = dormID;
            DormName = dormName;
            Address = address;
            FurnishedOrNot = furnishedOrNot;
            UniversityID = universityID;
            Distance = distance;
            OwnerID = ownerID;
        }
    }

    public class clsUpdateDormDTO
    {
        public string DormID { get; set; } = string.Empty;
        public string DormName { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public bool FurnishedOrNot { get; set; }
        public double Distance { get; set; }
        public int UniversityID { get; set; }
        public int OwnerID { get; set; }
        public double? Latitude { get; set; }
        public double? Longitude { get; set; }

        public clsUpdateDormDTO()
        {
        }

        public clsUpdateDormDTO(
            string dormID,
            string dormName,
            string address,
            bool furnishedOrNot,
            double distance,
            int universityID,
            int ownerID)
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

    public class clsDormStatusDTO
    {
        public string DormID { get; set; } = string.Empty;
        public string DormStatus { get; set; } = string.Empty;
    }
}