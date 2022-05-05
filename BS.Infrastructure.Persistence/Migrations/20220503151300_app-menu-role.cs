using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace BS.Infrastructure.Persistence.Migrations
{
    public partial class appmenurole : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppMenuRole");

            migrationBuilder.CreateTable(
                name: "AppMenuRoles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    AppMenusId = table.Column<Guid>(type: "uniqueidentifier", nullable: false),
                    RolesId = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AppMenuRoles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AppMenuRoles_AppMenus_AppMenusId",
                        column: x => x.AppMenusId,
                        principalTable: "AppMenus",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_AppMenuRoles_Roles_RolesId",
                        column: x => x.RolesId,
                        principalTable: "Roles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_AppMenuRoles_AppMenusId",
                table: "AppMenuRoles",
                column: "AppMenusId");

            migrationBuilder.CreateIndex(
                name: "IX_AppMenuRoles_RolesId",
                table: "AppMenuRoles",
                column: "RolesId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AppMenuRoles");

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
                        name: "FK_AppMenuRole_AppMenus_AppMenusId",
                        column: x => x.AppMenusId,
                        principalTable: "AppMenus",
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
    }
}
