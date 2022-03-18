using System;
using System.Net;
using System.Net.Http;

namespace BS.Application.Common
{
    public class RestException : Exception
    {

        public RestException(HttpStatusCode code, string message = "") : base(message)
        {
            Code = code;
        }

        public HttpStatusCode Code { get; }
    }
}
