using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccessLayer.DTOs;
using MaskaniDataAccess.Interfaces;

namespace DataAccessLayer.Interfaces
{
    public interface IRoomRepository:IBasicRepository<clsRoomDTO,clsAddRoomDTO,clsUpdateRoomDTO>
    {
        Task<List<clsRoomDTO>> GetRoomsByDormIdAsync(string dormId);
        Task<List<clsRoomDTO>> GetRoomsByPriceRangeAsync(decimal minPrice,double maxPrice);
        Task<bool> RoomExistsAsync(int roomId);

    }
}
