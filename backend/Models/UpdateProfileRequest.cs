using System.ComponentModel.DataAnnotations;

namespace SocialMediaManager.Models
{
    public class UpdateProfileRequest
    {
        [StringLength(50, MinimumLength = 3)]
        public string Username { get; set; }
        
    }
}