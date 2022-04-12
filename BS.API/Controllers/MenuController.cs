using BS.Application.Common.DTOs;
using BS.Application.Features.Menus.Commands;
using BS.Application.Features.Menus.DTOs;
using BS.Application.Features.Menus.Queries;
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

        [HttpGet("MenuLoad")]
        public async Task<ActionResult<MenuDTO>> MenuLoad()
        {
            return await Mediator.Send(new MenuLoad.MenuLoadQuery());
        }
    }
}
