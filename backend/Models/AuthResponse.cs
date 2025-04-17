using System;

namespace SocialMediaManager.Models
{
    public class AuthResponse
    {
        public Guid Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string AccountType { get; set; }
        public Guid? ParentAccountId { get; set; }
        public string Token { get; set; }
    }
}