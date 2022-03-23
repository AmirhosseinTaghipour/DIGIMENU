using BS.Application.Features.Main.DTOs;
using BS.Application.Features.Main.Queries;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BS.API.Controllers
{
    public class MainController : BaseController
    {
        [HttpGet("GetAppMenu")]
        public async Task<ActionResult<List<AppMenuDTO>>> GetAppMenu()
        {
            return await Mediator.Send(new AppMenu.AppMenuQuery());
        }
    }
}
