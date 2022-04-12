using AutoMapper;
using BS.Application.Common.DTOs;
using BS.Application.Common.Enums;
using BS.Application.Common.Models;
using BS.Application.Features.Departments.DTOs;
using BS.Application.Features.Menus.DTOs;
using BS.Application.Interfaces;
using BS.Application.Interfaces.Repositories;
using BS.Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace BS.Application.Features.Menus.Commands
{
    public class MenuUpdate
    {
        public class MenuUpdateCommand : MenuDTO, IRequest<ResultDTO<string>>
        {

        }

        public class MenuUpdateHandler : IRequestHandler<MenuUpdateCommand, ResultDTO<string>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly IUnitOfWork _unitOfWork;
            private readonly IMapper _mapper;

            public MenuUpdateHandler(IUserAccessor userAccessor, IUnitOfWork unitOfWork, IMapper mapper, IFileHelper fileHelper)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _mapper = mapper;
            }
            public async Task<ResultDTO<string>> Handle(MenuUpdateCommand request, CancellationToken cancellationToken)
            {
                if (request.IsUpdateMode == false)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، مود اینزرت...");

                if (string.IsNullOrEmpty(request.Id))
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، مود اینزرت...");

                var user = await _userAccessor.GetUserData();
                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, "خطا، کاربری یافت نشد");

                if (user.DepartmentId == null)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، اطلاعات مجموعه وارد نشده است...");

                var isExistMenu = _unitOfWork.menuRepositoryAsync.Any(n => n.DepartmentId == user.DepartmentId! && n.IsDeleted==false);
                if (!isExistMenu)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، مود اینزرت...");



                var menu = await _unitOfWork.menuRepositoryAsync.GetByIdAsync( new Guid(request.Id));
                menu.UpdateDate = DateTime.Now;
                menu.UpdateUser = _userAccessor.GetCurrentUserName().ToLower();
                _unitOfWork.menuRepositoryAsync.Update(menu);

                    var success = await _unitOfWork.SaveAsync() > 0;
                    if (success)
                        return new ResultDTO<string>(HttpStatusCode.OK, "اطلاعات منو با موفقیت ثیت شد.");
                
                

                throw new RestException(HttpStatusCode.BadRequest, "خطا در عملیات ویرایش");

            }
        }
    }
}
