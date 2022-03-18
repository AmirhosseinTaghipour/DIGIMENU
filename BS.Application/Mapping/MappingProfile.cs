using AutoMapper;
using BS.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using static BS.Application.Features.Departments.Commands.DepartmentInsert;
using static BS.Application.Features.Departments.Commands.DepartmentUpdate;
using static BS.Application.Features.Users.Commands.UserRegister;

namespace BS.Application.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            //CreateMap<Product, GetAllProductsViewModel>().ReverseMap();
            CreateMap<UserRegisterCommand, User>();
            CreateMap<DepartmentInsertCommand, Department>();
            CreateMap<DepartmentUpdateCommand, Department>();
        }
    }
}
