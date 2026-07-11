namespace MaskaniDataAccess.DTOs
{
    public class clsUniversityDTO
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Address { set; get; } 

        public clsUniversityDTO(int id, string name, string address)
        {
            ID = id;
            Name = name;
            Address = address;
        }
        public clsUniversityDTO()   // Default constructor for serialization/deserialization  
        {
            this.ID = -1;
            this.Name = string.Empty;
            this.Address = string.Empty;
        } 
    }

    public class clsAddUniversityDTO
    {
        public string Name { get; set; }
        public string Address { get; set; }
        public clsAddUniversityDTO(string name, string address)
        {
            Name = name;
            Address = address;
        }
        public clsAddUniversityDTO()    // Default constructor for serialization/deserialization
        {
            this.Name = string.Empty;
            this.Address = string.Empty;
        }
    }

    public class clsUpdateUniversityDTO
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public clsUpdateUniversityDTO(int id, string name, string address)
        {
            ID = id;
            Name = name;
            Address = address;
        }
        public clsUpdateUniversityDTO()     // Default constructor for serialization/deserialization
        {
            this.ID = -1;
            this.Name = string.Empty;
            this.Address = string.Empty;

        }
    }
}
