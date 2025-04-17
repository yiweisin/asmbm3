using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace SocialMediaManager.Models
{
    public class User
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [StringLength(50)]
        public string Username { get; set; }

        [Required]
        [EmailAddress]
        public string Email { get; set; }

        [Required]
        public string PasswordHash { get; set; }

        [Required]
        public string AccountType { get; set; } // "individual", "business", or "subaccount"

        // For business sub-accounts only
        public Guid? ParentAccountId { get; set; }
        
        [JsonIgnore]
        public User ParentAccount { get; set; }

        [JsonIgnore]
        public List<User> SubAccounts { get; set; }

        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
    }
}
