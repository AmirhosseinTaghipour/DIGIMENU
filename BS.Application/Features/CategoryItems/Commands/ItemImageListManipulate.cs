using AutoMapper;
using BS.Application.Common.DTOs;
using BS.Application.Common.Enums;
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

namespace BS.Application.Features.CategoryItems.Commands
{
    public class ItemImageListManipulate
    {
        public class ItemImageListManipulateCommand : IRequest<ResultDTO<string>>
        {
            public string EntityId { get; set; }
            public List<FileDTO> FileList { get; set; }
        }

        public class ItemImageListManipulateHandler : IRequestHandler<ItemImageListManipulateCommand, ResultDTO<string>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly IUnitOfWork _unitOfWork;
            private readonly IFileHelper _fileHelper;
            private readonly IMapper _mapper;

            public ItemImageListManipulateHandler(IUserAccessor userAccessor, IUnitOfWork unitOfWork, IMapper mapper, IFileHelper fileHelper)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _mapper = mapper;
                _fileHelper = fileHelper;
            }
            public async Task<ResultDTO<string>> Handle(ItemImageListManipulateCommand request, CancellationToken cancellationToken)
            {


                if (string.IsNullOrEmpty(request.EntityId))
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، فیلد ضروری نمیتواند خالی باشد.");


                var user = await _userAccessor.GetUserData();
                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, "خطا، کاربری یافت نشد");

                var categoryItem = await _unitOfWork.categoryItemRepositoryAsync.GetFirstAsync(n => n.Id == new Guid(request.EntityId) && n.DepartmentId == user.DepartmentId! && n.IsDeleted == false);
                if (categoryItem == null)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، رکورد مورد نظر یافت نشد.");

                var ItemFileList = await _unitOfWork.fileRepositoryAsync.GetAsync(n => n.EntityId == categoryItem.Id && n.EntityName == EntityName.CategoryItem.ToString() && n.IsDeleted == false);

                foreach (var item in ItemFileList)
                {
                    item.IsDeleted = true;
                    item.UpdateDate = DateTime.Now;
                    item.UpdateUser = _userAccessor.GetCurrentUserName().ToLower();
                    _unitOfWork.fileRepositoryAsync.Update(item);
                    
                    //todo: delete file in directory
                }

                //todo: delete file to directory

                bool success = true;


                success = await _unitOfWork.SaveAsync() > 0;
                if (success)
                    return new ResultDTO<string>(HttpStatusCode.OK, "اطلاعات آیتم موفقیت ثیت شد.");

                throw new RestException(HttpStatusCode.BadRequest, "خطا در عملیات ثبت");

            }
        }
    }
}
