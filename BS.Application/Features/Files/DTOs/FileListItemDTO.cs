using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BS.Application.Features.Files.DTOs
{
    public class FileListItemDTO
    {
        public string Key { get; set; }
        public string Id { get; set; }
        public string Title { get; set; }
        public bool IsDefault { get; set; } = false;
        public string Url { get; set; }
    }
}
