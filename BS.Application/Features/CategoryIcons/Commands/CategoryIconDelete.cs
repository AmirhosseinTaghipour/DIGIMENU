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

namespace BS.Application.Features.CategoryIcons.Commands
{

    public class CategoryIconDelete
    {
        public class CategoryIconDeleteCommand : IRequest<ResultDTO<string>>
        {
            public string Id { get; set; }

        }

        public class CategoryIconDeleteHandler : IRequestHandler<CategoryIconDeleteCommand, ResultDTO<string>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly IUnitOfWork _unitOfWork;
            private readonly IFileHelper _fileHelper;
            private readonly IMapper _mapper;

            public CategoryIconDeleteHandler(IUserAccessor userAccessor, IUnitOfWork unitOfWork, IMapper mapper, IFileHelper fileHelper)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _mapper = mapper;
                _fileHelper = fileHelper;
            }
            public async Task<ResultDTO<string>> Handle(CategoryIconDeleteCommand request, CancellationToken cancellationToken)
            {

                var icon = await _unitOfWork.categoryIconRepositoryAsync.GetByIdAsync(new Guid(request.Id));
                if (icon == null)
                    throw new RestException(HttpStatusCode.NotFound, "خطا، رکوردی یافت نشد");

                icon.IsDeleted = true;
                _unitOfWork.categoryIconRepositoryAsync.Update(icon);

                var iconFileRes = true;

                var iconFile = await _unitOfWork.fileRepositoryAsync.GetFirstAsync(n => n.EntityId == new Guid(request.Id) && n.EntityName == EntityName.CategoryIcon.ToString() && n.IsDeleted == false);
                if (iconFile != null)
                {
                    iconFile.IsDeleted = true;
                    _unitOfWork.fileRepositoryAsync.Update(iconFile);

                    iconFileRes = _fileHelper.DeleteFile(iconFile.Id.ToString(), System.IO.Path.GetExtension(iconFile.FileName), FileDirectorey.categoryIcon);
                }


                if (!iconFileRes)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا در حذف آیکن");

                var success = await _unitOfWork.SaveAsync() > 0;
                if (success)
                    return new ResultDTO<string>(HttpStatusCode.OK, "حذف آیکن با موفقیت انجام شد.");

                throw new RestException(HttpStatusCode.BadRequest, "خطا در عملیات حذف");

            }
        }
    }
}
