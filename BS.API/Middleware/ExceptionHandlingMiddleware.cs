using BS.Application.Common.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text.Json;
using System.Threading.Tasks;

namespace BS.API.Middleware
{
    public class ExceptionHandlingMiddleware
    {
        private readonly RequestDelegate _next;

        public ExceptionHandlingMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }
        private async Task HandleExceptionAsync(HttpContext context, Exception ex)
        {
            Error error = null;

            switch (ex)
            {
                case RestException re:
                    error = new Error(re.Code, re.Message);
                    context.Response.StatusCode = (int)re.Code;
                    break;
                case Exception e:
                    error = new Error(HttpStatusCode.InternalServerError, string.IsNullOrWhiteSpace(e.Message) ? "Error" : e.Message);
                    context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
                    break;
            }

            context.Response.ContentType = "application/json";
            if (error != null)
            {
                var result = JsonSerializer.Serialize(error);
                await context.Response.WriteAsync(result);
            }
        }
        private class Error
        {
            public HttpStatusCode Code { get; set; }
            public string Message { get; set; }
            internal Error(HttpStatusCode code, string message)
            {
                Code = code;
                Message = message;
            }
        }
    }
}
