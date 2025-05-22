using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CleanMate_Main.Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateFieldInBookingAndAddress : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Address",
                table: "Booking");

            migrationBuilder.AddColumn<bool>(
                name: "IsDefault",
                table: "Customer_Address",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "IsInUse",
                table: "Customer_Address",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<decimal>(
                name: "Latitude",
                table: "Customer_Address",
                type: "decimal(9,6)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<decimal>(
                name: "Longitude",
                table: "Customer_Address",
                type: "decimal(9,6)",
                nullable: false,
                defaultValue: 0m);

            migrationBuilder.AddColumn<int>(
                name: "AddressId",
                table: "Booking",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Booking_AddressId",
                table: "Booking",
                column: "AddressId");

            migrationBuilder.AddForeignKey(
                name: "FK_Booking_CustomerAddress",
                table: "Booking",
                column: "AddressId",
                principalTable: "Customer_Address",
                principalColumn: "AddressId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Booking_CustomerAddress",
                table: "Booking");

            migrationBuilder.DropIndex(
                name: "IX_Booking_AddressId",
                table: "Booking");

            migrationBuilder.DropColumn(
                name: "IsDefault",
                table: "Customer_Address");

            migrationBuilder.DropColumn(
                name: "IsInUse",
                table: "Customer_Address");

            migrationBuilder.DropColumn(
                name: "Latitude",
                table: "Customer_Address");

            migrationBuilder.DropColumn(
                name: "Longitude",
                table: "Customer_Address");

            migrationBuilder.DropColumn(
                name: "AddressId",
                table: "Booking");

            migrationBuilder.AddColumn<string>(
                name: "Address",
                table: "Booking",
                type: "nvarchar(255)",
                maxLength: 255,
                nullable: true);
        }
    }
}
