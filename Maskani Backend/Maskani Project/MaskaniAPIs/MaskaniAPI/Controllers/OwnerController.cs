using MaskaniBusinessLayer;
using MaskaniDataAccess.DTOs;
using MaskaniDataAccessLayer.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MaskaniAPI.Controllers
{
    [ApiController]
    [Route("api/owners")]
    [Authorize]
    public class OwnerController : ControllerBase
    {
        private readonly OwnerService _ownerService;
        private readonly CurrentUserService
            _currentUserService;

        public OwnerController(
            OwnerService ownerService,
            CurrentUserService currentUserService)
        {
            _ownerService = ownerService;
            _currentUserService = currentUserService;
        }

        // ========================================================
        // OWNER SELF PROFILE
        // ========================================================

        [Authorize(Roles = "Owner")]
        [HttpGet("me")]
        [ProducesResponseType(
    typeof(clsOwnerProfileDTO),
    StatusCodes.Status200OK)]
        [ProducesResponseType(
    typeof(ProblemDetails),
    StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        public async Task<ActionResult<clsOwnerProfileDTO>> GetMe()
        {
            int personId =
                _currentUserService.PersonId;

            var owner =
                await _ownerService
                    .GetOwnerByPersonID(personId);

            if (owner == null)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Owner account not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            var response = new clsOwnerProfileDTO
            {
                OwnerID = owner.OwnerID,
                PersonID = owner.PersonID,
                FirstName = owner.FirstName,
                LastName = owner.LastName,
                Phone = owner.Phone,
                Email = owner.Email,
                Role = "Owner"
            };

            return Ok(response);
        }

        // ========================================================
        // UPDATE
        // Owner updates only their own account.
        // Admin User may update a selected Owner account.
        // ========================================================

        [HttpPut("{id:int}")]
        [Authorize(Roles = "Owner,User")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(
            int id,
            [FromBody] clsUpdateOwnerDTO dto)
        {
            clsOwnerDTO? targetOwner;

            if (_currentUserService.IsInRole("Owner"))
            {
                int personId =
                    _currentUserService.PersonId;

                targetOwner =
                    await _ownerService
                        .GetOwnerByPersonID(personId);

                if (targetOwner == null)
                {
                    return Unauthorized(new ProblemDetails
                    {
                        Title = "Owner account not found.",
                        Status =
                            StatusCodes.Status401Unauthorized
                    });
                }
            }
            else
            {
                if (id <= 0)
                {
                    return NotFound(new ProblemDetails
                    {
                        Title = "Owner not found.",
                        Status = StatusCodes.Status404NotFound
                    });
                }

                targetOwner =
                    await _ownerService
                        .GetOwnerByIdAsync(id);

                if (targetOwner == null)
                {
                    return NotFound(new ProblemDetails
                    {
                        Title = "Owner not found.",
                        Status = StatusCodes.Status404NotFound
                    });
                }
            }

            // Do not trust identity fields from the body or route
            // for an Owner self-service request.
            dto.OwnerID = targetOwner.OwnerID;
            dto.PersonID = targetOwner.PersonID;
            dto.Role = "Owner";

            bool success =
                await _ownerService.UpdateOwnerAsync(dto);

            if (!success)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Owner not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            return Ok();
        }

        // ========================================================
        // ADMIN MANAGEMENT
        // ========================================================

        [HttpDelete("{id:int}")]
        [Authorize(Roles = "User")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            if (id <= 0)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Owner not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            bool success =
                await _ownerService.DeleteOwnerAsync(id);

            if (!success)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Owner not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            return NoContent();
        }

        [HttpGet]
        [Authorize(Roles = "User")]
        [ProducesResponseType(
            typeof(IEnumerable<clsOwnerDTO>),
            StatusCodes.Status200OK)]
        public async Task<ActionResult<IEnumerable<clsOwnerDTO>>>
            GetAll()
        {
            var owners =
                await _ownerService.GetAllOwnersAsync();

            foreach (var owner in owners)
            {
                RemovePassword(owner);
            }

            return Ok(owners);
        }

        [HttpGet("{id:int}")]
        [Authorize(Roles = "User")]
        [ProducesResponseType(
            typeof(clsOwnerDTO),
            StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<clsOwnerDTO>>
            GetById(int id)
        {
            if (id <= 0)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Owner not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            var owner =
                await _ownerService.GetOwnerByIdAsync(id);

            if (owner == null)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Owner not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            RemovePassword(owner);

            return Ok(owner);
        }

        [HttpGet("by-email")]
        [Authorize(Roles = "User")]
        [ProducesResponseType(
            typeof(clsOwnerDTO),
            StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<clsOwnerDTO>>
            GetOwnerByEmail([FromQuery] string email)
        {
            if (string.IsNullOrWhiteSpace(email))
            {
                return BadRequest(new ProblemDetails
                {
                    Title = "Email is required.",
                    Status = StatusCodes.Status400BadRequest
                });
            }

            var owner =
                await _ownerService
                    .GetByEmailAsync(email.Trim());

            if (owner == null)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Owner not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            RemovePassword(owner);

            return Ok(owner);
        }

        [HttpGet("person/{personId:int}")]
        [Authorize(Roles = "User")]
        [ProducesResponseType(
            typeof(clsOwnerDTO),
            StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<clsOwnerDTO>>
            GetOwnerByPersonId(int personId)
        {
            if (personId <= 0)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Owner not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            var owner =
                await _ownerService
                    .GetOwnerByPersonID(personId);

            if (owner == null)
            {
                return NotFound(new ProblemDetails
                {
                    Title =
                        "Owner not found for the given Person ID.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            RemovePassword(owner);

            return Ok(owner);
        }

        private static void RemovePassword(
            clsOwnerDTO owner)
        {
            owner.Password = null;
        }
    }
}