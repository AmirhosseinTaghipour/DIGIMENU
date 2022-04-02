using BPJ.LMSR.Application.Common;
using BS.Application.Features.Departments.Commands;
using BS.Application.Features.Departments.DTOs;
using BS.Application.Features.Departments.Queries;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BS.API.Controllers
{
    public class DepartmentController : BaseController
    {
        [HttpPost("DepartmentInsert")]
        public async Task<ActionResult<ResultDTO<string>>> DepartmentInsert([FromForm] DepartmentInsert.DepartmentInsertCommand command)
        {
            return await Mediator.Send(command);
        }

        [HttpPost("DepartmentUpdate")]
        public async Task<ActionResult<ResultDTO<string>>> DepartmentUpdate([FromForm] DepartmentUpdate.DepartmentUpdateCommand command)
        {
            return await Mediator.Send(command);
        }

        [HttpGet("DepartmentLoad")]
        public async Task<ActionResult<DepartmentDTO>> DepartmentLoad()
        {
            return await Mediator.Send(new DepartmentLoad.DepartmentLoadQuery());
        }

        [HttpGet("GetDepartmentById/{id}")]
        public async Task<ActionResult<ResultDTO<string>>> GetDepartmentById(string id)
        {
            return await Mediator.Send(new GetDepartmentById.GetDepartmentByIdQuery(id));
        }

        [HttpPost("GetAllDepartment")]
        public async Task<ActionResult<ResultDTO<string>>> GetAllDepartment(GetAllDepartment.GetAllDepartmentQuery command)
        {
            return await Mediator.Send(command);
        }
    }
}
