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
    public class FileList
    {
        public class FileListEnvelope
        {
            public List<FileListItemDTO> FileList { get; set; }
            public int FileCount { get; set; }
        }
        public class FileListQuery : ListSearchParamDTO, IRequest<FileListEnvelope>
        {
            //List Parameter
            public string Title { get; set; }
            public string EntityId { get; set; }
            public string EntityName { get; set; }
        }

        public class FileListHandLer : IRequestHandler<FileListQuery, FileListEnvelope>
        {
            private readonly IUnitOfWork _unitOfWork;
            private readonly IUserAccessor _userAccessor;
            private readonly IMapper _mapper;
            private readonly IFileHelper _fileHelper;
            private readonly IAdjustChar _adjustChar;


            public FileListHandLer(IUnitOfWork unitOfWork, IUserAccessor userAccessor, IMapper mapper, IFileHelper fileHelper, IAdjustChar adjustChar)
            {
                _unitOfWork = unitOfWork;
                _userAccessor = userAccessor;
                _fileHelper = fileHelper;
                _mapper = mapper;
                _adjustChar = adjustChar;
            }
            public async Task<FileListEnvelope> Handle(FileListQuery request, CancellationToken cancellationToken)
            {
                if (string.IsNullOrEmpty(request.EntityId) || string.IsNullOrEmpty(request.EntityName))
                    throw new RestException(HttpStatusCode.BadRequest, "خطا، فیلد های ضروری نمیتواند خالی باشد.");

                try
                {
                    var query = (from fileTable in _unitOfWork.fileRepositoryAsync.Query()
                                 where fileTable.EntityName == EntityName.CategoryItem.ToString()
                                 && fileTable.EntityId == new Guid(request.EntityId)
                                 && fileTable.IsDeleted != true
                                 orderby fileTable.IsDefault descending , fileTable.InsertDate ascending
                                 select new FileListItemDTO
                                 {
                                     Id = fileTable.Id.ToString().ToLower(),
                                     Key = fileTable.Id.ToString().ToLower(),
                                     Title = fileTable.Title,
                                     IsDefault=fileTable.IsDefault,
                                     Url = _fileHelper.GetFilePath(fileTable.Id.ToString().ToLower(), fileTable.FileName, FileDirectorey.ItemImageThumbnail),
                                 });

                    // Search
                    #region Search

                    if (!string.IsNullOrEmpty(request.Title))
                    {
                        query = query.Where(x => x.Title.Contains(_adjustChar.ChangeToArabicChar(request.Title)));
                    }
                    #endregion

                    // Order by
                    #region Order by
                    //if (string.IsNullOrEmpty(request.SortColumn))
                    //{
                    //    query = query.OrderBy(x => x);
                    //}
                    //else
                    //{
                    //    query = query.OrderBy($"{request.SortColumn} {request.SortDirection}");
                    //}
                    #endregion
                    var result = new FileListEnvelope();

                    int offset = (request.Page - 1 ?? 0) * (request.Limit ?? 10);

                    var list = await query
                        .Skip(offset)
                        .Take(request.Limit ?? 10)
                        .AsNoTracking()
                        .ToListAsync();

                    result.FileList = new List<FileListItemDTO>(list);
                    result.FileCount = await query.CountAsync();

                    return result;
                }
                catch(Exception ex)
                {
                    throw new RestException(HttpStatusCode.BadRequest, "در طول عملیات خظایی رخ داده است.");

                }
              
            }
        }
    }
}
