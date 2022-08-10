using BS.Application.Common.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Application.Features.Departments.DTOs
{
    public class DepartmentManagementFormDTO
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Address { get; set; }
        public string PostalCode { get; set; }
        public string Phone { get; set; }
        public bool IsActivated { get; set; }
        public bool IsUpdateMode { get; set; } = false;
    }
}