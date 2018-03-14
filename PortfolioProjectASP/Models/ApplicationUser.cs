using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;
using Portfolio_Project.Data;

namespace Portfolio_Project.Models
{
    // Add profile data for application users by adding properties to the ApplicationUser class
    public class ApplicationUser : IdentityUser
    {
        //refer to the child table (even though 1 to 1, so sibling?)
        public virtual UserDetails UserDetails { get; set; }
      
    }
}
