using AutoMapper;
using BS.Application.Common.DTOs;
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

namespace BS.Application.Features.Categories.Commands
{
    public class CategoryDelete
    {
        public class CategoryDeleteCommand : IRequest<ResultDTO<string>>
        {
            public string[] Ids { get; set; }
        }

        public class CategoryDeleteHandler : IRequestHandler<CategoryDeleteCommand, ResultDTO<string>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly IUnitOfWork _unitOfWork;
            private readonly IMapper _mapper;

            public CategoryDeleteHandler(IUserAccessor userAccessor, IUnitOfWork unitOfWork, IMapper mapper, IFileHelper fileHelper)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _mapper = mapper;
            }
            public async Task<ResultDTO<string>> Handle(CategoryDeleteCommand request, CancellationToken cancellationToken)
            {
                var user = await _userAccessor.GetUserData();
                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, "خطا، کاربری یافت نشد");

                var categoryList = await _unitOfWork.categoryRepositoryAsync.GetAsync(n => request.Ids.Contains(n.Id.ToString()));

                if (categoryList == null)
                    throw new RestException(HttpStatusCode.NotFound, "خطا، رکوردی یافت نشد");

                foreach (var item in categoryList)
                {
                    item.IsDeleted = true;
                    item.Order = 0;
                    item.UpdateDate = DateTime.Now;
                    item.UpdateUser = _userAccessor.GetCurrentUserName().ToLower();
                    _unitOfWork.categoryRepositoryAsync.Update(item);
                }

                var success = await _unitOfWork.SaveAsync() > 0;
                if (success)
                    return new ResultDTO<string>(HttpStatusCode.OK, "حذف دسته بندی با موفقیت انجام شد.");

                throw new RestException(HttpStatusCode.BadRequest, "خطا در عملیات حذف");

            }
        }
    }
}
