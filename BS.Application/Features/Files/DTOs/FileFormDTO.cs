using BS.Application.Common.DTOs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Application.Features.Files.DTOs
{
    public class FileFormDTO
    {
        public string Id { get; set; }
        public string EntityName { get; set; }
        public string EntityId { get; set; }
        public FileDTO File { get; set; }
        public string Title { get; set; }
        public bool IsDefault { get; set; } = false;
        public bool IsUpdateMode { get; set; } = false;
    }
}