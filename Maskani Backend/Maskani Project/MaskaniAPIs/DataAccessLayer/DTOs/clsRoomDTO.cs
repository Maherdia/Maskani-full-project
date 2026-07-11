using System.Diagnostics;

public class clsRoomDTO
{
    public int RoomID { get; set; }
    public string DormID { get; set; } 
    public string DormName { get; set; }  
    public int RoomNumber { get; set; }
    public decimal Price { get; set; }
    public string Description { get; set; }
    public clsRoomDTO(int roomId, string dormId, int roomNumber, string dormName, decimal price, string description)
    {
        RoomID = roomId;
        DormID = dormId;
        RoomNumber = roomNumber;
        Price = price;
        Description = description;
        DormName = dormName;
    }
}

public class clsAddRoomDTO
{
    public string DormID { get; set; }
    public int RoomNumber { get; set; }
    public decimal Price { get; set; }
    public string Description { get; set; }
    public clsAddRoomDTO(string dormId, int roomNumber, decimal price, string description)
    {
        DormID = dormId;
        RoomNumber = roomNumber;
        Price = price;
        Description = description;
    }
}

public class clsUpdateRoomDTO
{
    public int RoomID { get; set; }
    public string DormID { get; set; }
    public int RoomNumber { get; set; }
    public decimal Price { get; set; }
    public string Description { get; set; }

    public clsUpdateRoomDTO(int roomId, string dormId, int roomNumber, decimal price, string description)
    {
        RoomID = roomId;
        DormID = dormId;
        RoomNumber = roomNumber;
        Price = price;
        Description = description;
    }
}
