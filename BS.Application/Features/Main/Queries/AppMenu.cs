using BS.Application.Common.Models;
using BS.Application.Features.Main.DTOs;
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

namespace BS.Application.Features.Main.Queries
{
    public class AppMenu
    {
        public class AppMenuQuery : IRequest<List<AppMenuDTO>>
        {
        }

        public class AppMenuHandler : IRequestHandler<AppMenuQuery, List<AppMenuDTO>>
        {
            private readonly IUnitOfWork _unitOfWork;
            private readonly IUserAccessor _userAccessor;
            private readonly IDataHelper _dataHelper;

            public AppMenuHandler(IUnitOfWork unitOfWork, IUserAccessor userAccessor, IDataHelper dataHelper)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _dataHelper = dataHelper;
            }

            public async Task<List<AppMenuDTO>> Handle(AppMenuQuery request, CancellationToken cancellationToken)
            {
                var roleId = _userAccessor.GetCurrentRoleId();
                if (_dataHelper.isSQL_Injection(roleId.ToString()))
                    throw new RestException(HttpStatusCode.BadRequest);
                try
                {

                    var AppMenueList = await (from appMenuTable in _unitOfWork.appMenuRepositoryAsync.Query()
                                              join appMenuRoleTable in _unitOfWork.appMenuRoleRepositoryAsync.Query() on appMenuTable.Id equals appMenuRoleTable.AppMenusId
                                              where appMenuTable.IsActived == true && appMenuTable.IsDeleted == false && appMenuRoleTable.RolesId == roleId
                                              orderby appMenuTable.MenuOrder ascending
                                              select new AppMenuDTO {
                                                  MenuId = appMenuTable.Id.ToString().ToLower(),
                                                  MenuCode = appMenuTable.MenuCode,
                                                  MenuTitle = appMenuTable.MenuTitle 
                                              })
                                              .AsNoTracking()
                                              .ToListAsync();
                    return AppMenueList;
                }
                catch (Exception ex)
                {
                    throw new RestException(HttpStatusCode.BadRequest, ex.Message);

                }
            }
        }
    }
}
