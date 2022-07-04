using BS.Application.Common.DTOs;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BS.Application.Features.SMSLogs.Queries;
using BS.Application.Features.SMSLogs.DTOs;

namespace BS.API.Controllers
{
    public class SMSLogController : BaseController
    {
        [HttpPost("SMSLogLoad")]
        public async Task<ActionResult<SMSLogFormDTO>> SMSLogLoad(SMSLogLoad.SMSLogLoadQuery query)
        {
            return await Mediator.Send(query);
        }

        [HttpPost("SMSLogList")]
        public async Task<ActionResult<SMSLogEnvelope>> SMSLogList(SMSLogList.SMSLogListQuery query)
        {
            return await Mediator.Send(query);
        }
    }
}
