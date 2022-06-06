using BS.Application.Common.DTOs;
using BS.Application.Features.CategoryItems.Commands;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BS.API.Controllers
{
    public class CategoryItemController : BaseController
    {
        [HttpPost("CategoryItemInsert")]
        public async Task<ActionResult<ResultDTO<string>>> CategoryItemInsert(CategoryItemInsert.CategoryItemInsertCommand command)
        {
            return await Mediator.Send(command);
        }

        [HttpPost("CategoryItemUpdate")]
        public async Task<ActionResult<ResultDTO<string>>> CategoryItemUpdate(CategoryItemUpdate.CategoryItemUpdateCommand command)
        {
            return await Mediator.Send(command);
        }

        [HttpPost("CategoryItemDelete")]
        public async Task<ActionResult<ResultDTO<string>>> CategoryItemDelete(CategoryItemDelete.CategoryItemDeleteCommand command)
        {
            return await Mediator.Send(command);
        }

        [HttpPost("ItemImageListManipulate")]
        public async Task<ActionResult<ResultDTO<string>>> ItemImageListManipulate([FromForm] ItemImageListManipulate.ItemImageListManipulateCommand command)
        {
            return await Mediator.Send(command);
        }

        //[HttpPost("CategoryItemLoad")]
        //public async Task<ActionResult<CategoryFormDTO>> CategoryLoad(CategoryItemLoad.CategoryItemLoadQuery query)
        //{
        //    return await Mediator.Send(query);
        //}

        //[HttpPost("CategoryItemList")]
        //public async Task<ActionResult<Application.Features.Categories.Queries.CategoryList.CategoryEnvelope>> CategoryList(CategoryItemList.CategoryItemListQuery query)
        //{
        //    return await Mediator.Send(query);
        //}

        //[HttpPost("CategoryItemListOrder")]
        //public async Task<ActionResult<Application.Features.Categories.Commands.CategoryListOrder.CategoryEnvelope>> CategoryListOrder(CategoryItemListOrder.CategoryItemListOrderQuery query)
        //{
        //    return await Mediator.Send(query);
        //}
    }
}
