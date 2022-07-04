using BS.Application.Common.DTOs;
using BS.Application.Features.CategoryItems.Commands;
using BS.Application.Features.CategoryItems.DTOs;
using BS.Application.Features.CategoryItems.Queries;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using static BS.Application.Features.CategoryItems.Queries.CategoryItemList;

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

        //[HttpPost("ItemImageListManipulate")]
        //public async Task<ActionResult<ResultDTO<string>>> ItemImageListManipulate([FromForm] ItemImageListManipulate.ItemImageListManipulateCommand command)
        //{
        //    return await Mediator.Send(command);
        //}

        [HttpPost("CategoryItemLoad")]
        public async Task<ActionResult<CategoryItemFormDTO>> CategoryLoad(CategoryItemLoad.CategoryItemLoadQuery query)
        {
            return await Mediator.Send(query);
        }

        [HttpPost("CategoryItemList")]
        public async Task<ActionResult<CategoryItemEnvelope>> CategoryItemList(CategoryItemList.CategoryItemListQuery query)
        {
            return await Mediator.Send(query);
        }

        [HttpPost("CategoryItemListOrder")]
        public async Task<ActionResult<CategoryItemEnvelope>> CategoryListOrder(CategoryItemListOrder.CategoryItemListOrderCommand command)
        {
            return await Mediator.Send(command);
        }
    }
}
