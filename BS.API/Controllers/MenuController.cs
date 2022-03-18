using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BS.API.Controllers
{
    public class MenuController : BaseController
    {
        [ApiExplorerSettings(IgnoreApi = true)]
        public IActionResult Index()
        {
            return Ok();
        }
    }
}
