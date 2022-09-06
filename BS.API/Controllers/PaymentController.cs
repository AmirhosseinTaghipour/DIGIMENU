using BS.Application.Common.DTOs;
using BS.Application.Features.Payments.Commands;
using BS.Application.Features.Payments.DTOs;
using BS.Application.Features.Payments.Queries;
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

        [Authorize(Roles = "Admin")]
        [HttpPost("PaymentList")]
        public async Task<ActionResult<PaymentEnvelope>> PaymentList(PaymentList.PaymentListQuery query)
        {
            return await Mediator.Send(query);
        }

        [HttpPost("UnitPaymentList")]
        public async Task<ActionResult<PaymentEnvelope>> UnitPaymentList(UnitPaymentList.UnitPaymentListQuery query)
        {
            return await Mediator.Send(query);
        }

        [HttpPost("Payment")]
        public async Task<ActionResult<ResultDTO<string>>> PaymentSettlement(PaymentSettlement.PaymentSettlementCommand command)
        {
            return await Mediator.Send(command);
        }

        [AllowAnonymous]
        [HttpGet("CallBackPayment")]
        public async Task CallBackPayment(string trans_id, int order_id, int amount)
        {
            await Mediator.Send(new CallBackPayment.CallBackPaymentCommand() { TransactionId = trans_id, OrderId = order_id, Amount = amount });
        }

        [HttpPost("CheckPayment")]
        public async Task<ActionResult<PaymentResultDTO>> CheckPayment(CheckPayment.CheckPaymentQuery query)
        {
            return await Mediator.Send(query);
        }
    }
}
