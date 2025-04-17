using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using SocialMediaManager.Data;
using SocialMediaManager.Models;
using BC = BCrypt.Net.BCrypt;

namespace SocialMediaManager.Services
{
    public interface IAuthService
    {
        Task<AuthResponse> Register(RegisterRequest model);
        Task<AuthResponse> Login(LoginRequest model);
        Task<AuthResponse> CreateSubAccount(Guid parentId, SubAccountRequest model);
    }

    public class AuthService : IAuthService
    {
        private readonly ApplicationDbContext _context;
        private readonly IConfiguration _configuration;

        public AuthService(ApplicationDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<AuthResponse> Register(RegisterRequest model)
        {
            // Check if email already exists
            if (await _context.Users.AnyAsync(x => x.Email == model.Email))
                throw new ApplicationException("Email is already registered");

            // Create user entity
            var user = new User
            {
                Id = Guid.NewGuid(),
                Username = model.Username,
                Email = model.Email,
                PasswordHash = BC.HashPassword(model.Password),
                AccountType = model.AccountType
            };

            // Save to database
            await _context.Users.AddAsync(user);
            await _context.SaveChangesAsync();

            // Generate JWT token
            var token = GenerateJwtToken(user);

            // Return user info and token
            return new AuthResponse
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                AccountType = user.AccountType,
                ParentAccountId = user.ParentAccountId,
                Token = token
            };
        }

        public async Task<AuthResponse> Login(LoginRequest model)
        {
            // Find user by email
            var user = await _context.Users
                .SingleOrDefaultAsync(x => x.Email == model.Email);
            
            // Validate user exists and password is correct
            if (user == null || !BC.Verify(model.Password, user.PasswordHash))
                throw new ApplicationException("Email or password is incorrect");

            // Generate JWT token
            var token = GenerateJwtToken(user);

            // Return user info and token
            return new AuthResponse
            {
                Id = user.Id,
                Username = user.Username,
                Email = user.Email,
                AccountType = user.AccountType,
                ParentAccountId = user.ParentAccountId,
                Token = token
            };
        }

        public async Task<AuthResponse> CreateSubAccount(Guid parentId, SubAccountRequest model)
        {
            // Find parent account
            var parentAccount = await _context.Users
                .SingleOrDefaultAsync(x => x.Id == parentId && x.AccountType == "business");
            
            if (parentAccount == null)
                throw new ApplicationException("Parent account not found or not a business account");

            // Check if email already exists
            if (await _context.Users.AnyAsync(x => x.Email == model.Email))
                throw new ApplicationException("Email is already registered");

            // Create sub-account entity
            var subAccount = new User
            {
                Id = Guid.NewGuid(),
                Username = model.Username,
                Email = model.Email,
                PasswordHash = BC.HashPassword(model.Password),
                AccountType = "subaccount",
                ParentAccountId = parentId
            };

            // Save to database
            await _context.Users.AddAsync(subAccount);
            await _context.SaveChangesAsync();

            // Generate JWT token
            var token = GenerateJwtToken(subAccount);

            // Return user info and token
            return new AuthResponse
            {
                Id = subAccount.Id,
                Username = subAccount.Username,
                Email = subAccount.Email,
                AccountType = subAccount.AccountType,
                ParentAccountId = subAccount.ParentAccountId,
                Token = token
            };
        }

        private string GenerateJwtToken(User user)
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_configuration["Jwt:Secret"]);
            
            var claims = new List<Claim> 
            { 
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Email, user.Email),
                new Claim("AccountType", user.AccountType)
            };

            if (user.ParentAccountId.HasValue)
            {
                claims.Add(new Claim("ParentAccountId", user.ParentAccountId.Value.ToString()));
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(
                    new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}