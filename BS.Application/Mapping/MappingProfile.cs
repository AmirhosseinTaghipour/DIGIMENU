using AutoMapper;
using BS.Application.Features.Categories.DTOs;
using BS.Application.Features.Departments.DTOs;
using BS.Application.Features.Menus.DTOs;
using BS.Domain.Entities;
using System;
using System.Collections.Generic;
using System.Text;
using static BS.Application.Features.Departments.Commands.DepartmentInsert;
using static BS.Application.Features.Departments.Commands.DepartmentUpdate;
using static BS.Application.Features.Menus.Commands.MenuInsert;
using static BS.Application.Features.Users.Commands.UserRegister;

namespace BS.Application.Mapping
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<UserRegisterCommand, User>();

            CreateMap<DepartmentInsertCommand, Department>().ReverseMap();
            CreateMap<DepartmentUpdateCommand, Department>().ReverseMap();
            CreateMap<DepartmentDTO, Department>().ReverseMap();

            CreateMap<MenuInsertCommand, Menu>().ReverseMap();
            CreateMap<DepartmentUpdateCommand, Menu>().ReverseMap();
            CreateMap<MenuDTO, Menu>().ReverseMap();

            CreateMap<CategoryFormDTO, Category>().ReverseMap();
        }
    }
}
