using Microsoft.AspNetCore.Mvc;
using BS.Application.Features.Main.DTOs;
using BS.Application.Features.Main.Queries;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BS.Application.Features.Files.Commands;
using BS.Application.Common.DTOs;
using BS.Application.Features.Files.Queries;
using BS.Application.Features.Files.DTOs;

namespace BS.API.Controllers
{
    public class FileController : BaseController
    {
        [HttpPost("FileInsert")]
        public async Task<ActionResult<ResultDTO<string>>> FileInsert([FromForm] FileInsert.FileInsertCommand command)
        {
            return await Mediator.Send(command);
        }

        [HttpPost("FileUpdate")]
        public async Task<ActionResult<ResultDTO<string>>> FileUpdate([FromForm] FileUpdate.FileUpdateCommand command)
        {
            return await Mediator.Send(command);
        }


        [HttpPost("FileDelete")]
        public async Task<ActionResult<ResultDTO<string>>> FileDelete(FileDelete.FileDeleteCommand command)
        {
            return await Mediator.Send(command);
        }

        [HttpPost("FileList")]
        public async Task<ActionResult<FileList.FileListEnvelope>> FileList(FileList.FileListQuery query)
        {
            return await Mediator.Send(query);
        }

        [HttpPost("FileLoad")]
        public async Task<ActionResult<FileFormDTO>> FileLoad(FileLoad.FileLoadQuery query)
        {
            return await Mediator.Send(query);
        }
    }
}

