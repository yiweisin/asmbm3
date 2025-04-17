using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using SocialMediaManager.Data;
using SocialMediaManager.Models;

namespace SocialMediaManager.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class AccountsController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AccountsController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetCurrentAccount()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var id))
            {
                return Unauthorized();
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            return Ok(new
            {
                user.Id,
                user.Username,
                user.Email,
                user.AccountType,
                user.ParentAccountId,
                user.CreatedAt,
                user.UpdatedAt
            });
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAccountById(Guid id)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(currentUserId) || !Guid.TryParse(currentUserId, out var currentId))
            {
                return Unauthorized();
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            // Security check: Only allow access to your own account, your parent account, or your sub-accounts
            var currentUser = await _context.Users.FindAsync(currentId);
            if (currentUser == null)
            {
                return Unauthorized();
            }

            bool hasAccess = 
                id == currentId || // Own account
                currentUser.ParentAccountId == id || // Parent account
                (currentUser.AccountType == "business" && user.ParentAccountId == currentId); // Sub-account

            if (!hasAccess)
            {
                return Forbid();
            }

            return Ok(new
            {
                user.Id,
                user.Username,
                user.Email,
                user.AccountType,
                user.ParentAccountId,
                user.CreatedAt,
                user.UpdatedAt
            });
        }

        [HttpGet("subaccounts")]
        public async Task<IActionResult> GetSubAccounts()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var id))
            {
                return Unauthorized();
            }

            // Check if current user is a business account
            var currentUser = await _context.Users.FindAsync(id);
            if (currentUser == null || currentUser.AccountType != "business")
            {
                return Forbid();
            }

            var subAccounts = await _context.Users
                .Where(u => u.ParentAccountId == id)
                .Select(u => new
                {
                    u.Id,
                    u.Username,
                    u.Email,
                    u.AccountType,
                    u.ParentAccountId,
                    u.CreatedAt,
                    u.UpdatedAt
                })
                .ToListAsync();

            return Ok(subAccounts);
        }

        [HttpPut("update-profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest model)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var id))
            {
                return Unauthorized();
            }

            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            // Update fields
            if (!string.IsNullOrWhiteSpace(model.Username))
            {
                user.Username = model.Username;
            }

            user.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();

            return Ok(new
            {
                user.Id,
                user.Username,
                user.Email,
                user.AccountType,
                user.ParentAccountId,
                user.CreatedAt,
                user.UpdatedAt
            });
        }

        [HttpDelete("subaccount/{id}")]
        public async Task<IActionResult> DeleteSubAccount(Guid id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !Guid.TryParse(userId, out var currentId))
            {
                return Unauthorized();
            }

            // Check if current user is a business account
            var currentUser = await _context.Users.FindAsync(currentId);
            if (currentUser == null || currentUser.AccountType != "business")
            {
                return Forbid();
            }

            // Get sub-account
            var subAccount = await _context.Users.FindAsync(id);
            if (subAccount == null || subAccount.ParentAccountId != currentId)
            {
                return NotFound();
            }

            // Delete sub-account
            _context.Users.Remove(subAccount);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}