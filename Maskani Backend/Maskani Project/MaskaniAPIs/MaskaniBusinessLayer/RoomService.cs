using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using DataAccessLayer.DTOs;
using DataAccessLayer.Interfaces;

namespace MaskaniBusinessLayer
{
    public class RoomService
    {
        private readonly IRoomRepository _roomRepository;
        public RoomService(IRoomRepository roomRepository)
        {
            _roomRepository = roomRepository;
        }
        public Task<int> AddRoomAsync(clsAddRoomDTO addRoomDTO) => _roomRepository.AddAsync(addRoomDTO);
        public Task<bool> DeleteRoomAsync(int id) => _roomRepository.DeleteAsync(id);
        public Task<List<clsRoomDTO>> GetAllRoomsAsync() => _roomRepository.GetAllAsync();
        public Task<clsRoomDTO?> GetRoomByIdAsync(int id) => _roomRepository.GetByIdAsync(id);
        public Task<bool> UpdateRoomAsync(clsUpdateRoomDTO updateRoomDTO) => _roomRepository.UpdateAsync(updateRoomDTO);
        public Task<List<clsRoomDTO>> GetRoomsByDormIdAsync(string dormId) => _roomRepository.GetRoomsByDormIdAsync(dormId);
        public Task<List<clsRoomDTO>> GetRoomsByPriceRangeAsync(decimal minPrice, double maxPrice) => _roomRepository.GetRoomsByPriceRangeAsync(minPrice, maxPrice);
        public Task<bool> RoomExistsAsync(int roomId) => _roomRepository.RoomExistsAsync(roomId);

    }
}
