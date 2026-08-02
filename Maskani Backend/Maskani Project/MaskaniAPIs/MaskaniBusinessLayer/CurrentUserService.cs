using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace MaskaniBusinessLayer
{
    public class CurrentUserService
    {
        private readonly IHttpContextAccessor _httpContextAccessor;

        public CurrentUserService(
            IHttpContextAccessor httpContextAccessor)
        {
            _httpContextAccessor = httpContextAccessor;
        }

        public bool IsAuthenticated =>
            _httpContextAccessor.HttpContext?
                .User?
                .Identity?
                .IsAuthenticated == true;

        public int PersonId
        {
            get
            {
                Claim? claim =
                    _httpContextAccessor.HttpContext?
                        .User?
                        .FindFirst(ClaimTypes.NameIdentifier);

                if (claim == null ||
                    !int.TryParse(claim.Value, out int personId))
                {
                    throw new UnauthorizedAccessException(
                        "Authenticated person ID is missing.");
                }

                return personId;
            }
        }

        public string Email
        {
            get
            {
                string? email =
                    _httpContextAccessor.HttpContext?
                        .User?
                        .FindFirst(ClaimTypes.Email)?
                        .Value;

                if (string.IsNullOrWhiteSpace(email))
                {
                    throw new UnauthorizedAccessException(
                        "Authenticated email is missing.");
                }

                return email;
            }
        }

        public string Role
        {
            get
            {
                string? role =
                    _httpContextAccessor.HttpContext?
                        .User?
                        .FindFirst(ClaimTypes.Role)?
                        .Value;

                if (string.IsNullOrWhiteSpace(role))
                {
                    throw new UnauthorizedAccessException(
                        "Authenticated role is missing.");
                }

                return role;
            }
        }

        public bool IsInRole(string role)
        {
            if (string.IsNullOrWhiteSpace(role))
            {
                return false;
            }

            return string.Equals(
                Role,
                role.Trim(),
                StringComparison.OrdinalIgnoreCase);
        }
    }
}