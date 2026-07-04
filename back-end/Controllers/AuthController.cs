using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using back_end.DTO.Auth;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.IdentityModel.Tokens;

namespace back_end.Controllers
{
    [ApiController]
    [Route("api/auth")]
    public class AuthController : ControllerBase
    {
        private readonly IConfiguration _config;
        private readonly PasswordHasher<object> _hasher = new();

        public AuthController(IConfiguration config)
        {
            _config = config;
        }

        [EnableRateLimiting("admin-write")]
        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto dto)
        {
            var adminUsername = _config["Admin:Username"];
            var adminPasswordHash = _config["Admin:PasswordHash"];

            if (string.IsNullOrEmpty(adminUsername) || string.IsNullOrEmpty(adminPasswordHash))
                return StatusCode(500, new { message = "Admin account is not configured" });

            if (!string.Equals(dto.Username, adminUsername, StringComparison.Ordinal))
                return Unauthorized(new { message = "Invalid username or password" });

            var verifyResult = _hasher.VerifyHashedPassword(new object(), adminPasswordHash, dto.Password);

            if (verifyResult == PasswordVerificationResult.Failed)
                return Unauthorized(new { message = "Invalid username or password" });

            var jwtSecret = _config["Jwt:Secret"];

            if (string.IsNullOrEmpty(jwtSecret))
                return StatusCode(500, new { message = "JWT is not configured" });

            var expiresAt = DateTime.UtcNow.AddHours(8);

            var claims = new[]
            {
                new Claim(ClaimTypes.Name, adminUsername),
                new Claim(ClaimTypes.Role, "Admin"),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: expiresAt,
                signingCredentials: creds
            );

            return Ok(new
            {
                message = "Login successful",
                data = new LoginResponseDto
                {
                    Token = new JwtSecurityTokenHandler().WriteToken(token),
                    ExpiresAt = expiresAt
                }
            });
        }
    }
}
