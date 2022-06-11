using Microsoft.AspNetCore.Mvc;
using BS.Application.Features.Main.DTOs;
using BS.Application.Features.Main.Queries;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BS.API.Controllers
{
    public class FileController : BaseController
    {
        [HttpPost("FileInsert")]
        public async Task<ActionResult<List<AppMenuDTO>>> FileInsert()
        {
            return await Mediator.Send(new AppMenu.AppMenuQuery());
        }

        [HttpPost("FileUpdate")]
        public async Task<ActionResult<List<AppMenuDTO>>> FileUpdate()
        {
            return await Mediator.Send(new AppMenu.AppMenuQuery());
        }

        [HttpPost("FileDelete")]
        public async Task<ActionResult<List<AppMenuDTO>>> FileDelete()
        {
            return await Mediator.Send(new AppMenu.AppMenuQuery());
        }

        [HttpPost("FileList")]
        public async Task<ActionResult<List<AppMenuDTO>>> FileList()
        {
            return await Mediator.Send(new AppMenu.AppMenuQuery());
        }

        [HttpPost("FileLoad")]
        public async Task<ActionResult<List<AppMenuDTO>>> FileLoad()
        {
            return await Mediator.Send(new AppMenu.AppMenuQuery());
        }
    }
}

