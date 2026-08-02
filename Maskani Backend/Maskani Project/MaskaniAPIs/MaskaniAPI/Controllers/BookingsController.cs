using DataAccessLayer.DTOs;
using MaskaniBusinessLayer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MaskaniAPI.Controllers
{
    [ApiController]
    [Route("api/Booking")]
    [Authorize]
    public class BookingsController : ControllerBase
    {
        private readonly BookingService _bookingService;
        private readonly StudentService _studentService;
        private readonly OwnerService _ownerService;
        private readonly CurrentUserService _currentUserService;

        public BookingsController(
            BookingService bookingService,
            StudentService studentService,
            OwnerService ownerService,
            CurrentUserService currentUserService)
        {
            _bookingService = bookingService;
            _studentService = studentService;
            _ownerService = ownerService;
            _currentUserService = currentUserService;
        }

        // ========================================================
        // ADMIN ONLY
        // ========================================================

        [Authorize(Roles = "User")]
        [HttpGet]
        [ProducesResponseType(
            typeof(IEnumerable<clsBookingDTO>),
            StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<clsBookingDTO>>>
            GetAllBookings()
        {
            var bookings =
                await _bookingService.GetAllBookingsAsync();

            return Ok(bookings);
        }

        [Authorize(Roles = "User")]
        [HttpGet("{id:int}")]
        [ProducesResponseType(
            typeof(clsBookingDTO),
            StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<clsBookingDTO>>
            GetBookingById(int id)
        {
            var booking =
                await _bookingService.GetBookingByIdAsync(id);

            if (booking == null)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Booking not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            return Ok(booking);
        }

        // ========================================================
        // STUDENT CREATES A BOOKING
        // StudentID always comes from the authenticated JWT account.
        // ========================================================

        [Authorize(Roles = "Student")]
        [HttpPost]
        [ProducesResponseType(
            typeof(int),
            StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<ActionResult<int>> AddBooking(
            [FromBody] clsAddBookingDTO dto)
        {
            int personId = _currentUserService.PersonId;

            var student =
                await _studentService.GetStudentByPersonIDAsync(
                    personId);

            if (student == null)
            {
                return Unauthorized(new ProblemDetails
                {
                    Title = "Student account not found.",
                    Status = StatusCodes.Status401Unauthorized
                });
            }

            // Never trust StudentID submitted by the client.
            dto.StudentID = student.StudentID;

            int newId =
                await _bookingService.AddBookingAsync(dto);

            return CreatedAtAction(
                nameof(GetBookingById),
                new { id = newId },
                newId);
        }

        // ========================================================
        // ADMIN UPDATES A BOOKING
        // ========================================================

        [Authorize(Roles = "User")]
        [HttpPut]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<IActionResult> UpdateBooking(
            [FromBody] clsUpdateBookingDTO dto)
        {
            bool success =
                await _bookingService.UpdateBookingAsync(dto);

            if (!success)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Booking not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            return Ok();
        }

        // ========================================================
        // STUDENT DELETES OWN BOOKING / ADMIN DELETES ANY BOOKING
        // ========================================================

        [Authorize(Roles = "Student,User")]
        [HttpDelete("{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteBooking(int id)
        {
            if (_currentUserService.IsInRole("User"))
            {
                bool adminDeleted =
                    await _bookingService
                        .DeleteBookingAsAdminAsync(id);

                if (!adminDeleted)
                {
                    return NotFound(new ProblemDetails
                    {
                        Title = "Booking not found.",
                        Status = StatusCodes.Status404NotFound
                    });
                }

                return Ok();
            }

            int personId = _currentUserService.PersonId;

            var student =
                await _studentService.GetStudentByPersonIDAsync(
                    personId);

            if (student == null)
            {
                return Unauthorized(new ProblemDetails
                {
                    Title = "Student account not found.",
                    Status = StatusCodes.Status401Unauthorized
                });
            }

            bool deleted =
                await _bookingService.DeleteBookingAsync(
                    id,
                    student.StudentID);

            if (!deleted)
            {
                return NotFound(new ProblemDetails
                {
                    Title =
                        "Booking not found or does not belong to you.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            return Ok();
        }

        // ========================================================
        // OWNER BOOKINGS
        // Admin may request any OwnerID.
        // OwnerID from an Owner request is ignored; JWT decides identity.
        // ========================================================

        [Authorize(Roles = "Owner,User")]
        [HttpGet("owner/{ownerId:int}")]
        [ProducesResponseType(
            typeof(IEnumerable<clsBookingDTO>),
            StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<IEnumerable<clsBookingDTO>>>
            GetBookingsByOwnerId(int ownerId)
        {
            if (_currentUserService.IsInRole("User"))
            {
                var adminBookings =
                    await _bookingService
                        .GetBookingsByOwnerIdAsync(ownerId);

                return Ok(adminBookings);
            }

            int personId = _currentUserService.PersonId;

            var owner =
                await _ownerService.GetOwnerByPersonID(
                    personId);

            if (owner == null)
            {
                return Unauthorized(new ProblemDetails
                {
                    Title = "Owner account not found.",
                    Status = StatusCodes.Status401Unauthorized
                });
            }

            // Ignore the route OwnerID for authenticated owners.
            // An owner can only retrieve their own bookings.
            var ownerBookings =
                await _bookingService
                    .GetBookingsByOwnerIdAsync(owner.OwnerID);

            return Ok(ownerBookings);
        }

        // ========================================================
        // STUDENT GETS OWN BOOKINGS
        // ========================================================

        [Authorize(Roles = "Student")]
        [HttpGet("student")]
        [ProducesResponseType(
            typeof(IEnumerable<clsBookingDTO>),
            StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<ActionResult<IEnumerable<clsBookingDTO>>>
            GetMyBookings()
        {
            int personId = _currentUserService.PersonId;

            var student =
                await _studentService.GetStudentByPersonIDAsync(
                    personId);

            if (student == null)
            {
                return Unauthorized(new ProblemDetails
                {
                    Title = "Student account not found.",
                    Status = StatusCodes.Status401Unauthorized
                });
            }

            var bookings =
                await _bookingService
                    .GetBookingsByStudentIdAsync(
                        student.StudentID);

            return Ok(bookings);
        }

        // ========================================================
        // ADMIN QUERY ENDPOINTS
        // ========================================================

        [Authorize(Roles = "User")]
        [HttpGet("status/{status}")]
        [ProducesResponseType(
            typeof(IEnumerable<clsBookingDTO>),
            StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<clsBookingDTO>>>
            GetBookingsByStatus(string status)
        {
            var bookings =
                await _bookingService
                    .GetBookingsByStatusAsync(status);

            return Ok(bookings);
        }

        [Authorize(Roles = "User")]
        [HttpGet("exists")]
        [ProducesResponseType(
            typeof(bool),
            StatusCodes.Status200OK)]
        public async Task<ActionResult<bool>> BookingExists(
            [FromQuery] int studentId,
            [FromQuery] int roomId,
            [FromQuery] int bookID)
        {
            bool exists =
                await _bookingService.BookingExistsAsync(
                    studentId,
                    roomId,
                    bookID);

            return Ok(exists);
        }

        [Authorize(Roles = "User")]
        [HttpGet("count")]
        [ProducesResponseType(
            typeof(int),
            StatusCodes.Status200OK)]
        public async Task<ActionResult<int>> GetBookingCount()
        {
            int count =
                await _bookingService.GetBookingCountAsync();

            return Ok(count);
        }

        [Authorize(Roles = "User")]
        [HttpGet("duplicate")]
        [ProducesResponseType(
            typeof(bool),
            StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<ActionResult<bool>>
            IsDuplicateBookingAsync(
                int StudentID,
                int RoomID,
                int BookID)
        {
            if (StudentID <= 0 ||
                RoomID <= 0 ||
                BookID <= 0)
            {
                return BadRequest(new ProblemDetails
                {
                    Title = "Invalid parameters provided.",
                    Status = StatusCodes.Status400BadRequest
                });
            }

            bool isDuplicate =
                await _bookingService
                    .IsDuplicateBookingAsync(
                        StudentID,
                        RoomID,
                        BookID);

            return Ok(isDuplicate);
        }

        // ========================================================
        // CANCEL BOOKING
        // Admin: any booking
        // Owner: only booking belonging to owner's dorm
        // Student: only student's own booking
        // ========================================================

        [Authorize(Roles = "Student,Owner,User")]
        [HttpPut("{id:int}/cancel")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<IActionResult> CancelBookingAsync(
            int id)
        {
            if (_currentUserService.IsInRole("User"))
            {
                var adminResult =
                    await _bookingService
                        .CancelBookingAsAdminAsync(id);

                if (adminResult == null)
                {
                    return NotFound(new ProblemDetails
                    {
                        Title = "Booking not found.",
                        Status = StatusCodes.Status404NotFound
                    });
                }

                return Ok(adminResult);
            }

            int personId = _currentUserService.PersonId;

            clsUpdateBookingDTO? result;

            if (_currentUserService.IsInRole("Owner"))
            {
                var owner =
                    await _ownerService.GetOwnerByPersonID(
                        personId);

                if (owner == null)
                {
                    return Unauthorized(new ProblemDetails
                    {
                        Title = "Owner account not found.",
                        Status =
                            StatusCodes.Status401Unauthorized
                    });
                }

                result =
                    await _bookingService
                        .CancelBookingByOwnerAsync(
                            id,
                            owner.OwnerID);
            }
            else
            {
                var student =
                    await _studentService
                        .GetStudentByPersonIDAsync(
                            personId);

                if (student == null)
                {
                    return Unauthorized(new ProblemDetails
                    {
                        Title = "Student account not found.",
                        Status =
                            StatusCodes.Status401Unauthorized
                    });
                }

                result =
                    await _bookingService.CancelBookingAsync(
                        id,
                        student.StudentID);
            }

            if (result == null)
            {
                return NotFound(new ProblemDetails
                {
                    Title =
                        "Booking not found or you do not own it.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            return Ok(result);
        }

        // ========================================================
        // CONFIRM BOOKING
        // Admin: any booking
        // Owner: only booking belonging to owner's dorm
        // ========================================================

        [Authorize(Roles = "Owner,User")]
        [HttpPut("{id:int}/confirm")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<IActionResult> ConfirmBookingAsync(
            int id)
        {
            if (_currentUserService.IsInRole("User"))
            {
                var adminResult =
                    await _bookingService
                        .ConfirmBookingAsAdminAsync(id);

                if (adminResult == null)
                {
                    return NotFound(new ProblemDetails
                    {
                        Title = "Booking not found.",
                        Status = StatusCodes.Status404NotFound
                    });
                }

                return Ok(adminResult);
            }

            int personId = _currentUserService.PersonId;

            var owner =
                await _ownerService.GetOwnerByPersonID(
                    personId);

            if (owner == null)
            {
                return Unauthorized(new ProblemDetails
                {
                    Title = "Owner account not found.",
                    Status = StatusCodes.Status401Unauthorized
                });
            }

            var result =
                await _bookingService.ConfirmedBookingAsync(
                    id,
                    owner.OwnerID);

            if (result == null)
            {
                return NotFound(new ProblemDetails
                {
                    Title =
                        "Booking not found or it does not belong to your dorm.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            return Ok(result);
        }
    }
}