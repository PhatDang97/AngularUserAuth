using Microsoft.AspNetCore.Identity;

namespace UserAPI.Models
{
    public class ApplicationUser : IdentityUser
    {
        public string FullName { get; set; }
    }
}
