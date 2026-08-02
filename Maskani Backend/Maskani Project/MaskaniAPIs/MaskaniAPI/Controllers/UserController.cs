using MaskaniBusinessLayer;
using MaskaniDataAccess.DTOs;
using MaskaniDataAccessLayer.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MaskaniAPI.Controllers
{
    [ApiController]
    [Route("api/users")]
    [Authorize(Roles = "User")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;
        private readonly CurrentUserService
            _currentUserService;

        public UserController(
            UserService userService,
            CurrentUserService currentUserService)
        {
            _userService = userService;
            _currentUserService = currentUserService;
        }

        // ========================================================
        // CURRENT ADMIN PROFILE
        // ========================================================

        [HttpGet("me")]
        [ProducesResponseType(
            typeof(clsUserDTO),
            StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<clsUserDTO>> GetMe()
        {
            int personId =
                _currentUserService.PersonId;

            var user =
                await _userService
                    .GetUserByPersonID(personId);

            if (user == null)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "User account not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            RemovePassword(user);

            return Ok(user);
        }

        // ========================================================
        // ADMIN MANAGEMENT
        // ========================================================

        [HttpPut("{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(
            int id,
            [FromBody] clsUpdateUserDTO dto)
        {
            if (id <= 0)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "User not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            var targetUser =
                await _userService.GetUserByIdAsync(id);

            if (targetUser == null)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "User not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            // Bind the update to the database record selected
            // by the route. Ignore identity values from the body.
            dto.UserID = targetUser.UserID;
            dto.PersonID = targetUser.PersonID;
            dto.Role = "User";

            bool success =
                await _userService.UpdateUserAsync(dto);

            if (!success)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "User not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            return Ok();
        }

        [HttpDelete("{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            if (id <= 0)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "User not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            bool success =
                await _userService.DeleteUserAsync(id);

            if (!success)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "User not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            return Ok();
        }

        [HttpGet]
        [ProducesResponseType(
            typeof(IEnumerable<clsUserDTO>),
            StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<clsUserDTO>>>
            GetAll()
        {
            var users =
                await _userService.GetAllUsersAsync();

            foreach (var user in users)
            {
                RemovePassword(user);
            }

            return Ok(users);
        }

        [HttpGet("{id:int}")]
        [ProducesResponseType(
            typeof(clsUserDTO),
            StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<clsUserDTO>>
            GetById(int id)
        {
            if (id <= 0)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "User not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            var user =
                await _userService.GetUserByIdAsync(id);

            if (user == null)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "User not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            RemovePassword(user);

            return Ok(user);
        }

        [HttpGet("person/{personId:int}")]
        [ProducesResponseType(
            typeof(clsUserDTO),
            StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<clsUserDTO>>
            GetUserByPersonID(int personId)
        {
            if (personId <= 0)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "User not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            var user =
                await _userService
                    .GetUserByPersonID(personId);

            if (user == null)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "User not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            RemovePassword(user);

            return Ok(user);
        }

        [HttpGet("by-email")]
        [ProducesResponseType(
            typeof(clsUserDTO),
            StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<clsUserDTO>>
            GetUserByEmail([FromQuery] string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return BadRequest(new ProblemDetails
                {
                    Title = "Email is required.",
                    Status = StatusCodes.Status400BadRequest
                });
            }

            var user =
                await _userService
                    .GetUserByEmailAsync(email.Trim());

            if (user == null)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "User not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            RemovePassword(user);

            return Ok(user);
        }

        private static void RemovePassword(
            clsUserDTO user)
        {
            user.Password = null;
        }
    }
}