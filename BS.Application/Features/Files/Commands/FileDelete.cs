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

namespace BS.Application.Features.Files.Commands
{

    public class FileDelete
    {
        public class FileDeleteCommand : IRequest<ResultDTO<string>>
        {
            public string Id { get; set; }
        }

        public class FileDeleteHandler : IRequestHandler<FileDeleteCommand, ResultDTO<string>>
        {
            private readonly IUserAccessor _userAccessor;
            private readonly IUnitOfWork _unitOfWork;
            private readonly IFileHelper _fileHelper;
            private readonly IMapper _mapper;

            public FileDeleteHandler(IUserAccessor userAccessor, IUnitOfWork unitOfWork, IMapper mapper, IFileHelper fileHelper)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _mapper = mapper;
                _fileHelper = fileHelper;
            }
            public async Task<ResultDTO<string>> Handle(FileDeleteCommand request, CancellationToken cancellationToken)
            {

                var file = await _unitOfWork.fileRepositoryAsync.GetByIdAsync(new Guid(request.Id));
                if (file == null)
                    throw new RestException(HttpStatusCode.NotFound, "خطا، رکوردی یافت نشد");

                file.IsDeleted = true;
                _unitOfWork.fileRepositoryAsync.Update(file);

                var fileRes = true;

                fileRes = _fileHelper.DeleteFile(file.Id.ToString().ToLower(), System.IO.Path.GetExtension(file.FileName), FileDirectorey.ItemImage);
                fileRes = _fileHelper.DeleteFile(file.Id.ToString().ToLower(), System.IO.Path.GetExtension(file.FileName), FileDirectorey.ItemImageThumbnail);


                if (!fileRes)
                    throw new RestException(HttpStatusCode.BadRequest, "خطا در حذف تصویر");

                var success = await _unitOfWork.SaveAsync() > 0;
                if (success)
                    return new ResultDTO<string>(HttpStatusCode.OK, "حذف تصویر با موفقیت انجام شد.");

                throw new RestException(HttpStatusCode.BadRequest, "خطا در عملیات حذف");

            }
        }
    }
}
