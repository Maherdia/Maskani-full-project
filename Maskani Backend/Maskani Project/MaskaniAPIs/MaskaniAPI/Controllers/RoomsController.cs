using DataAccessLayer.DTOs;
using MaskaniBusinessLayer;
using MaskaniDataAccess.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MaskaniAPI.Controllers
{
    [ApiController]
    [Route("api/Rooms")]
    public class RoomsController : ControllerBase
    {
        private readonly RoomService _roomService;
        private readonly DormService _dormService;
        private readonly OwnerService _ownerService;
        private readonly CurrentUserService _currentUserService;

        public RoomsController(
            RoomService roomService,
            DormService dormService,
            OwnerService ownerService,
            CurrentUserService currentUserService)
        {
            _roomService = roomService;
            _dormService = dormService;
            _ownerService = ownerService;
            _currentUserService = currentUserService;
        }

        // ========================================================
        // PUBLIC READ ENDPOINTS
        // ========================================================

        [HttpGet]
        [ProducesResponseType(
            typeof(IEnumerable<clsRoomDTO>),
            StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<clsRoomDTO>>>
            GetAllRooms()
        {
            var rooms =
                await _roomService.GetAllRoomsAsync();

            return Ok(rooms);
        }

        [HttpGet("{id:int}")]
        [ProducesResponseType(
            typeof(clsRoomDTO),
            StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<clsRoomDTO>>
            GetRoomById(int id)
        {
            if (id <= 0)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Room not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            var room =
                await _roomService.GetRoomByIdAsync(id);

            if (room == null)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Room not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            return Ok(room);
        }

        [HttpGet("dorm/{dormId}")]
        [ProducesResponseType(
            typeof(IEnumerable<clsRoomDTO>),
            StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<IEnumerable<clsRoomDTO>>>
            GetRoomsByDormId(string dormId)
        {
            if (string.IsNullOrWhiteSpace(dormId))
            {
                return BadRequest(new ProblemDetails
                {
                    Title = "Dorm ID is required.",
                    Status = StatusCodes.Status400BadRequest
                });
            }

            var rooms =
                await _roomService.GetRoomsByDormIdAsync(
                    dormId.Trim());

            return Ok(rooms);
        }

        [HttpGet("price-range")]
        [ProducesResponseType(
            typeof(IEnumerable<clsRoomDTO>),
            StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<IEnumerable<clsRoomDTO>>>
            GetRoomsByPriceRange(
                [FromQuery] decimal min,
                [FromQuery] double max)
        {
            if (min < 0 ||
                max < 0 ||
                Convert.ToDouble(min) > max)
            {
                return BadRequest(new ProblemDetails
                {
                    Title = "Invalid price range.",
                    Detail =
                        "Minimum and maximum prices must be non-negative, and minimum cannot exceed maximum.",
                    Status = StatusCodes.Status400BadRequest
                });
            }

            var rooms =
                await _roomService.GetRoomsByPriceRangeAsync(
                    min,
                    max);

            return Ok(rooms);
        }

        [HttpGet("exists/{roomId:int}")]
        [ProducesResponseType(
            typeof(bool),
            StatusCodes.Status200OK)]
        public async Task<ActionResult<bool>> RoomExists(
            int roomId)
        {
            if (roomId <= 0)
            {
                return Ok(false);
            }

            bool exists =
                await _roomService.RoomExistsAsync(roomId);

            return Ok(exists);
        }

        // ========================================================
        // CREATE ROOM
        // Owner may create rooms only inside their own dorm.
        // Admin User may create rooms inside any existing dorm.
        // ========================================================

        [HttpPost]
        [Authorize(Roles = "Owner,User")]
        [ProducesResponseType(
            typeof(int),
            StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<int>> AddRoom(
            [FromBody] clsAddRoomDTO room)
        {
            if (string.IsNullOrWhiteSpace(room.DormID))
            {
                return BadRequest(new ProblemDetails
                {
                    Title = "Dorm ID is required.",
                    Status = StatusCodes.Status400BadRequest
                });
            }

            if (room.RoomNumber <= 0)
            {
                return BadRequest(new ProblemDetails
                {
                    Title = "Invalid room number.",
                    Status = StatusCodes.Status400BadRequest
                });
            }

            if (room.Price < 0)
            {
                return BadRequest(new ProblemDetails
                {
                    Title = "Invalid room price.",
                    Status = StatusCodes.Status400BadRequest
                });
            }

            room.DormID = room.DormID.Trim();

            var dorm =
                await _dormService.GetDormByIdAsync(
                    room.DormID);

            if (dorm == null)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Dorm not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            if (_currentUserService.IsInRole("Owner"))
            {
                var owner =
                    await GetAuthenticatedOwnerAsync();

                if (owner == null)
                {
                    return Unauthorized(new ProblemDetails
                    {
                        Title = "Owner account not found.",
                        Status =
                            StatusCodes.Status401Unauthorized
                    });
                }

                if (dorm.OwnerID != owner.OwnerID)
                {
                    return NotFound(new ProblemDetails
                    {
                        Title =
                            "Dorm not found or does not belong to you.",
                        Status = StatusCodes.Status404NotFound
                    });
                }
            }

            int newRoomId =
                await _roomService.AddRoomAsync(room);

            return CreatedAtAction(
                nameof(GetRoomById),
                new { id = newRoomId },
                newRoomId);
        }

        // ========================================================
        // UPDATE ROOM
        // Owner must own both:
        // 1. The room's current dorm.
        // 2. The requested destination dorm.
        // This prevents moving another owner's room.
        // ========================================================

        [HttpPut]
        [Authorize(Roles = "Owner,User")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateRoom(
            [FromBody] clsUpdateRoomDTO room)
        {
            if (room.RoomID <= 0)
            {
                return BadRequest(new ProblemDetails
                {
                    Title = "Invalid room ID.",
                    Status = StatusCodes.Status400BadRequest
                });
            }

            if (string.IsNullOrWhiteSpace(room.DormID))
            {
                return BadRequest(new ProblemDetails
                {
                    Title = "Dorm ID is required.",
                    Status = StatusCodes.Status400BadRequest
                });
            }

            if (room.RoomNumber <= 0)
            {
                return BadRequest(new ProblemDetails
                {
                    Title = "Invalid room number.",
                    Status = StatusCodes.Status400BadRequest
                });
            }

            if (room.Price < 0)
            {
                return BadRequest(new ProblemDetails
                {
                    Title = "Invalid room price.",
                    Status = StatusCodes.Status400BadRequest
                });
            }

            var existingRoom =
                await _roomService.GetRoomByIdAsync(
                    room.RoomID);

            if (existingRoom == null)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Room not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            room.DormID = room.DormID.Trim();

            var existingDorm =
                await _dormService.GetDormByIdAsync(
                    existingRoom.DormID);

            var targetDorm =
                await _dormService.GetDormByIdAsync(
                    room.DormID);

            if (targetDorm == null)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Target dorm not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            if (_currentUserService.IsInRole("Owner"))
            {
                var owner =
                    await GetAuthenticatedOwnerAsync();

                if (owner == null)
                {
                    return Unauthorized(new ProblemDetails
                    {
                        Title = "Owner account not found.",
                        Status =
                            StatusCodes.Status401Unauthorized
                    });
                }

                if (existingDorm == null ||
                    existingDorm.OwnerID != owner.OwnerID)
                {
                    return NotFound(new ProblemDetails
                    {
                        Title =
                            "Room not found or does not belong to you.",
                        Status = StatusCodes.Status404NotFound
                    });
                }

                if (targetDorm.OwnerID != owner.OwnerID)
                {
                    return NotFound(new ProblemDetails
                    {
                        Title =
                            "Target dorm not found or does not belong to you.",
                        Status = StatusCodes.Status404NotFound
                    });
                }
            }

            bool success =
                await _roomService.UpdateRoomAsync(room);

            if (!success)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Room not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            return Ok();
        }

        // ========================================================
        // DELETE ROOM
        // Owner must own the dorm containing the room.
        // Admin User may delete any room.
        // ========================================================

        [HttpDelete("{id:int}")]
        [Authorize(Roles = "Owner,User")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteRoom(int id)
        {
            if (id <= 0)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Room not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            var room =
                await _roomService.GetRoomByIdAsync(id);

            if (room == null)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Room not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            var dorm =
                await _dormService.GetDormByIdAsync(
                    room.DormID);

            if (dorm == null)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Dorm containing the room was not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            if (_currentUserService.IsInRole("Owner"))
            {
                var owner =
                    await GetAuthenticatedOwnerAsync();

                if (owner == null)
                {
                    return Unauthorized(new ProblemDetails
                    {
                        Title = "Owner account not found.",
                        Status =
                            StatusCodes.Status401Unauthorized
                    });
                }

                if (dorm.OwnerID != owner.OwnerID)
                {
                    return NotFound(new ProblemDetails
                    {
                        Title =
                            "Room not found or does not belong to your dorm.",
                        Status = StatusCodes.Status404NotFound
                    });
                }
            }

            bool success =
                await _roomService.DeleteRoomAsync(id);

            if (!success)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Room not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            return Ok();
        }

        // ========================================================
        // PRIVATE HELPERS
        // ========================================================

        private async Task<clsOwnerDTO?>
            GetAuthenticatedOwnerAsync()
        {
            int personId =
                _currentUserService.PersonId;

            return await _ownerService
                .GetOwnerByPersonID(personId);
        }
    }
}