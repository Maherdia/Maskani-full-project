using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using MaskaniBusinessLayer;
using MaskaniDataAccess.DTOs;
using MaskaniDataAccessLayer.DTOs;

namespace MaskaniAPI.Controllers
{
    [ApiController]
    [Route("api/Students")]
    public class StudentController : ControllerBase
    {
        private readonly StudentService _studentService;
        public StudentController(StudentService studentService)
        {
            _studentService = studentService;
        }

        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [HttpPost("add")]
        public async Task<IActionResult> Add([FromBody] clsAddStudentDTO dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.FirstName) || string.IsNullOrWhiteSpace(dto.LastName) || string.IsNullOrWhiteSpace(dto.Email) ||
                string.IsNullOrWhiteSpace(dto.Phone) || string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest("Invalid Data");

            var id = await _studentService.AddStudentAsync(dto);
            return Ok(id);
        }

        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [HttpPut("update")]
        public async Task<IActionResult> Update([FromBody] clsUpdateStudentDTO dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.FirstName) || string.IsNullOrWhiteSpace(dto.LastName) || string.IsNullOrWhiteSpace(dto.Email) ||
                string.IsNullOrWhiteSpace(dto.Phone) || string.IsNullOrWhiteSpace(dto.Password) || dto.PersonID < 0 || dto.StudentID < 0)
                return BadRequest("Invalid Data");

            var success = await _studentService.UpdateStudentAsync(dto);
            return success ? Ok() : NotFound();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var success = await _studentService.DeleteStudentAsync(id);
            return success ? Ok() : NotFound();
        }

        [HttpGet("all")]
        public async Task<ActionResult<IEnumerable<clsStudentDTO>>> GetAll()
        {
            var students = await _studentService.GetAllStudentsAsync();
            return Ok(students);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<clsStudentDTO>> GetById(int id)
        {
            var student = await _studentService.GetStudentByIdAsync(id);
            return student is not null ? Ok(student) : NotFound();
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword(int studentId, [FromBody] string newPassword)
        {
            var success = await _studentService.ChangePasswordAsync(studentId, newPassword);
            return success ? Ok() : BadRequest();
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] clsLoginRequestDTO loginRequest)
        {
            var result = await _studentService.LoginAsync(loginRequest.Email, loginRequest.Password);
            return result is not null ? Ok(result) : Unauthorized();
        }
    }
}
