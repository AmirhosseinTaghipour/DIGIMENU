using BS.Application.Common.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Application.Features.Users.DTOs
{
    public class UserManagementFormDTO
    {
        public string Id { get; set; }
        public string Name { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string DepartmentId { get; set; }
        public string RoleId { get; set; }
        public string Mobile { get; set; }
        public bool IsActivated { get; set; }
        public bool IsUpdateMode { get; set; } = false;
    }
}