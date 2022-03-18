using Microsoft.EntityFrameworkCore.Migrations;

namespace BS.Infrastructure.Persistence.Migrations
{
    public partial class check : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppMenuRole_AppMenu_AppMenusId",
                table: "AppMenuRole");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AppMenu",
                table: "AppMenu");

            migrationBuilder.RenameTable(
                name: "AppMenu",
                newName: "AppMenus");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AppMenus",
                table: "AppMenus",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_AppMenuRole_AppMenus_AppMenusId",
                table: "AppMenuRole",
                column: "AppMenusId",
                principalTable: "AppMenus",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_AppMenuRole_AppMenus_AppMenusId",
                table: "AppMenuRole");

            migrationBuilder.DropPrimaryKey(
                name: "PK_AppMenus",
                table: "AppMenus");

            migrationBuilder.RenameTable(
                name: "AppMenus",
                newName: "AppMenu");

            migrationBuilder.AddPrimaryKey(
                name: "PK_AppMenu",
                table: "AppMenu",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_AppMenuRole_AppMenu_AppMenusId",
                table: "AppMenuRole",
                column: "AppMenusId",
                principalTable: "AppMenu",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
