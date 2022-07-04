using AutoMapper;
using BS.Application.Common;
using BS.Application.Common.DTOs;
using BS.Application.Common.Enums;
using BS.Application.Common.Models;
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
using System.Linq.Dynamic.Core;

using System.Threading.Tasks;
using BS.Application.Features.Files.DTOs;

namespace BS.Application.Features.Files.Queries
{
    public class FileLoad
    {

        public class FileLoadQuery : IRequest<FileFormDTO>
        {
            public string id { get; set; }
        }

        public class FileLoadHandLer : IRequestHandler<FileLoadQuery, FileFormDTO>
        {
            private readonly IUnitOfWork _unitOfWork;
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;
            private readonly IFileHelper _fileHelper;
            private readonly IAdjustChar _adjustChar;


            public FileLoadHandLer(IUnitOfWork unitOfWork, IUserAccessor userAccessor, IMapper mapper, IFileHelper fileHelper, IAdjustChar adjustChar)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _fileHelper = fileHelper;
                _mapper = mapper;
                _adjustChar = adjustChar;
            }
            public async Task<FileFormDTO> Handle(FileLoadQuery request, CancellationToken cancellationToken)
            {
                if (string.IsNullOrEmpty(request.id))
                    throw new RestException(HttpStatusCode.BadRequest, "id نمیتواند خالی باشد.");


                var file = await _unitOfWork.fileRepositoryAsync.GetByIdAsync(new(request.id));
                if (file == null)
                    throw new RestException(HttpStatusCode.BadRequest, "رکوردی یافت نشد.");

                var formFile = new FileDTO();

                    formFile.Url = _fileHelper.GetFilePath(file.Id.ToString().ToLower(), file.FileName, FileDirectorey.ItemImage);
                    formFile.Name = file.FileName;

                var res = new FileFormDTO()
                {
                    Id = file.Id.ToString().ToLower(),
                    Title = file.Title,
                    File = formFile,
                    IsDefault = file.IsDefault,
                    EntityId = file.EntityId.ToString(),
                    EntityName = file.EntityName,
                    IsUpdateMode = true,
                };

                return res;
            }
        }
    }
}
