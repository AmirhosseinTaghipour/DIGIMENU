using AutoMapper;
using BS.Application.Common.Models;
using BS.Application.Features.CategoryItems.DTOs;
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

namespace BS.Application.Features.CategoryItems.Queries
{
    public class CategoryItemLoad
    {
        public class CategoryItemLoadQuery : IRequest<CategoryItemFormDTO>
        {
            public string Id { get; set; }
        }

        public class CategoryItemHandLer : IRequestHandler<CategoryItemLoadQuery, CategoryItemFormDTO>
        {
            private readonly IUnitOfWork _unitOfWork;
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;
            private readonly IFileHelper _fileHelper;

            public CategoryItemHandLer(IUnitOfWork unitOfWork, IUserAccessor userAccessor, IMapper mapper, IFileHelper fileHelper)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _fileHelper = fileHelper;
                _mapper = mapper;
            }

            public async Task<CategoryItemFormDTO> Handle(CategoryItemLoadQuery request, CancellationToken cancellationToken)
            {
                if (request.Id == null)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، رکوردی انتخاب نشده است...");


                var category = _mapper.Map<CategoryItemFormDTO>(await _unitOfWork.categoryItemRepositoryAsync.GetByIdAsync(new Guid(request.Id)));
                category.IsUpdateMode = true;

                return category;

            }
        }
    }
}
