using MaskaniBusinessLayer;
using MaskaniDataAccess.DTOs;
using MaskaniDataAccessLayer.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MaskaniAPI.Controllers
{
    [ApiController]
    [Route("api/Students")]
    [Authorize]
    public class StudentController : ControllerBase
    {
        private readonly StudentService _studentService;
        private readonly CurrentUserService _currentUserService;

        public StudentController(
            StudentService studentService,
            CurrentUserService currentUserService)
        {
            _studentService = studentService;
            _currentUserService = currentUserService;
        }

        // ========================================================
        // STUDENT PROFILE
        // A Student can retrieve only their own profile.
        // ========================================================

        [Authorize(Roles = "Student")]
        [HttpGet("me")]
        [ProducesResponseType(
            typeof(clsStudentDTO),
            StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<clsStudentDTO>> GetMe()
        {
            int personId = _currentUserService.PersonId;

            var student =
                await _studentService
                    .GetStudentByPersonIDAsync(personId);

            if (student == null)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Student account not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            RemovePassword(student);

            return Ok(student);
        }

        // ========================================================
        // UPDATE
        // Student: StudentID is overwritten from JWT identity.
        // Admin User: may update the requested StudentID.
        // ========================================================

        [Authorize(Roles = "Student,User")]
        [HttpPut("update")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(
    [FromBody] clsUpdateStudentDTO dto)
        {
            clsStudentDTO? targetStudent;

            if (_currentUserService.IsInRole("Student"))
            {
                int personId = _currentUserService.PersonId;

                targetStudent =
                    await _studentService
                        .GetStudentByPersonIDAsync(personId);

                if (targetStudent == null)
                {
                    return Unauthorized(new ProblemDetails
                    {
                        Title = "Student account not found.",
                        Status = StatusCodes.Status401Unauthorized
                    });
                }
            }
            else
            {
                if (dto.StudentID <= 0)
                {
                    return BadRequest(new ProblemDetails
                    {
                        Title = "A valid StudentID is required.",
                        Status = StatusCodes.Status400BadRequest
                    });
                }

                targetStudent =
                    await _studentService
                        .GetStudentByIdAsync(dto.StudentID);

                if (targetStudent == null)
                {
                    return NotFound(new ProblemDetails
                    {
                        Title = "Student not found.",
                        Status = StatusCodes.Status404NotFound
                    });
                }
            }

            // Bind the update to the actual database account.
            // Never trust PersonID or Role submitted by the client.
            dto.StudentID = targetStudent.StudentID;
            dto.PersonID = targetStudent.PersonID;
            dto.Role = "Student";

            bool success =
                await _studentService
                    .UpdateStudentAsync(dto);

            if (!success)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Student not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            return Ok();
        }

        // ========================================================
        // ADMIN MANAGEMENT
        // ========================================================

        [Authorize(Roles = "User")]
        [HttpDelete("{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            if (id <= 0)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Student not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            bool success =
                await _studentService
                    .DeleteStudentAsync(id);

            if (!success)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Student not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            return Ok();
        }

        [Authorize(Roles = "User")]
        [HttpGet("all")]
        [ProducesResponseType(
            typeof(IEnumerable<clsStudentDTO>),
            StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<clsStudentDTO>>>
            GetAll()
        {
            var students =
                await _studentService
                    .GetAllStudentsAsync();

            foreach (var student in students)
            {
                RemovePassword(student);
            }

            return Ok(students);
        }

        [Authorize(Roles = "User")]
        [HttpGet("{id:int}")]
        [ProducesResponseType(
            typeof(clsStudentDTO),
            StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<clsStudentDTO>>
            GetById(int id)
        {
            if (id <= 0)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Student not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            var student =
                await _studentService
                    .GetStudentByIdAsync(id);

            if (student == null)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Student not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            RemovePassword(student);

            return Ok(student);
        }

        [Authorize(Roles = "User")]
        [HttpGet("by-email")]
        [ProducesResponseType(
            typeof(clsStudentDTO),
            StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<clsStudentDTO>>
            GetByEmail([FromQuery] string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return BadRequest(new ProblemDetails
                {
                    Title = "Email is required.",
                    Status = StatusCodes.Status400BadRequest
                });
            }

            var student =
                await _studentService
                    .GetStudentByEmailAsync(email.Trim());

            if (student == null)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Student not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            RemovePassword(student);

            return Ok(student);
        }

        [Authorize(Roles = "User")]
        [HttpGet("person/{personId:int}")]
        [ProducesResponseType(
            typeof(clsStudentDTO),
            StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<clsStudentDTO>>
            GetByPersonId(int personId)
        {
            if (personId <= 0)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Student not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            var student =
                await _studentService
                    .GetStudentByPersonIDAsync(personId);

            if (student == null)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Student not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            RemovePassword(student);

            return Ok(student);
        }

        // ========================================================
        // PRIVATE HELPERS
        // ========================================================

        private static void RemovePassword(
            clsStudentDTO student)
        {
            student.Password = null;
        }
    }
}