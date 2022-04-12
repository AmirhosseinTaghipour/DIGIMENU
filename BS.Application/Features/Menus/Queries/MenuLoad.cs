using AutoMapper;
using BS.Application.Common.Models;
using BS.Application.Features.Menus.DTOs;
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

namespace BS.Application.Features.Menus.Queries
{
    public class MenuLoad
    {
        public class MenuLoadQuery : IRequest<MenuDTO>
        {

        }

        public class MenuLoadHandLer : IRequestHandler<MenuLoadQuery, MenuDTO>
        {
            private readonly IUnitOfWork _unitOfWork;
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;
            private readonly IFileHelper _fileHelper;

            public MenuLoadHandLer(IUnitOfWork unitOfWork, IUserAccessor userAccessor, IMapper mapper, IFileHelper fileHelper)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _fileHelper = fileHelper;
                _mapper = mapper;
            }
            public async Task<MenuDTO> Handle(MenuLoadQuery request, CancellationToken cancellationToken)
            {
                var user = await _userAccessor.GetUserData();
                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, "خطا، کاربری یافت نشد");

                if (user.DepartmentId == null)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، اطلاعات مجموعه وارد نشده است...");

                var isExistMenu = _unitOfWork.menuRepositoryAsync.Any(n => n.DepartmentId == user.DepartmentId! && n.IsDeleted==false);
                if (!isExistMenu)
                    return new MenuDTO();


                var menu = _mapper.Map<MenuDTO>(await _unitOfWork.menuRepositoryAsync.GetFirstAsync(n=> n.DepartmentId==user.DepartmentId && n.IsDeleted==false));
                menu.IsUpdateMode = true;

                return menu;

            }
        }
    }
}
