﻿using BS.Application.Common.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Application.Features.Users.DTOs
{
    public class DepartmentUserListItemDTO
    {
        public string Id { get; set; }
        public string Key { get; set; }
        public string Name { get; set; }
        public string UserName { get; set; }
        public string Mobile { get; set; }
        public bool IsActivated { get; set; }
    }
}