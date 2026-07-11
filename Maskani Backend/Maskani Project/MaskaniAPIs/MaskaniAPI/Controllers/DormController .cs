 using Microsoft.AspNetCore.Mvc;
using MaskaniBusinessLayer;
using Repositry_DataAccess_.DTOs;

namespace MaskaniAPI.Controllers
{
    [ApiController]
    [Route("api/Dorms")]
    public class DormsController : ControllerBase
    {
        private readonly DormService _dormService;

        public DormsController(DormService dormService)
        {
            _dormService = dormService;
        }

        [HttpGet("all")]
        [ProducesResponseType(typeof(IEnumerable<clsDormDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll() => Ok(await _dormService.GetAllDormsAsync());

        [HttpGet("{id}", Name = "GetById")]
        [ProducesResponseType(typeof(clsDormDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(string id)
        {
            try
            {
                var dorm = await _dormService.GetDormByIdAsync(id);
                return dorm != null ? Ok(dorm) : NotFound();
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while retrieving the dorm.");
            }
        }

        [HttpPost("add")]
        [ProducesResponseType(typeof(object), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Add([FromBody] clsAddDormDTO dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);
            try
            {
                if (await _dormService.DormNameExistsAsync(dto.DormName))
                    return Conflict("A dorm with the same name already exists.");

                var newId = await _dormService.AddDormAsync(dto);
                return Created($"/api/dorms/{newId}", new { DormID = newId });
            }
            catch (Exception ex)
            {
                return StatusCode(500, "An error occurred while creating the dorm.");
            }
        }

        [HttpPut("update")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update([FromBody] clsUpdateDormDTO dto)
        {
            var updated = await _dormService.UpdateDormAsync(dto);
            return updated ? Ok() : NotFound();
        }


        [HttpDelete("{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(string id)
        {
            var deleted = await _dormService.DeleteDormAsync(id);
            return deleted ? Ok() : NotFound();
        }


        [HttpGet("search")]
        [ProducesResponseType(typeof(IEnumerable<clsDormDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> Search(
            [FromQuery] string? university,
            [FromQuery] bool? furnished,
            [FromQuery] double? maxDistance,
            [FromQuery] string? address,
            [FromQuery] string? dormName)
        {
            var results = await _dormService.SearchDormsAsync(university, furnished, maxDistance, address);
            return Ok(results);
        }

        [HttpGet("paged")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetPaged([FromQuery] int pageIndex, [FromQuery] int pageSize)
        {
            var dorms = await _dormService.GetDormsPagedAsync(pageIndex, pageSize);
            var total = await _dormService.GetTotalDormsAsync();

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
        public async Task<IActionResult> CountByUniversity([FromQuery] string universityName)
        {
            var count = await _dormService.GetDormCountByUniversityAsync(universityName);
            return Ok(new { University = universityName, Count = count });
        }


        [HttpGet("by-university/{name}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetByUniversity(string name) =>
            Ok(await _dormService.GetDormsByUniversityAsync(name));

        [HttpGet("by-owner/{name}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetByOwner(string name) =>
            Ok(await _dormService.GetDormsByOwnerAsync(name));

        [HttpGet("by-owner-id/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetByOwnerId(int id) =>
            Ok(await _dormService.GetDormsByOwnerIdAsync(id));


        [HttpGet("by-address")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetByAddress([FromQuery] string address) =>
            Ok(await _dormService.GetDormsByAddressAsync(address));


        [HttpGet("by-furnishing")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetByFurnishing([FromQuery] bool furnished) =>
            Ok(await _dormService.GetDormsByFurnishingAsync(furnished));


        [HttpGet("by-distance")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> GetByDistance([FromQuery] double maxDistance) =>
            Ok(await _dormService.GetDormsByDistanceAsync(maxDistance));


        [HttpGet("exists/{id}")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> DormExists(string id) =>
            Ok(await _dormService.DormExistsAsync(id));


        [HttpGet("name-exists")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        public async Task<IActionResult> DormNameExists([FromQuery] string name) =>
            Ok(await _dormService.DormNameExistsAsync(name));
    }
}
