using MaskaniBusinessLayer;
using MaskaniDataAccess.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MaskaniAPI.Controllers
{
    [ApiController]
    [Route("api/universities")]
    [Authorize]
    public class UniversityController : ControllerBase
    {
        private readonly UniversityService _universityService;

        public UniversityController(UniversityService universityService)
        {
            _universityService = universityService;
        }

        [HttpGet]
        [ProducesResponseType(typeof(IEnumerable<clsUniversityDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll()
        {
            var universities = await _universityService.GetAllUniversitiesAsync();
            return Ok(universities);
        }

        [HttpGet("{id:int}")]
        [ProducesResponseType(typeof(clsUniversityDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(int id)
        {
            var university = await _universityService.GetUniversityByIdAsync(id);

            if (university == null)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "University not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            return Ok(university);
        }

        [HttpPost]
        [Authorize(Roles = "User")]
        [ProducesResponseType(typeof(int), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Add([FromBody] clsAddUniversityDTO dto)
        {
            var id = await _universityService.AddUniversityAsync(dto);

            return CreatedAtAction(
                nameof(GetById),
                new { id },
                new { UniversityID = id });
        }

        [HttpPut]
        [Authorize(Roles = "User")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update([FromBody] clsUpdateUniversityDTO dto)
        {
            var success = await _universityService.UpdateUniversityAsync(dto);

            return success
                ? Ok()
                : NotFound(new ProblemDetails
                {
                    Title = "University not found.",
                    Status = StatusCodes.Status404NotFound
                });
        }

        [HttpDelete("{id:int}")]
        [Authorize(Roles = "User")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _universityService.DeleteUniversityAsync(id);

            return success
                ? Ok()
                : NotFound(new ProblemDetails
                {
                    Title = "University not found.",
                    Status = StatusCodes.Status404NotFound
                });
        }
    }
}