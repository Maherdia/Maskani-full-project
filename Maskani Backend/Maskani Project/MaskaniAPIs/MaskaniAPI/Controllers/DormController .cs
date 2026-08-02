using MaskaniBusinessLayer;
using MaskaniDataAccess.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Repositry_DataAccess_.DTOs;

namespace MaskaniAPI.Controllers
{
    [ApiController]
    [Route("api/Dorms")]
    public class DormsController : ControllerBase
    {
        private readonly DormService _dormService;
        private readonly DormImageService _dormImageService;
        private readonly OwnerService _ownerService;
        private readonly CurrentUserService _currentUserService;

        public DormsController(
            DormService dormService,
            DormImageService dormImageService,
            OwnerService ownerService,
            CurrentUserService currentUserService)
        {
            _dormService = dormService;
            _dormImageService = dormImageService;
            _ownerService = ownerService;
            _currentUserService = currentUserService;
        }

        // ========================================================
        // PUBLIC READ ENDPOINTS
        // ========================================================

        [HttpGet("all")]
        [ProducesResponseType(
            typeof(IEnumerable<clsDormDTO>),
            StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll()
        {
            var dorms =
                await _dormService.GetAllDormsAsync();

            return Ok(dorms);
        }

        [HttpGet("{id}", Name = "GetById")]
        [ProducesResponseType(
            typeof(clsDormDTO),
            StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(string id)
        {
            var dorm =
                await _dormService.GetDormByIdAsync(id);

            if (dorm == null)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Dorm not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            return Ok(dorm);
        }

        [HttpGet("search")]
        [ProducesResponseType(
            typeof(IEnumerable<clsDormDTO>),
            StatusCodes.Status200OK)]
        public async Task<IActionResult> Search(
            [FromQuery] string? university,
            [FromQuery] bool? furnished,
            [FromQuery] double? maxDistance,
            [FromQuery] string? address)
        {
            var results =
                await _dormService.SearchDormsAsync(
                    university,
                    furnished,
                    maxDistance,
                    address);

            return Ok(results);
        }

        [HttpGet("paged")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetPaged(
            [FromQuery] int pageIndex,
            [FromQuery] int pageSize)
        {
            if (pageIndex < 1 ||
                pageSize < 1 ||
                pageSize > 100)
            {
                return BadRequest(new ProblemDetails
                {
                    Title = "Invalid pagination parameters.",
                    Detail =
                        "PageIndex must be at least 1 and PageSize must be between 1 and 100.",
                    Status = StatusCodes.Status400BadRequest
                });
            }

            var dorms =
                await _dormService.GetDormsPagedAsync(
                    pageIndex,
                    pageSize);

            int total =
                await _dormService.GetTotalDormsAsync();

            return Ok(new
            {
                Total = total,
                PageIndex = pageIndex,
                PageSize = pageSize,
                Data = dorms
            });
        }

        [HttpGet("count/by-university")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> CountByUniversity(
            [FromQuery] string universityName)
        {
            if (string.IsNullOrWhiteSpace(universityName))
            {
                return BadRequest(new ProblemDetails
                {
                    Title = "University name is required.",
                    Status = StatusCodes.Status400BadRequest
                });
            }

            string normalizedUniversityName =
                universityName.Trim();

            int count =
                await _dormService
                    .GetDormCountByUniversityAsync(
                        normalizedUniversityName);

            return Ok(new
            {
                University = normalizedUniversityName,
                Count = count
            });
        }

        [HttpGet("by-university/{name}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetByUniversity(
            string name)
        {
            var dorms =
                await _dormService
                    .GetDormsByUniversityAsync(name);

            return Ok(dorms);
        }

        [HttpGet("by-owner/{name}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetByOwner(
            string name)
        {
            var dorms =
                await _dormService
                    .GetDormsByOwnerAsync(name);

            return Ok(dorms);
        }

        [HttpGet("by-owner-id/{id:int}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetByOwnerId(int id)
        {
            var dorms =
                await _dormService
                    .GetDormsByOwnerIdAsync(id);

            return Ok(dorms);
        }

        [HttpGet("by-address")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetByAddress(
            [FromQuery] string address)
        {
            var dorms =
                await _dormService
                    .GetDormsByAddressAsync(address);

            return Ok(dorms);
        }

        [HttpGet("by-furnishing")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetByFurnishing(
            [FromQuery] bool furnished)
        {
            var dorms =
                await _dormService
                    .GetDormsByFurnishingAsync(furnished);

            return Ok(dorms);
        }

        [HttpGet("by-distance")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> GetByDistance(
            [FromQuery] double maxDistance)
        {
            if (maxDistance < 0)
            {
                return BadRequest(new ProblemDetails
                {
                    Title = "Invalid maximum distance.",
                    Status = StatusCodes.Status400BadRequest
                });
            }

            var dorms =
                await _dormService
                    .GetDormsByDistanceAsync(maxDistance);

            return Ok(dorms);
        }

        [HttpGet("exists/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> DormExists(string id)
        {
            bool exists =
                await _dormService.DormExistsAsync(id);

            return Ok(exists);
        }

        [HttpGet("name-exists")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> DormNameExists(
            [FromQuery] string name)
        {
            bool exists =
                await _dormService
                    .DormNameExistsAsync(name);

            return Ok(exists);
        }

        [HttpGet("{dormId}/images")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetImages(
            string dormId)
        {
            var images =
                await _dormImageService
                    .GetDormImagesAsync(dormId);

            return Ok(images);
        }

        // ========================================================
        // CREATE DORM
        // OwnerID is derived from JWT for Owner accounts.
        // ========================================================

        [HttpPost("add")]
        [Authorize(Roles = "Owner,User")]
        [ProducesResponseType(
            typeof(object),
            StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        public async Task<IActionResult> Add(
            [FromBody] clsAddDormDTO dto)
        {
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

                dto.OwnerID = owner.OwnerID;
            }

            if (await _dormService
                    .DormNameExistsAsync(dto.DormName))
            {
                return Conflict(new ProblemDetails
                {
                    Title =
                        "A dorm with the same name already exists.",
                    Status = StatusCodes.Status409Conflict
                });
            }

            string newId =
                await _dormService.AddDormAsync(dto);

            return CreatedAtRoute(
                "GetById",
                new { id = newId },
                new { DormID = newId });
        }

        // ========================================================
        // UPLOAD DORM IMAGE
        // Owner must own the target dorm.
        // ========================================================

        [HttpPost("{dormId}/images")]
        [Authorize(Roles = "Owner,User")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UploadImage(
            string dormId,
            IFormFile file)
        {
            if (file == null || file.Length == 0)
            {
                return BadRequest(new ProblemDetails
                {
                    Title = "No file uploaded.",
                    Status = StatusCodes.Status400BadRequest
                });
            }

            var dorm =
                await _dormService.GetDormByIdAsync(dormId);

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

            var image =
                await _dormImageService
                    .UploadDormImageAsync(
                        dormId,
                        file);

            return Ok(image);
        }

        // ========================================================
        // UPDATE DORM
        // Owner must own the target dorm.
        // ========================================================

        [HttpPut("update")]
        [Authorize(Roles = "Owner,User")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(
            [FromBody] clsUpdateDormDTO dto)
        {
            var existingDorm =
                await _dormService
                    .GetDormByIdAsync(dto.DormID);

            if (existingDorm == null)
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

                if (existingDorm.OwnerID != owner.OwnerID)
                {
                    return NotFound(new ProblemDetails
                    {
                        Title =
                            "Dorm not found or does not belong to you.",
                        Status = StatusCodes.Status404NotFound
                    });
                }

                dto.OwnerID = owner.OwnerID;
            }

            bool updated =
                await _dormService.UpdateDormAsync(dto);

            if (!updated)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Dorm not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            return Ok();
        }

        // ========================================================
        // DELETE DORM
        // Owner must own the target dorm.
        // ========================================================

        [HttpDelete("{id}")]
        [Authorize(Roles = "Owner,User")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(string id)
        {
            var dorm =
                await _dormService.GetDormByIdAsync(id);

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

            bool deleted =
                await _dormService.DeleteDormAsync(id);

            if (!deleted)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Dorm not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            return Ok();
        }

        // ========================================================
        // DELETE DORM IMAGE
        // Owner must own the dorm containing the image.
        // ========================================================

        [HttpDelete("images/{imageId:int}")]
        [Authorize(Roles = "Owner,User")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> DeleteImage(
            int imageId)
        {
            var image =
                await _dormImageService
                    .GetDormImageByIdAsync(imageId);

            if (image == null)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Image not found.",
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

                var dorm =
                    await _dormService
                        .GetDormByIdAsync(image.DormID);

                if (dorm == null ||
                    dorm.OwnerID != owner.OwnerID)
                {
                    return NotFound(new ProblemDetails
                    {
                        Title =
                            "Image not found or does not belong to your dorm.",
                        Status = StatusCodes.Status404NotFound
                    });
                }
            }

            bool deleted =
                await _dormImageService
                    .DeleteDormImageAsync(imageId);

            if (!deleted)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Image not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            return Ok();
        }

        // ========================================================
        // ADMIN MODERATION
        // ========================================================

        [HttpGet("pending")]
        [Authorize(Roles = "User")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetPendingDorms()
        {
            var dorms =
                await _dormService
                    .GetPendingDormsAsync();

            return Ok(dorms);
        }

        [HttpPut("{dormId}/status")]
        [Authorize(Roles = "User")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> UpdateDormStatus(
            string dormId,
            [FromBody] clsDormStatusDTO dto)
        {
            bool updated =
                await _dormService
                    .UpdateDormStatusAsync(
                        dormId,
                        dto.DormStatus);

            if (!updated)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Dorm not found.",
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