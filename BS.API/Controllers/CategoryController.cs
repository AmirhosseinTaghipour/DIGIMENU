using BS.Application.Common.DTOs;
using BS.Application.Features.Categories.Commands;
using BS.Application.Features.Categories.DTOs;
using BS.Application.Features.Categories.Queries;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BS.API.Controllers
{
    public class CategoryController : BaseController
    {
        [HttpPost("CategoryInsert")]
        public async Task<ActionResult<ResultDTO<string>>> CategoryInsert(CategoryInsert.CategoryInsertCommand command)
        {
            return await Mediator.Send(command);
        }

        [HttpPost("CategoryUpdate")]
        public async Task<ActionResult<ResultDTO<string>>> CategoryUpdate(CategoryUpdate.CategoryUpdateCommand command)
        {
            return await Mediator.Send(command);
        }

        [HttpPost("CategoryDelete")]
        public async Task<ActionResult<ResultDTO<string>>> CategoryDelete(CategoryDelete.CategoryDeleteCommand command)
        {
            return await Mediator.Send(command);
        }

        [HttpGet("CategoryLoad/{id}")]
        public async Task<ActionResult<CategoryDTO>> CategoryLoad(string id)
        {
            return await Mediator.Send(new CategoryLoad.CategoryLoadQuery(id));
        }

        [HttpGet("CategoryList")]
        public async Task<ActionResult<CategoryEnvelopeDTO>> CategoryList()
        {
            return await Mediator.Send(new CategoryList.CategoryListQuery);
        }
    }
}
