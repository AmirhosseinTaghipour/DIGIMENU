using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Application.Features.Users.DTOs
{
    public class CurrentUserDTO
    {
        public string UserId { get; set; }
        public string UserName { get; set; }
        public string UserTitle { get; set; }
        public string DepartmentId { get; set; }
        public string DepartmentName { get; set; }
        public string RoleId { get; set; }
        public string RoleCode { get; set; }
        public string RoleTitle { get; set; }
    }
}
