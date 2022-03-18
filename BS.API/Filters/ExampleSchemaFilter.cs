using Microsoft.OpenApi.Any;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BS.API.Filters
{
    public class ExampleSchemaFilter : ISchemaFilter
    {
        public void Apply(OpenApiSchema schema, SchemaFilterContext context)
        {
            switch (context.Type)
            {
                #region AdaptionReport
                //case var _ when ReferenceEquals(context.Type, typeof(.LMSR.Application.AdaptionReport.List.Query)):
                //    schema.Example = new OpenApiObject()
                //    {
                //        ["FROMDATE_REQUEST"] = new OpenApiString("Johnnn"),
                //        ["TODATE_REQUEST"] = new OpenApiString("Doeee"),
                //        ["parvanE_NO"] = new OpenApiString("2598"),

                //    };
                //    break;

                //case var _ when ReferenceEquals(context.Type, typeof(List<BPJ.LMSR.Application.AdaptionReport.AdaptionReportsDTo>)):
                //    schema.Example = new OpenApiArray()
                //{
                //    new OpenApiObject(){
                //    ["FROMDATE_REQUEST"] = new OpenApiString("Jooohn"),
                //    ["TODATE_REQUEST"] = new OpenApiString("Doooe"),
                //    ["parvanE_NO"] = new OpenApiString("03132154")}
                //};
                //    break;
                #endregion

                default:
                    break;


            }
        }
    }
}
