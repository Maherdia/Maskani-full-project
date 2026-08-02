using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using MaskaniBusinessLayer;
using MaskaniDataAccess.DTOs;

namespace MaskaniAPI.Controllers
{
    [ApiController]
    [Route("api/academic-terms")]
    public class AcademicTermController : ControllerBase
    {
        private readonly AcademicTermService _termService;

        public AcademicTermController(AcademicTermService termService)
        {
            _termService = termService;
        }

        [HttpGet]
        [AllowAnonymous]
        [ProducesResponseType(typeof(IEnumerable<clsAcademicTermDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetAll()
        {
            var terms = await _termService.GetAllTermsAsync();
            return Ok(terms);
        }

        [HttpGet("active")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(IEnumerable<clsAcademicTermDTO>), StatusCodes.Status200OK)]
        public async Task<IActionResult> GetActive()
        {
            var terms = await _termService.GetActiveTermsAsync();
            return Ok(terms);
        }

        [HttpGet("{id}")]
        [AllowAnonymous]
        [ProducesResponseType(typeof(clsAcademicTermDTO), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> GetById(int id)
        {
            var term = await _termService.GetTermByIdAsync(id);

            if (term == null)
                return NotFound(new ProblemDetails
                {
                    Title = "Academic term not found.",
                    Status = StatusCodes.Status404NotFound
                });

            return Ok(term);
        }

        [HttpPost]
        [Authorize(Roles = "User")]
        [ProducesResponseType(typeof(int), StatusCodes.Status201Created)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        public async Task<IActionResult> Add([FromBody] clsAddAcademicTermDTO dto)
        {
            var id = await _termService.AddTermAsync(dto);

            return CreatedAtAction(nameof(GetById), new { id }, id);
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "User")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Update(int id, [FromBody] clsUpdateAcademicTermDTO dto)
        {
            dto.TermId = id;

            var success = await _termService.UpdateTermAsync(dto);

            if (!success)
                return NotFound(new ProblemDetails
                {
                    Title = "Academic term not found.",
                    Status = StatusCodes.Status404NotFound
                });

            return Ok();
        }

        [HttpDelete("{id}")]
        [Authorize(Roles = "User")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _termService.DeleteTermAsync(id);

            if (!success)
                return NotFound(new ProblemDetails
                {
                    Title = "Academic term not found.",
                    Status = StatusCodes.Status404NotFound
                });

            return Ok();
        }
    }
}