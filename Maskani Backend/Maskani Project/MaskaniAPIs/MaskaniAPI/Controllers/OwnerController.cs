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
        [ProducesResponseType(typeof(int), StatusCodes.Status201Created)]
        public async Task<IActionResult> Add([FromBody] clsAddOwnerDTO dto)
        {
            var newId = await _ownerService.AddOwnerAsync(dto);
            return CreatedAtAction(nameof(GetById), new { id = newId }, newId);
        }

        [HttpPut("{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(int id, [FromBody] clsUpdateOwnerDTO dto)
        {
            dto.OwnerID = id;
            var success = await _ownerService.UpdateOwnerAsync(dto);
            return success ? Ok() : NotFound();
        }


        [HttpDelete("{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _ownerService.DeleteOwnerAsync(id);
            return success ? Ok() : NotFound();
        }


        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<clsOwnerDTO>), StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<clsOwnerDTO>>> GetAll()
        {
            var owners = await _ownerService.GetAllOwnersAsync();
            return Ok(owners);
        }


        [HttpGet("{id:int}")]
        [ProducesResponseType(typeof(clsOwnerDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<clsOwnerDTO>> GetById(int id)
        {
            var owner = await _ownerService.GetOwnerByIdAsync(id);
            return owner is not null ? Ok(owner) : NotFound();
        }


        [HttpPost("change-password")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> ChangePassword([FromQuery] int ownerId, [FromBody] string newPassword)
        {
            var success = await _ownerService.ChangePasswordAsync(ownerId, newPassword);
            return success ? Ok() : BadRequest("Failed to change password.");
        }


        [HttpPost("login")]
        [ProducesResponseType(typeof(clsOwnerDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        public async Task<IActionResult> Login([FromBody] clsLoginRequestDTO loginRequest)
        {
            var result = await _ownerService.LoginAsync(loginRequest.Email, loginRequest.Password);
            return result is not null ? Ok(result) : Unauthorized("Invalid email or password.");
        }

        [HttpGet("{email}")]
        [ProducesResponseType(typeof(clsOwnerDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetOwnerByEmail(string email)
        {
            var owner = await _ownerService.GetByEmailAsync(email);
            if (owner is not null)
            {
                return Ok(owner);
            }
            else
            {
                return NotFound("Owner not found.");
            }
        }

        [HttpGet("person/{personId:int}")]
        [ProducesResponseType(typeof(clsOwnerDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetOwnerByPersonId(int personId)
        {
            var owner = await _ownerService.GetOwnerByPersonID(personId);
            if (owner is not null)
            {
                return Ok(owner);
            }
            else
            {
                return NotFound("Owner not found for the given Person ID.");
            }
        }
    }
}
