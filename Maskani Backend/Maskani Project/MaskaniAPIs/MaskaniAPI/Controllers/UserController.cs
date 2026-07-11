using Microsoft.AspNetCore.Mvc;
using MaskaniBusinessLayer;
using MaskaniDataAccess.DTOs;
using MaskaniDataAccessLayer.DTOs;

namespace MaskaniAPI.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UserController : ControllerBase
    {
        private readonly UserService _userService;

        public UserController(UserService userService)
        {
            _userService = userService;
        }

        [HttpPost]
        [ProducesResponseType(typeof(object), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Add([FromBody] clsAddUserDTO dto)
        {
            if (dto == null)
                return BadRequest(new { message = "Invalid user data." });

            try
            {
                var id = await _userService.AddUserAsync(dto);
                return CreatedAtAction(nameof(GetById), new { id }, new { userId = id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to add user.", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(int id, [FromBody] clsUpdateUserDTO dto)
        {
            dto.UserID = id;
            var success = await _userService.UpdateUserAsync(dto);
            return success ? Ok() : NotFound();
        }

        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _userService.DeleteUserAsync(id);
            return success ? Ok() : NotFound();
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<clsUserDTO>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<clsUserDTO>>> GetAll()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        [ProducesResponseType(typeof(clsUserDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<clsUserDTO>> GetById(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            return user is not null ? Ok(user) : NotFound();
        }


        [HttpPost("change-password")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ChangePassword([FromQuery] int userId, [FromBody] string newPassword)
        {
            if (string.IsNullOrWhiteSpace(newPassword))
                return BadRequest("Password cannot be empty.");

            var success = await _userService.ChangePasswordAsync(userId, newPassword);
            return success ? Ok() : BadRequest("Password change failed.");
        }

        [HttpPost("login")]
        [ProducesResponseType(typeof(clsUserDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Login([FromBody] clsUserDTO loginRequest)
        {
            var result = await _userService.LoginAsync(loginRequest.Email, loginRequest.Password);
            return result is not null ? Ok(result) : Unauthorized();
        }

        [HttpGet("Person/{PersonID}")]
        [ProducesResponseType(typeof(clsUserDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<clsUserDTO>> GetUserByPersonID(int PersonID)
        {
            var user = await _userService.GetUserByPersonID(PersonID);
            return user is not null ? Ok(user) : NotFound();
        }


        [HttpGet("email/{email}")]
        [ProducesResponseType(typeof(clsUserDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<clsUserDTO>> GetUserByEmail(string email)
        {
            var user = await _userService.GetUserByEmailAsync(email);
            return user is not null ? Ok(user) : NotFound();
        }
    }
}
