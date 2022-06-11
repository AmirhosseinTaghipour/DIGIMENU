using AutoMapper;
using BS.Application.Common.DTOs;
using BS.Application.Common.Enums;
using BS.Application.Common.Models;
using BS.Application.Interfaces;
using BS.Application.Interfaces.Repositories;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BS.Application.Features.CategoryItems.Commands
{

    public class CategoryItemDelete
    {
        public class CategoryItemDeleteCommand : IRequest<ResultDTO<string>>
        {
            public string[] Ids { get; set; }

        }

        public class CategoryItemDeleteHandler : IRequestHandler<CategoryItemDeleteCommand, ResultDTO<string>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly IUnitOfWork _unitOfWork;
            private readonly IFileHelper _fileHelper;
            private readonly IMapper _mapper;

            public CategoryItemDeleteHandler(IUserAccessor userAccessor, IUnitOfWork unitOfWork, IMapper mapper, IFileHelper fileHelper)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _mapper = mapper;
                _fileHelper = fileHelper;
            }
            public async Task<ResultDTO<string>> Handle(CategoryItemDeleteCommand request, CancellationToken cancellationToken)
            {
                var categoryItemList = await _unitOfWork.categoryItemRepositoryAsync.GetAsync(n => request.Ids.Contains(n.Id.ToString()));

                if (categoryItemList == null)
                    throw new RestException(HttpStatusCode.NotFound, "خطا، رکوردی یافت نشد");

                foreach (var categoryItem in categoryItemList)
                {
                    categoryItem.IsDeleted = true;
                    categoryItem.UpdateDate = DateTime.Now;
                    categoryItem.UpdateUser = _userAccessor.GetCurrentUserName().ToLower();
                    _unitOfWork.categoryItemRepositoryAsync.Update(categoryItem);
                }

                var success = await _unitOfWork.SaveAsync() > 0;
                if (success)
                    return new ResultDTO<string>(HttpStatusCode.OK, "حذف آیتم با موفقیت انجام شد.");

                throw new RestException(HttpStatusCode.BadRequest, "خطا در عملیات حذف");

            }
        }
    }
}
