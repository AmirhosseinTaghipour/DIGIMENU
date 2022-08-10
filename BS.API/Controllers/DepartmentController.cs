using BS.Application.Common.DTOs;
using BS.Application.Features.Departments.Commands;
using BS.Application.Features.Departments.DTOs;
using BS.Application.Features.Departments.Queries;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
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

        [Authorize(Roles = "Admin")]
        [HttpGet("GetAllDepartment")]
        public async Task<ActionResult<List<ComboBoxDTO>>> GetAllDepartment()
        {
            return await Mediator.Send(new GetAllDepartment.GetAllDepartmentQuery());
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("DepartmentLoad")]
        public async Task<ActionResult<DepartmentManagementFormDTO>> DepartmentLoad(DepartmentManagementLoad.DepartmetLoadQuery query)
        {
            return await Mediator.Send(query);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("DepartmentList")]
        public async Task<ActionResult<DepartmentManagementEnvelopeDTO>> DepartmentList(DepartmentManagementList.DepartmentListQuery query)
        {
            return await Mediator.Send(query);
        }
    }
}
