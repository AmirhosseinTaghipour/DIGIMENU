using System;
using System.Collections.Generic;
using System.Net;
using System.Text;

namespace BS.Application.Common.DTOs
{
    public class ResultDTO<T>
    {
        public HttpStatusCode Code { get; }
        public string Message { get;}
        public T Data { get;}
        public ResultDTO(HttpStatusCode code, string message)
        {
            Code = code;
            Message = message;
        }
        public ResultDTO(HttpStatusCode code, string message, T data)
        {
            Code = code;
            Message = message;
            Data = data;
        }
    }
}