using Microsoft.AspNetCore.Mvc;
using MaskaniBusinessLayer;
using MaskaniDataAccess.DTOs;
using MaskaniDataAccessLayer.DTOs;

namespace MaskaniAPI.Controllers
{
    [ApiController]
    [Route("api/owners")]
    public class OwnerController : ControllerBase
    {
        private readonly OwnerService _ownerService;

        public OwnerController(OwnerService ownerService)
        {
            _ownerService = ownerService;
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] clsAddOwnerDTO dto)
        {
            var id = await _ownerService.AddOwnerAsync(dto);
            return Ok(id);
        }

        [HttpPut("Update {id}")]
        public async Task<IActionResult> Update(int id, [FromBody] clsUpdateOwnerDTO dto)
        {
            dto.OwnerID = id;
            var success = await _ownerService.UpdateOwnerAsync(dto);
            return success ? Ok() : NotFound();
        }

        [HttpDelete("Delete {id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _ownerService.DeleteOwnerAsync(id);
            return success ? Ok() : NotFound();
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<clsOwnerDTO>>> GetAll()
        {
            var owners = await _ownerService.GetAllOwnersAsync();
            return Ok(owners);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<clsOwnerDTO>> GetById(int id)
        {
            var owner = await _ownerService.GetOwnerByIdAsync(id);
            return owner is not null ? Ok(owner) : NotFound();
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword(int ownerId, [FromBody] string newPassword)
        {
            var success = await _ownerService.ChangePasswordAsync(ownerId, newPassword);
            return success ? Ok() : BadRequest();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] clsLoginRequestDTO loginRequest)
        {
            var result = await _ownerService.LoginAsync(loginRequest.Email, loginRequest.Password);
            return result is not null ? Ok(result) : Unauthorized();
        }
    }
}
