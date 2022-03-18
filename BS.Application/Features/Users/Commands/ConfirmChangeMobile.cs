using BPJ.LMSR.Application.Common;
using BS.Application.Common;
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

namespace BS.Application.Features.Users.Commands
{

    public class ConfirmChangeMobile
    {
        public class ConfirmChangeMobileCommand : IRequest<ResultDTO<string>>
        {
            public string ActivationCode { get; set; }
        }

        public class ConfirmChangeMobiledHandler : IRequestHandler<ConfirmChangeMobileCommand, ResultDTO<string>>
        {
            private readonly IUnitOfWork _unitOfWork;
            private readonly IPasswordHelper _passwordHelper;
            private readonly IUserAccessor _userAccessor;
            private readonly ISMSService _smsService;
            private readonly ICaptcha _captcha;

            public ConfirmChangeMobiledHandler(IUnitOfWork unitOfWork, IUserAccessor userAccessor, IPasswordHelper passwordHelper, ISMSService smsService, ICaptcha captcha)
            {
                _unitOfWork = unitOfWork;
                _passwordHelper = passwordHelper;
                _smsService = smsService;
                _captcha = captcha;
                _userAccessor = userAccessor;
            }
            public async Task<ResultDTO<string>> Handle(ConfirmChangeMobileCommand request, CancellationToken cancellationToken)
            {


                var user = await _unitOfWork.userRepositoryAsync.GetByIdAsync(_userAccessor.GetCurrentUserId());
                if (user == null)
                    throw new RestException(HttpStatusCode.NotFound, "خطا، رکوردی یافت نشد");

                if (user.CodeExpiredTime < DateTime.Now)
                    return new ResultDTO<string>(HttpStatusCode.Locked, "کد فعالسازی منقضی شده است");

                if (user.ActivationCode != request.ActivationCode)
                    return new ResultDTO<string>(HttpStatusCode.Unauthorized, "کد وارد شده، صحیح نیست");

                user.IsMobileConfirmed = true;
                _unitOfWork.userRepositoryAsync.Update(user);
                var success = await _unitOfWork.SaveAsync() > 0;
                if (success)
                    return new ResultDTO<string>(HttpStatusCode.OK, "فعالسازی با موفقیت انجام شد");

                throw new RestException(HttpStatusCode.BadRequest, "خطا در ثبت عملیات");
            }
        }
    }
}