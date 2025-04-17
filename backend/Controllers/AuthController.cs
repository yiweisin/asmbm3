using System;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SocialMediaManager.Models;
using SocialMediaManager.Services;

namespace SocialMediaManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterRequest model)
        {
            try
            {
                // Validate model
                if (model.AccountType != "individual" && model.AccountType != "business")
                {
                    return BadRequest(new { message = "Invalid account type" });
                }

                var response = await _authService.Register(model);
                return Ok(response);
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login(LoginRequest model)
        {
            try
            {
                var response = await _authService.Login(model);
                return Ok(response);
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [Authorize]
        [HttpPost("create-subaccount")]
        public async Task<IActionResult> CreateSubAccount(SubAccountRequest model)
        {
            try
            {
                // Check if current user is a business account
                var userType = User.FindFirst("AccountType")?.Value;
                if (userType != "business")
                {
                    return Forbid();
                }

                // Get current user ID
                var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
                if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var parentId))
                {
                    return Unauthorized();
                }

                var response = await _authService.CreateSubAccount(parentId, model);
                return Ok(response);
            }
            catch (ApplicationException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}