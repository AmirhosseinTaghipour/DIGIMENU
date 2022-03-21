﻿using BPJ.LMSR.Application.Common;
using BS.Application.Common;
using BS.Application.Features.Users;
using BS.Application.Features.Users.Commands;
using BS.Application.Features.Users.DTOs;
using BS.Application.Features.Users.Queries;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BS.API.Controllers
{
    public class UserController : BaseController
    {
        [AllowAnonymous]
        [HttpPost("UserRegister")]
        public async Task<ActionResult<ResultDTO<string>>> UserRegister(UserRegister.UserRegisterCommand command)
        {
            return await Mediator.Send(command);
        }

        [AllowAnonymous]
        [HttpPost("UserActivate")]
        public async Task<ActionResult<ResultDTO<string>>> UserActivate(UserActivate.UserActivateCommand command)
        {
            return await Mediator.Send(command);
        }

        [AllowAnonymous]
        [HttpGet("CaptchaImage")]
        public async Task<ActionResult<CaptchaImageDTO>> GetCaptchaImage()
        {
            return await Mediator.Send(new CaptchaImage.CaptchaImageQuery());
        }

        [HttpPost("ChangePassword")]
        public async Task<ActionResult<ResultDTO<string>>> ChangePassword(ChangePassword.ChangePasswordCommand command)
        {
            return await Mediator.Send(command);

        }

        [AllowAnonymous]
        [HttpPost("ForgetPassword")]
        public async Task<ActionResult<ResultDTO<string>>> ForgetPassword(ForgetPassword.ForgetPasswordCommand command)
        {
            return await Mediator.Send(command);
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        [AllowAnonymous]
        [HttpPost("RefreshToken")]
        public async Task<ActionResult<RefreshTokenDTO>> RefreshJwtToken(RefreshToken.RefreshTokenQuery query)
        {
            return await Mediator.Send(query);
        }

        [HttpPost("EditUser")]
        public async Task<ActionResult<ResultDTO<string>>> EditUser(EditUser.EditUserCommand command)
        {
            return await Mediator.Send(command);
        }

        [AllowAnonymous]
        [HttpPost("Login")]
        public async Task<ActionResult<RefreshTokenDTO>> Login(Login.LoginCommand command)
        {
            return await Mediator.Send(command);
        }

        [HttpPost("SetChangeMobile")]
        public async Task<ActionResult<ResultDTO<string>>> SetChangeMobile(SetChangeMobile.SetChangeMobileCommand command)
        {
            return await Mediator.Send(command);
        }

        [HttpPost("ConfirmChangeMobile")]
        public async Task<ActionResult<ResultDTO<string>>> ConfirmChangeMobile(ConfirmChangeMobile.ConfirmChangeMobileCommand command)
        {
            return await Mediator.Send(command);
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        [HttpGet]
        public async Task<ActionResult<CurrentUserDTO>> CurrentUser()
        {
            return await Mediator.Send(new CurrentUser.CurrentUserQuery());
        }

        [HttpGet("GetAppMenu")]
        public async Task<ActionResult<List<AppMenuDTO>>> GetAppMenu()
        {
            return await Mediator.Send(new UserAppMenu.UserAppMenuQuery());
        }


        [AllowAnonymous]
        [HttpPost("ConfirmSMS")]
        public async Task<ActionResult<RefreshTokenDTO>> ConfirmSMS(ConfirmSMS.ConfirmSMSCommand command)
        {
            return await Mediator.Send(command);
        }
    }
}
