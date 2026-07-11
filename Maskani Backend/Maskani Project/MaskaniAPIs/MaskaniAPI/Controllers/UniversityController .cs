using MaskaniBusinessLayer;
using MaskaniDataAccess.DTOs;
using Microsoft.AspNetCore.Mvc;

namespace MaskaniAPI.Controllers
{
    [ApiController]
    [Route("api/universities")]
    public class UniversityController : ControllerBase
    {
        private readonly UniversityService _universityService;

        public UniversityController(UniversityService universityService)
        {
            _universityService = universityService;
        } 

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var result = await _universityService.GetAllUniversitiesAsync();
            return Ok(result);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetById(int id)
        {
            var result = await _universityService.GetUniversityByIdAsync(id);
            return result != null ? Ok(result) : NotFound();
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] clsAddUniversityDTO dto)
        {
            var id = await _universityService.AddUniversityAsync(dto);
            return Ok(new { id });
        }

        [HttpPut]
        public async Task<IActionResult> Update([FromBody] clsUpdateUniversityDTO dto)
        {
            var result = await _universityService.UpdateUniversityAsync(dto);
            return result ? Ok() : NotFound();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var result = await _universityService.DeleteUniversityAsync(id);
            return result ? Ok() : NotFound();
        }
    }
}
