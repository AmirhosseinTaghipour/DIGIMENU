using BS.Application.Common.DTOs;
using BS.Application.Features.Menus.Commands;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BS.API.Controllers
{
    public class MenuController : BaseController
    {
        [HttpPost("MenuInsert")]
        public async Task<ActionResult<ResultDTO<string>>> MenuInsert(MenuInsert.MenuInsertCommand command)
        {
            return await Mediator.Send(command);
        }

        [HttpPost("MenuUpdate")]
        public async Task<ActionResult<ResultDTO<string>>> MenuUpdate(MenuUpdate.MenuUpdateCommand command)
        {
            return await Mediator.Send(command);
        }

        //[HttpGet("DepartmentLoad")]
        //public async Task<ActionResult<DepartmentDTO>> DepartmentLoad()
        //{
        //    return await Mediator.Send(new DepartmentLoad.DepartmentLoadQuery());
        //}
    }
}
