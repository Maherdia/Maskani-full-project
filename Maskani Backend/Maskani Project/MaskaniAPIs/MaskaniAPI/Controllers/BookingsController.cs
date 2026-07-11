using Microsoft.AspNetCore.Mvc;
using DataAccessLayer.DTOs;
using MaskaniBusinessLayer;
using Repositry_DataAccess_.DTOs;

namespace MaskaniAPI.Controllers
{
    [ApiController]
    [Route("api/Booking")]
    public class BookingsController : ControllerBase
    {
        private readonly BookingService _bookingService;

        public BookingsController(BookingService bookingService)
        {
            _bookingService = bookingService;
        }

        [ProducesResponseType(typeof(IEnumerable<clsBookingDTO>), StatusCodes.Status200OK)]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<clsBookingDTO>>> GetAllBookings()
        {
            var bookings = await _bookingService.GetAllBookingsAsync();
            return Ok(bookings);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(clsBookingDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<clsBookingDTO>> GetBookingById(int id)
        {
            var booking = await _bookingService.GetBookingByIdAsync(id);
            return booking != null ? Ok(booking) : NotFound();
        }

        [HttpPost]
        [ProducesResponseType(typeof(int), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<ActionResult<int>> AddBooking([FromBody] clsAddBookingDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            try
            {
                var newId = await _bookingService.AddBookingAsync(dto);
                return CreatedAtAction(nameof(GetBookingById), new { id = newId }, newId);
            }
            catch (InvalidOperationException ex)
            {
                return Conflict(new { message = ex.Message });
            }
            catch (Exception)
            {
                return StatusCode(500, new { message = "Failed to add booking." });
            }
        }


        [HttpPut]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateBooking([FromBody] clsUpdateBookingDTO dto)
        {
            var success = await _bookingService.UpdateBookingAsync(dto);
            return success ? Ok() : NotFound();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            var success = await _bookingService.DeleteBookingAsync(id);
            return success ? Ok() : NotFound();
        }

        [HttpGet("owner/{ownerId}")]
        [ProducesResponseType(typeof(IEnumerable<clsBookingDTO>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<clsBookingDTO>>> GetBookingsByOwnerId(int ownerId)
        {
            var bookings = await _bookingService.GetBookingsByOwnerIdAsync(ownerId);
            return Ok(bookings);
        }

        [HttpGet("student/{studentId}")]
        [ProducesResponseType(typeof(IEnumerable<clsBookingDTO>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<clsBookingDTO>>> GetBookingsByStudentId(int studentId)
        {
            var bookings = await _bookingService.GetBookingsByStudentIdAsync(studentId);
            return Ok(bookings);
        }

        [HttpGet("status/{status}")]
        [ProducesResponseType(typeof(IEnumerable<clsBookingDTO>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<clsBookingDTO>>> GetBookingsByStatus(string status)
        {
            var bookings = await _bookingService.GetBookingsByStatusAsync(status);
            return Ok(bookings);
        }

        [HttpGet("exists")]
        [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
        public async Task<ActionResult<bool>> BookingExists([FromQuery] int studentId, [FromQuery] int roomId, [FromQuery] int bookID)
        {
            var exists = await _bookingService.BookingExistsAsync(studentId, roomId, roomId);
            return Ok(exists);
        }

        [HttpGet("count")]
        [ProducesResponseType(typeof(int), StatusCodes.Status200OK)]
        public async Task<ActionResult<int>> GetBookingCount()
        {
            var count = await _bookingService.GetBookingCountAsync();
            return Ok(count);
        }

        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [HttpGet("duplicate")]
        public async Task<ActionResult<bool>> IsDuplicateBookingAsync(int StudentID, int RoomID, int BookID)
        {
            if (StudentID <= 0 || RoomID <= 0 || BookID <= 0) { return BadRequest("Invalid parameters provided."); }

            var isDuplicate = await _bookingService.IsDuplicateBookingAsync(StudentID, RoomID, BookID);
            return Ok(isDuplicate);
        }

        [HttpPut("{id}/cancel")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> CancelBookingAsync(int id)
        {
            try
            {
                var result = await _bookingService.CancelBookingAsync(id);

                if (result == null)
                {
                    return BadRequest(new { message = "Booking not found or already cancelled." });
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to cancel booking" });
            }
        }

        [HttpPut("{id}/confirm")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ConfirmBookingAsync(int id)
        {
            try
            {
                var result = await _bookingService.ConfirmedBookingAsync(id);
                if (result == null)
                {
                    return BadRequest(new { message = "Booking not found or already confirmed." });
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to confirm booking" });
            }
        }

    }
}
