using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CleanMate_Main.Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateDurationName : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Duration",
                table: "Duration",
                newName: "DurationTime");

            migrationBuilder.RenameColumn(
                name: "Description",
                table: "Duration",
                newName: "SquareMeterSpecific");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "SquareMeterSpecific",
                table: "Duration",
                newName: "Description");

            migrationBuilder.RenameColumn(
                name: "DurationTime",
                table: "Duration",
                newName: "Duration");
        }
    }
}
