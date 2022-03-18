using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace BS.Infrastructure.Persistence.Migrations
{
    public partial class changesmslog : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UpdateDate",
                table: "SMSLogs");

            migrationBuilder.DropColumn(
                name: "UpdateUser",
                table: "SMSLogs");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "UpdateDate",
                table: "SMSLogs",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UpdateUser",
                table: "SMSLogs",
                type: "nvarchar(50)",
                maxLength: 50,
                nullable: true);
        }
    }
}
