using AutoMapper;
using BS.Application.Common.Models;
using BS.Application.Features.Users.DTOs;
using BS.Application.Interfaces;
using BS.Application.Interfaces.Repositories;
using BS.Domain.Entities;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BS.Application.Features.Users.Queries
{
    public class UserLoad
    {
        public class UserLoadQuery : IRequest<UserManagementFormDTO>
        {
            public string Id { get; set; }
        }

        public class UserLoadHandLer : IRequestHandler<UserLoadQuery, UserManagementFormDTO>
        {
            private readonly IUnitOfWork _unitOfWork;
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;
            private readonly IFileHelper _fileHelper;

            public UserLoadHandLer(IUnitOfWork unitOfWork, IUserAccessor userAccessor, IMapper mapper, IFileHelper fileHelper)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _fileHelper = fileHelper;
                _mapper = mapper;
            }
            public async Task<UserManagementFormDTO> Handle(UserLoadQuery request, CancellationToken cancellationToken)
            {
                if (request.Id == null)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، رکوردی انتخاب نشده است...");


                var category = _mapper.Map<UserManagementFormDTO>(await _unitOfWork.userRepositoryAsync.GetByIdAsync(new Guid(request.Id)));
                category.IsUpdateMode = true;
                category.Password = null;

                return category;

            }
        }
    }
}
