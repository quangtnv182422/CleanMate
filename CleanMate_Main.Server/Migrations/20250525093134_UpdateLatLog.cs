using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CleanMate_Main.Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateLatLog : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<decimal>(
                name: "Longitude",
                table: "Customer_Address",
                type: "decimal(20,17)",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "float");

            migrationBuilder.AlterColumn<decimal>(
                name: "Latitude",
                table: "Customer_Address",
                type: "decimal(20,17)",
                nullable: false,
                oldClrType: typeof(double),
                oldType: "float");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<double>(
                name: "Longitude",
                table: "Customer_Address",
                type: "float",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(20,17)");

            migrationBuilder.AlterColumn<double>(
                name: "Latitude",
                table: "Customer_Address",
                type: "float",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(20,17)");
        }
    }
}
