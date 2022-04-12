using AutoMapper;
using BS.Application.Common.Models;
using BS.Application.Features.Categories.DTOs;
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

namespace BS.Application.Features.Categories.Queries
{
    public class CategoryLoad
    {
        public class CategoryLoadQuery : IRequest<CategoryDTO>
        {
            public CategoryLoadQuery(string id)
            {
                Id = id;
            }
            public string Id { get; set; }
        }

        public class CategoryHandLer : IRequestHandler<CategoryLoadQuery, CategoryDTO>
        {
            private readonly IUnitOfWork _unitOfWork;
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;
            private readonly IFileHelper _fileHelper;

            public CategoryHandLer(IUnitOfWork unitOfWork, IUserAccessor userAccessor, IMapper mapper, IFileHelper fileHelper)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _fileHelper = fileHelper;
                _mapper = mapper;
            }
            public async Task<CategoryDTO> Handle(CategoryLoadQuery request, CancellationToken cancellationToken)
            {


                if (request.Id == null)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، رکوردی انتخاب نشده است...");


                var category = _mapper.Map<CategoryDTO>( await _unitOfWork.categoryRepositoryAsync.GetByIdAsync(new Guid(request.Id)));
                category.IsUpdateMode= true;

                return category;

            }
        }
    }
}
