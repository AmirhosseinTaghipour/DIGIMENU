using Microsoft.EntityFrameworkCore.Migrations;

namespace BS.Infrastructure.Persistence.Migrations
{
    public partial class addsmsresponse : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Response",
                table: "SMSLogs",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Response",
                table: "SMSLogs");
        }
    }
}
