using BS.Application.Common.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System;
using BS.Application.Features.Roles.Queries;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BS.API.Controllers
{
    public class RoleController : BaseController
    {
        [HttpGet("GetAllRole")]
        public async Task<ActionResult<List<ComboBoxDTO>>> GetAllRole()
        {
            return await Mediator.Send(new GetAllRole.GetAllRoleQuery());
        }
    }
}
