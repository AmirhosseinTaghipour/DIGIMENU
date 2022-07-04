using AutoMapper;
using BS.Application.Common.Models;
using BS.Application.Interfaces;
using BS.Application.Interfaces.Repositories;
using MediatR;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using System.Linq.Dynamic.Core;
using BS.Application.Common.DTOs;
using BS.Application.Common.Enums;

namespace BS.Application.Features.Roles.Queries
{
    public class GetAllRole
    {
        public class GetAllRoleQuery : IRequest<List<ComboBoxDTO>>
        {

        }

        public class GetAllRoleHandLer : IRequestHandler<GetAllRoleQuery, List<ComboBoxDTO>>
        {
            private readonly IUnitOfWork _unitOfWork;
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;
            private readonly IFileHelper _fileHelper;
            private readonly IAdjustChar _adjustChar;
            public GetAllRoleHandLer(IUnitOfWork unitOfWork, IUserAccessor userAccessor, IMapper mapper, IFileHelper fileHelper, IAdjustChar adjustChar)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _fileHelper = fileHelper;
                _mapper = mapper;
                _adjustChar = adjustChar;
            }
            public async Task<List<ComboBoxDTO>> Handle(GetAllRoleQuery request, CancellationToken cancellationToken)
            {
                var user = await _userAccessor.GetUserData();
                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, "خطا، کاربری یافت نشد");

                var result = await _unitOfWork.roleRepositoryAsync.GetAsync(n => n.IsDeleted == false && n.IsActived == true, n => n.OrderByDescending(x => x.Title), n => new ComboBoxDTO { Key = n.Id.ToString().ToLower(), Value = n.Title });
                return result.ToList();
            }
        }
    }
}
