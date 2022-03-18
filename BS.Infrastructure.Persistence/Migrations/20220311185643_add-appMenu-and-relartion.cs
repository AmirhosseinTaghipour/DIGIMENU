using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace BS.Infrastructure.Persistence.Migrations
{
    public partial class addappMenuandrelartion : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "AppMenu",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    MenuTitle = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    MenuCode = table.Column<string>(type: "nvarchar(100)", maxLength: 100, nullable: true),
                    IsActived = table.Column<bool>(type: "bit", nullable: false),
                    IsDeleted = table.Column<bool>(type: "bit", nullable: false),
                    InsertUser = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    InsertDate = table.Column<DateTime>(type: "datetime2", nullable: false),
                    UpdateUser = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: true),
                    UpdateDate = table.Column<DateTime>(type: "datetime2", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppMenu", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AppMenuRole",
                columns: table => new
                {
                    AppMenusId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RolesId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppMenuRole", x => new { x.AppMenusId, x.RolesId });
                    table.ForeignKey(
                        name: "FK_AppMenuRole_AppMenu_AppMenusId",
                        column: x => x.AppMenusId,
                        principalTable: "AppMenu",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AppMenuRole_Roles_RolesId",
                        column: x => x.RolesId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppMenuRole_RolesId",
                table: "AppMenuRole",
                column: "RolesId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppMenuRole");

            migrationBuilder.DropTable(
                name: "AppMenu");
        }
    }
}
