using Microsoft.AspNetCore.Mvc;
using DataAccessLayer.DTOs;
using MaskaniBusinessLayer;

namespace MaskaniAPI.Controllers
{
    [ApiController]
    [Route("api/Rooms")]
    public class RoomsController : ControllerBase
    {
        private readonly RoomService _roomService;

        public RoomsController(RoomService roomService)
        {
            _roomService = roomService;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<clsRoomDTO>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<clsRoomDTO>>> GetAllRooms()
        {
            var rooms = await _roomService.GetAllRoomsAsync();
            return Ok(rooms);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(clsRoomDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<clsRoomDTO>> GetRoomById(int id)
        {
            var room = await _roomService.GetRoomByIdAsync(id);
            return room != null ? Ok(room) : NotFound();
        }

        [HttpPost]
        [ProducesResponseType(typeof(int), StatusCodes.Status201Created)]
        public async Task<ActionResult<int>> AddRoom([FromBody] clsAddRoomDTO room)
        {
            var newRoomId = await _roomService.AddRoomAsync(room);
            return CreatedAtAction(nameof(GetRoomById), new { id = newRoomId }, newRoomId);
        }

        [HttpPut]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateRoom([FromBody] clsUpdateRoomDTO room)
        {
            var success = await _roomService.UpdateRoomAsync(room);
            return success ? Ok() : NotFound();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteRoom(int id)
        {
            var success = await _roomService.DeleteRoomAsync(id);
            return success ? Ok() : NotFound();
        }

        [HttpGet("dorm/{dormId}")]
        [ProducesResponseType(typeof(IEnumerable<clsRoomDTO>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<clsRoomDTO>>> GetRoomsByDormId(string dormId)
        {
            var rooms = await _roomService.GetRoomsByDormIdAsync(dormId);
            return Ok(rooms);
        }

        [HttpGet("price-range")]
        [ProducesResponseType(typeof(IEnumerable<clsRoomDTO>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<clsRoomDTO>>> GetRoomsByPriceRange([FromQuery] decimal min, [FromQuery] double max)
        {
            var rooms = await _roomService.GetRoomsByPriceRangeAsync(min, max);
            return Ok(rooms);
        }

        [HttpGet("exists/{roomId}")]
        [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
        public async Task<ActionResult<bool>> RoomExists(int roomId)
        {
            var exists = await _roomService.RoomExistsAsync(roomId);
            return Ok(exists);
        }
    }
}
