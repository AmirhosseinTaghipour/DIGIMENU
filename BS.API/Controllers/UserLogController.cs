
using BS.Application.Common.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BS.Application.Features.UserLogs.Queries;
using BS.Application.Features.UserLogs.DTOs;

namespace BS.API.Controllers
{
    public class UserLogController : BaseController
    {
        [HttpPost("UserLogLoad")]
        public async Task<ActionResult<UserLogFormDTO>> UserLogLoad(UserLogLoad.UserLogLoadQuery query)
        {
            return await Mediator.Send(query);
        }

        [HttpPost("UserLogList")]
        public async Task<ActionResult<UserLogEnvelope>> UserLogList(UserLogList.UserLogListQuery query)
        {
            return await Mediator.Send(query);
        }
    }
}