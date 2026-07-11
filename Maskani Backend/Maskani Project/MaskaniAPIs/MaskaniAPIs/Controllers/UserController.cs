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
        public async Task<IActionResult> Add([FromBody] clsAddUserDTO dto)
        {
            if (dto == null)
                return BadRequest(new { message = "Invalid user data." });

            try
            {
                var id = await _userService.AddUserAsync(dto);
                return Ok(new { userId = id });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Failed to add user.", error = ex.Message });
            }
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] clsUpdateUserDTO dto)
        {
            dto.UserID = id;
            var success = await _userService.UpdateUserAsync(dto);
            return success ? Ok() : NotFound();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _userService.DeleteUserAsync(id);
            return success ? Ok() : NotFound();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<clsUserDTO>>> GetAll()
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<clsUserDTO>> GetById(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);
            return user is not null ? Ok(user) : NotFound();
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword(int userId, [FromBody] string newPassword)
        {
            var success = await _userService.ChangePasswordAsync(userId, newPassword);
            return success ? Ok() : BadRequest();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] clsLoginRequestDTO loginRequest)
        {
            var result = await _userService.LoginAsync(loginRequest.Email, loginRequest.Password);
            return result is not null ? Ok(result) : Unauthorized();
        }
    }
}
