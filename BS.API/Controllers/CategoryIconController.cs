using BS.Application.Common.DTOs;
using BS.Application.Common.Enums;
using BS.Application.Features.CategoryIcons.Commands;
using BS.Application.Features.CategoryIcons.DTOs;
using BS.Application.Features.CategoryIcons.Queries;
//using BS.Application.Features.CategoryIcons.DTOs;
//using BS.Application.Features.CategoryIcons.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static BS.Application.Features.CategoryIcons.Queries.CategoryIconList;

namespace BS.API.Controllers
{
    public class CategoryIconController : BaseController
    {
        [Authorize(Roles = "Admin")]
        [HttpPost("CategoryIconInsert")]
        public async Task<ActionResult<ResultDTO<string>>> CategoryIconInsert([FromForm] CategoryIconInsert.CategoryIconInsertCommand command)
        {
            return await Mediator.Send(command);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("CategoryIconUpdate")]
        public async Task<ActionResult<ResultDTO<string>>> CategoryIconUpdate([FromForm] CategoryIconUpdate.CategoryIconUpdateCommand command)
        {
            return await Mediator.Send(command);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("CategoryIconDelete")]
        public async Task<ActionResult<ResultDTO<string>>> CategoryIconDelete(CategoryIconDelete.CategoryIconDeleteCommand command)
        {
            return await Mediator.Send(command);
        }

        [HttpPost("CategoryIconList")]
        public async Task<ActionResult<CategoryIconEnvelope>> CategoryIconList(CategoryIconList.CategoryIconListQuery query )
        {
            return await Mediator.Send(query);
        }


        [HttpPost("CategoryIcon")]
        public async Task<ActionResult<CategoryIconFormDTO>> CategoryIcon(CategoryIcon.CategoryIconQuery query)
        {
            return await Mediator.Send(query);
        }

        
    }

}
