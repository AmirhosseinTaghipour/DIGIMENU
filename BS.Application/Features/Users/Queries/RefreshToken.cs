using BS.Application.Interfaces;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using BS.Application.Interfaces.Repositories;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using BS.Application.Features.Users.DTOs;
using BS.Application.Common.Models;

namespace BS.Application.Features.Users.Queries
{
    public class RefreshToken
    {

        public class RefreshTokenQuery : IRequest<RefreshTokenDTO>
        {
            public string RefreshToken { get; set; }
        }

        public class RefreshTokenHandler : IRequestHandler<RefreshTokenQuery, RefreshTokenDTO>
        {
            private readonly IUnitOfWork _unitOfWork;
            private readonly IUserAccessor _userAccessor;
            private readonly IDataHelper _dataHelper;
            private readonly IRefreshJwtToken _refreshJwtToken;
            private readonly IJwtGenerator _jwtGenerator;


            public RefreshTokenHandler(IUserAccessor userAccessor, IRefreshJwtToken refreshJwtToken, IDataHelper dataHelper, IJwtGenerator jwtGenerator, IUnitOfWork unitOfWork)
            {
                _userAccessor = userAccessor;
                _refreshJwtToken = refreshJwtToken;
                _dataHelper = dataHelper;
                _jwtGenerator = jwtGenerator;
                _unitOfWork = unitOfWork;
            }

            public async Task<RefreshTokenDTO> Handle(RefreshTokenQuery request, CancellationToken cancellationToken)
            {
                if (string.IsNullOrEmpty(request.RefreshToken))
                    throw new RestException(HttpStatusCode.Unauthorized, "درخواست معتبر نیست");

                IEnumerable<Claim> claims;

                if (_refreshJwtToken.ValidateToken(request.RefreshToken, out claims))
                {
                    var userId = claims.FirstOrDefault(n => n.Type == "Id").Value;

                    var currentUser = await (from vUser in _unitOfWork.userRepositoryAsync.Query()
                                             join vRole in _unitOfWork.roleRepositoryAsync.Query() on vUser.RoleId equals vRole.Id
                                             where vUser.Id == new Guid(userId) && vUser.IsDeleted == false && vUser.IsActived == true
                                             select new
                                             {
                                                 Id = vUser.Id,
                                                 UserName = vUser.Username,
                                                 RoleId = vUser.RoleId,
                                                 RoleCode = vRole.Code,
                                             }).AsNoTracking()
                                     .FirstOrDefaultAsync();

                    string refreshToken = _refreshJwtToken.CreateToken(currentUser.Id, DateTime.Now.AddMinutes(30));
                    string token = _jwtGenerator.CreateToken(currentUser.Id, currentUser.RoleCode, currentUser.UserName, currentUser.RoleId, DateTime.Now.AddMinutes(2));

                    return new RefreshTokenDTO
                    {
                        Token = token,
                        RefreshToken = refreshToken,
                    };
                }

                throw new RestException(HttpStatusCode.Unauthorized, "درخواست معتبر نیست");
            }
        }
    }
}
