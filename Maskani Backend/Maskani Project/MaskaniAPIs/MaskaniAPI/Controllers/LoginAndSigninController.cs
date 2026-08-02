using System.Security.Claims;
using DataAccessLayer;
using MaskaniBusinessLayer;
using MaskaniDataAccess.DTOs;
using MaskaniDataAccessLayer.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace MaskaniAPI.Controllers
{
    [ApiController]
    [Route("api/LoginAndSignin")]
    public class LoginAndSigninController : ControllerBase
    {
        private readonly PeopleService _peopleService;
        private readonly StudentService _studentService;
        private readonly OwnerService _ownerService;
        private readonly UserService _userService;
        private readonly JwtService _jwtService;

        public LoginAndSigninController(
            PeopleService peopleService,
            StudentService studentService,
            OwnerService ownerService,
            UserService userService,
            JwtService jwtService)
        {
            _peopleService = peopleService;
            _studentService = studentService;
            _ownerService = ownerService;
            _userService = userService;
            _jwtService = jwtService;
        }

        [HttpPost("Login")]
        [EnableRateLimiting("AuthPolicy")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Login(
            [FromBody] clsLoginRequestDTO loginRequest)
        {
            if (loginRequest == null ||
                string.IsNullOrWhiteSpace(loginRequest.Email) ||
                string.IsNullOrWhiteSpace(loginRequest.Password))
            {
                return BadRequest(new ProblemDetails
                {
                    Title = "Email and password are required.",
                    Status = StatusCodes.Status400BadRequest
                });
            }

            string normalizedEmail = loginRequest.Email.Trim();

            var people = await _peopleService.GetAllPeopleAsync();

            var person = people.FirstOrDefault(x =>
                string.Equals(
                    x.Email,
                    normalizedEmail,
                    StringComparison.OrdinalIgnoreCase));

            if (person == null)
            {
                return Unauthorized(new ProblemDetails
                {
                    Title = "Invalid email or password.",
                    Status = StatusCodes.Status401Unauthorized
                });
            }

            switch (person.Role.Trim().ToLowerInvariant())
            {
                case "owner":
                    {
                        var owner = await _ownerService.LoginAsync(
                            normalizedEmail,
                            loginRequest.Password);

                        if (owner == null)
                        {
                            return Unauthorized(new ProblemDetails
                            {
                                Title = "Invalid email or password.",
                                Status = StatusCodes.Status401Unauthorized
                            });
                        }

                        var token = _jwtService.GenerateToken(
                            owner.PersonID,
                            owner.Email,
                            "Owner");

                        return Ok(new
                        {
                            token,
                            user = owner
                        });
                    }

                case "student":
                    {
                        var student = await _studentService.LoginAsync(
                            normalizedEmail,
                            loginRequest.Password);

                        if (student == null)
                        {
                            return Unauthorized(new ProblemDetails
                            {
                                Title = "Invalid email or password.",
                                Status = StatusCodes.Status401Unauthorized
                            });
                        }

                        var token = _jwtService.GenerateToken(
                            student.PersonID,
                            student.Email,
                            "Student");

                        return Ok(new
                        {
                            token,
                            user = student
                        });
                    }

                case "user":
                    {
                        var user = await _userService.LoginAsync(
                            normalizedEmail,
                            loginRequest.Password);

                        if (user == null)
                        {
                            return Unauthorized(new ProblemDetails
                            {
                                Title = "Invalid email or password.",
                                Status = StatusCodes.Status401Unauthorized
                            });
                        }

                        var token = _jwtService.GenerateToken(
                            user.PersonID,
                            user.Email,
                            "User");

                        return Ok(new
                        {
                            token,
                            user
                        });
                    }

                default:
                    return Unauthorized(new ProblemDetails
                    {
                        Title = "Invalid email or password.",
                        Status = StatusCodes.Status401Unauthorized
                    });
            }
        }

        [HttpPost("Register")]
        [EnableRateLimiting("AuthPolicy")]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Register(
    [FromBody] clsUnifiedRegisterDTO dto)
        {
            string normalizedRole = dto.Role.Trim().ToLowerInvariant();
            string normalizedEmail = dto.Email.Trim();

            if (await _peopleService.DoesPersonExistByEmailAsync(normalizedEmail))
            {
                return Conflict(new ProblemDetails
                {
                    Title = "Email already exists.",
                    Status = StatusCodes.Status409Conflict
                });
            }

            int newId;
            string createdRole;

            switch (normalizedRole)
            {
                case "student":
                    newId = await _studentService.AddStudentAsync(
                        new clsAddStudentDTO
                        {
                            FirstName = dto.FirstName.Trim(),
                            LastName = dto.LastName.Trim(),
                            Phone = dto.Phone.Trim(),
                            Email = normalizedEmail,
                            Password = dto.Password
                        });

                    createdRole = "Student";
                    break;

                case "owner":
                    newId = await _ownerService.AddOwnerAsync(
                        new clsAddOwnerDTO
                        {
                            FirstName = dto.FirstName.Trim(),
                            LastName = dto.LastName.Trim(),
                            Phone = dto.Phone.Trim(),
                            Email = normalizedEmail,
                            Password = dto.Password
                        });

                    createdRole = "Owner";
                    break;

                default:
                    return BadRequest(new ProblemDetails
                    {
                        Title = "Invalid role specified.",
                        Detail =
                            "Public registration supports only Student or Owner accounts.",
                        Status = StatusCodes.Status400BadRequest
                    });
            }

            return Ok(new
            {
                id = newId,
                role = createdRole
            });
        }

        [Authorize]
        [HttpPut("Update/{id:int}")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status403Forbidden)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status409Conflict)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> Update(
            int id,
            [FromBody] clsUnifiedUpdateDTO dto)
        {
            var claim =
                User.FindFirst(ClaimTypes.NameIdentifier);

            if (claim == null ||
                !int.TryParse(claim.Value, out int personId))
            {
                return Unauthorized(new ProblemDetails
                {
                    Title = "Authentication is required.",
                    Status = StatusCodes.Status401Unauthorized
                });
            }

            if (personId != id)
                return Forbid();

            var person =
                await _peopleService.GetPersonByIdAsync(personId);

            if (person == null)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Person not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            string normalizedEmail = dto.Email.Trim();

            if (!string.Equals(
                    person.Email,
                    normalizedEmail,
                    StringComparison.OrdinalIgnoreCase))
            {
                bool emailExists =
                    await _peopleService
                        .DoesPersonExistByEmailAsync(normalizedEmail);

                if (emailExists)
                {
                    return Conflict(new ProblemDetails
                    {
                        Title = "Email already exists.",
                        Status = StatusCodes.Status409Conflict
                    });
                }
            }

            bool success;

            switch (person.Role.Trim().ToLowerInvariant())
            {
                case "owner":
                    {
                        var owner =
                            await _ownerService.GetOwnerByPersonID(personId);

                        if (owner == null)
                        {
                            return NotFound(new ProblemDetails
                            {
                                Title = "Owner not found.",
                                Status = StatusCodes.Status404NotFound
                            });
                        }

                        success = await _ownerService.UpdateOwnerAsync(
                            new clsUpdateOwnerDTO
                            {
                                PersonID = personId,
                                OwnerID = owner.OwnerID,
                                FirstName = dto.FirstName.Trim(),
                                LastName = dto.LastName.Trim(),
                                Phone = dto.Phone.Trim(),
                                Email = normalizedEmail
                            });

                        break;
                    }

                case "student":
                    {
                        var student =
                            await _studentService
                                .GetStudentByPersonIDAsync(personId);

                        if (student == null)
                        {
                            return NotFound(new ProblemDetails
                            {
                                Title = "Student not found.",
                                Status = StatusCodes.Status404NotFound
                            });
                        }

                        success = await _studentService.UpdateStudentAsync(
                            new clsUpdateStudentDTO
                            {
                                PersonID = personId,
                                StudentID = student.StudentID,
                                FirstName = dto.FirstName.Trim(),
                                LastName = dto.LastName.Trim(),
                                Phone = dto.Phone.Trim(),
                                Email = normalizedEmail
                            });

                        break;
                    }

                case "user":
                    {
                        var user =
                            await _userService.GetUserByPersonID(personId);

                        if (user == null)
                        {
                            return NotFound(new ProblemDetails
                            {
                                Title = "User not found.",
                                Status = StatusCodes.Status404NotFound
                            });
                        }

                        success = await _userService.UpdateUserAsync(
                            new clsUpdateUserDTO
                            {
                                PersonID = personId,
                                UserID = user.UserID,
                                FirstName = dto.FirstName.Trim(),
                                LastName = dto.LastName.Trim(),
                                Phone = dto.Phone.Trim(),
                                Email = normalizedEmail
                            });

                        break;
                    }

                default:
                    return Unauthorized(new ProblemDetails
                    {
                        Title = "Account could not be verified.",
                        Status = StatusCodes.Status401Unauthorized
                    });
            }

            if (!success)
            {
                throw new InvalidOperationException(
                    "Failed to update account.");
            }

            return NoContent();
        }


        [Authorize]
        [HttpPost("ChangePassword")]
        [ProducesResponseType(StatusCodes.Status204NoContent)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<IActionResult> ChangePassword(
    [FromBody] clsChangePasswordDTO dto)
        {
            var claim = User.FindFirst(ClaimTypes.NameIdentifier);

            if (claim == null ||
                !int.TryParse(claim.Value, out int personId))
            {
                return Unauthorized(new ProblemDetails
                {
                    Title = "Authentication is required.",
                    Status = StatusCodes.Status401Unauthorized
                });
            }

            var person = await _peopleService.GetPersonByIdAsync(personId);

            if (person == null)
            {
                return NotFound(new ProblemDetails
                {
                    Title = "Account not found.",
                    Status = StatusCodes.Status404NotFound
                });
            }

            string normalizedRole =
                person.Role.Trim().ToLowerInvariant();

            bool currentPasswordIsValid = false;
            bool passwordChanged = false;

            switch (normalizedRole)
            {
                case "owner":
                    currentPasswordIsValid =
                        await _ownerService.VerifyPasswordAsync(
                            person.Email,
                            dto.CurrentPassword);
                    break;

                case "student":
                    currentPasswordIsValid =
                        await _studentService.VerifyPasswordAsync(
                            person.Email,
                            dto.CurrentPassword);
                    break;

                case "user":
                    currentPasswordIsValid =
                        await _userService.VerifyPasswordAsync(
                            person.Email,
                            dto.CurrentPassword);
                    break;

                default:
                    return Unauthorized(new ProblemDetails
                    {
                        Title = "Account could not be verified.",
                        Status = StatusCodes.Status401Unauthorized
                    });
            }

            if (!currentPasswordIsValid)
            {
                return BadRequest(new ProblemDetails
                {
                    Title = "Current password is incorrect.",
                    Status = StatusCodes.Status400BadRequest
                });
            }

            switch (normalizedRole)
            {
                case "owner":
                    {
                        var owner =
                            await _ownerService.GetOwnerByPersonID(personId);

                        if (owner == null)
                        {
                            return NotFound(new ProblemDetails
                            {
                                Title = "Owner account not found.",
                                Status = StatusCodes.Status404NotFound
                            });
                        }

                        passwordChanged =
                            await _ownerService.ChangePasswordAsync(
                                owner.OwnerID,
                                dto.NewPassword);

                        break;
                    }

                case "student":
                    {
                        var student =
                            await _studentService.GetStudentByPersonIDAsync(personId);

                        if (student == null)
                        {
                            return NotFound(new ProblemDetails
                            {
                                Title = "Student account not found.",
                                Status = StatusCodes.Status404NotFound
                            });
                        }

                        passwordChanged =
                            await _studentService.ChangePasswordAsync(
                                student.StudentID,
                                dto.NewPassword);

                        break;
                    }

                case "user":
                    {
                        var user =
                            await _userService.GetUserByPersonID(personId);

                        if (user == null)
                        {
                            return NotFound(new ProblemDetails
                            {
                                Title = "User account not found.",
                                Status = StatusCodes.Status404NotFound
                            });
                        }

                        passwordChanged =
                            await _userService.ChangePasswordAsync(
                                user.UserID,
                                dto.NewPassword);

                        break;
                    }

                default:
                    return Unauthorized(new ProblemDetails
                    {
                        Title = "Account could not be verified.",
                        Status = StatusCodes.Status401Unauthorized
                    });
            }

            if (!passwordChanged)
            {
                throw new InvalidOperationException(
                    "Failed to change password.");
            }

            return NoContent();
        }
    }
}