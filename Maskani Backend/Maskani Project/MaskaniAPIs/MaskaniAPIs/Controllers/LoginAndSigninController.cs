using System.Numerics;
using DataAccessLayer;
using MaskaniBusinessLayer;
using MaskaniDataAccess.DTOs;
using MaskaniDataAccessLayer.DTOs;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace MaskaniAPI.Controllers
{
    [Route("api/LoginAndSignin")]
    [ApiController]
    public class LoginAndSigninController : ControllerBase
    {
        private readonly PeopleService _peopleService;
        private readonly StudentService _studentService;
        private readonly OwnerService _ownerService;
        private readonly UserService _userService;
        public LoginAndSigninController(PeopleService peopleService, StudentService studentService,OwnerService ownerService, UserService userService)
        {
            _peopleService = peopleService;
            _studentService = studentService;
            _ownerService = ownerService;
            _userService = userService;
        }
        
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [HttpPost("Login")]
        public async Task<IActionResult> Login([FromBody] clsLoginRequestDTO loginRequest)
        {
            if (loginRequest == null || string.IsNullOrWhiteSpace(loginRequest.Email) || string.IsNullOrWhiteSpace(loginRequest.Password))
            {
                return BadRequest(new { message = "Email and password are required." });
            }
            try
            {
                var people = await _peopleService.GetAllPeopleAsync();
                var person = people.FirstOrDefault(x => x.Email.Equals(loginRequest.Email, StringComparison.OrdinalIgnoreCase));
                if (person == null) 
                    return Unauthorized(new { message = "Invalid email or password" });

                string Role = person.Role.ToString().Trim();
                clsLoginRequestDTO? result = null;
                switch (Role)
                {
                    case "Owner":
                        if (!await _ownerService.VerifyPasswordAsync(loginRequest.Email, loginRequest.Password))
                        {
                            result = await _ownerService.LoginAsync(loginRequest.Email, loginRequest.Password);
                        }
                        break;


                    case "Student":
                        if (!await _studentService.VerifyPasswordAsync(loginRequest.Email, loginRequest.Password))
                        {
                            result = await _studentService.LoginAsync(loginRequest.Email, loginRequest.Password);
                        }
                        break;


                    case "User":
                        if (!await _userService.VerifyPasswordAsync(loginRequest.Email, loginRequest.Password))
                        {
                            result = await _userService.LoginAsync(loginRequest.Email, loginRequest.Password);
                        }
                        break;

                }
                if (result == null)
                    return Unauthorized(new { message = "Invalid email or password" });

                return Ok(new
                {
                    email = result.Email,
                    role = person.Role.ToString(),
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error." });
            }
        }

        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] clsUnifiedRegisterDTO dto)
        {
            if (dto == null || string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Password))
                return BadRequest(new { message = "Email and password are required." });

            try
            {
                string hashedPassword = clsHashing.HashPassword(dto.Password);
                int newId = -1;
                if (!await _peopleService.DoesPersonExistByEmailAsync(dto.Email))
                {

                    switch (dto.Role?.Trim())
                    {
                        case "User":
                            newId = await _userService.AddUserAsync(new clsAddUserDTO
                            {
                                FirstName = dto.FirstName,
                                LastName = dto.LastName,
                                Phone = dto.Phone,
                                Email = dto.Email,
                                Password = hashedPassword
                            });
                            break;

                        case "Student":
                            newId = await _studentService.AddStudentAsync(new clsAddStudentDTO
                            {
                                FirstName = dto.FirstName,
                                LastName = dto.LastName,
                                Phone = dto.Phone,
                                Email = dto.Email,
                                Password = hashedPassword
                            });
                            break;

                        case "Owner":
                            newId = await _ownerService.AddOwnerAsync(new clsAddOwnerDTO
                            {
                                FirstName = dto.FirstName,
                                LastName = dto.LastName,
                                Phone = dto.Phone,
                                Email = dto.Email,
                                Password = hashedPassword
                            });
                            break;

                        default:
                            return BadRequest(new { message = "Invalid role specified. Use 'User', 'Student', or 'Owner'." });
                    }

                    return Ok(new { id = newId, role = dto.Role });
                }
                else
                {
                    return BadRequest(new { message = "Email already exists." });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = "Registration failed.", error = ex.Message });
            }
        }


        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [HttpPut("Update{ID}")]
        public async Task<IActionResult> Update([FromBody] clsUnifiedUpdateDTO dto, int ID)
        {
            if (dto == null || ID < 1 || string.IsNullOrWhiteSpace(dto.Email) || string.IsNullOrWhiteSpace(dto.Phone) ||
                string.IsNullOrWhiteSpace(dto.FirstName) ||string.IsNullOrWhiteSpace(dto.LastName) ||
                string.IsNullOrWhiteSpace(dto.Password) || string.IsNullOrWhiteSpace(dto.newPassword))
                return BadRequest(new { message = "Invalid Data" });

            var person = await _peopleService.GetPersonByIdAsync(ID);
            if (person == null)
                return NotFound(new { message = "Person not found." });

            try
            {
                string role = person.Role.ToString().Trim();
                bool updateSuccess = false;

                if (!await _peopleService.DoesPersonExistByEmailAsync(dto.Email))
                {

                    switch (role)
                    {
                        case "Owner":
                            var owner = await _ownerService.GetOwnerByPersonID(ID);
                            if (owner == null)
                                return NotFound(new { message = "Owner not found." });

                            updateSuccess = await _ownerService.UpdateOwnerAsync(new clsUpdateOwnerDTO
                            {
                                PersonID = ID,
                                OwnerID = owner.OwnerID,
                                FirstName = dto.FirstName,
                                LastName = dto.LastName,
                                Phone = dto.Phone,
                                Email = dto.Email,
                                Password = clsHashing.HashPassword(dto.newPassword)
                            });
                            break;

                        case "Student":
                            var student = await _studentService.GetStudentByPersonIDAsync(ID);
                            if (student == null)
                                return NotFound(new { message = "Student not found." });

                            //if (!await _studentService.VerifyPasswordAsync(dto.Email, dto.Password))
                            //    return Unauthorized(new { message = "Current password is incorrect." });

                            updateSuccess = await _studentService.UpdateStudentAsync(new clsUpdateStudentDTO
                            {
                                PersonID = ID,
                                StudentID = student.StudentID,
                                FirstName = dto.FirstName,
                                LastName = dto.LastName,
                                Phone = dto.Phone,
                                Email = dto.Email,
                                Password = clsHashing.HashPassword(dto.newPassword)
                            });
                            break;

                        case "User":
                            var user = await _userService.GetUserByPersonID(ID);
                            if (user == null)
                                return NotFound(new { message = "User not found." });

                            //if (!await _userService.VerifyPasswordAsync(dto.Email, dto.Password))
                            //    return Unauthorized(new { message = "Current password is incorrect." });

                            updateSuccess = await _userService.UpdateUserAsync(new clsUpdateUserDTO
                            {
                                PersonID = ID,
                                UserID = user.UserID,
                                FirstName = dto.FirstName,
                                LastName = dto.LastName,
                                Phone = dto.Phone,
                                Email = dto.Email,
                                Password = clsHashing.HashPassword(dto.newPassword)
                            });
                            break;
                    }
                }
                else
                {
                    return BadRequest(new { message = "Email already exists." });
                }

                if (!updateSuccess)
                    return StatusCode(500, new { message = "Failed to update the record." });

                return Ok(new
                {
                    PersonID = ID,
                    FirstName = dto.FirstName,
                    LastName = dto.LastName,
                    Phone = dto.Phone,
                    Email = dto.Email
                });
            }
            catch(Exception ex)
            {
                return StatusCode(500, new { message = "Internal server error.", error = ex.Message });
            }
        }
    }
}
