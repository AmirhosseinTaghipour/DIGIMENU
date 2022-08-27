using BS.Application.Common.DTOs;
using BS.Application.Features.Payments.Commands;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BS.API.Controllers
{
    public class PaymentController : BaseController
    {
        [HttpPost("PaymentInsert")]
        public async Task<ActionResult<ResultDTO<string>>> PaymentInsert(PaymentInsert.PaymentInsertCommand command)
        {
            return await Mediator.Send(command);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("PaymentUpdate")]
        public async Task<ActionResult<ResultDTO<string>>> PaymentUpdate(PaymentUpdate.PaymentUpdateCommand command)
        {
            return await Mediator.Send(command);
        }

        //[HttpPost("PaymentList")]
        //public async Task<ActionResult<SMSLogEnvelope>> PaymentList(SMSLogList.SMSLogListQuery query)
        //{
        //    return await Mediator.Send(query);
        //}
    }
}
