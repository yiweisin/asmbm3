using System.ComponentModel.DataAnnotations;

namespace SocialMediaManager.Models
{
    public class UpdateProfileRequest
    {
        [StringLength(50, MinimumLength = 3)]
        public string Username { get; set; }
        
        // Add any other profile fields you want to be updatable
        // For example:
        // public string DisplayName { get; set; }
        // public string Bio { get; set; }
        // public string ProfileImageUrl { get; set; }
    }
}