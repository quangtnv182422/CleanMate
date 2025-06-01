using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CleanMate_Main.Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateNullableBookingId : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Wallet_Transaction_Booking_BookingId",
                table: "Wallet_Transaction");

            migrationBuilder.DropIndex(
                name: "IX_Wallet_Transaction_BookingId",
                table: "Wallet_Transaction");

            migrationBuilder.DropColumn(
                name: "BookingId",
                table: "Wallet_Transaction");

            migrationBuilder.CreateIndex(
                name: "IX_Wallet_Transaction_RelatedBookingId",
                table: "Wallet_Transaction",
                column: "RelatedBookingId");

            migrationBuilder.AddForeignKey(
                name: "FK_WalletTransaction_Booking",
                table: "Wallet_Transaction",
                column: "RelatedBookingId",
                principalTable: "Booking",
                principalColumn: "BookingId",
                onDelete: ReferentialAction.SetNull);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_WalletTransaction_Booking",
                table: "Wallet_Transaction");

            migrationBuilder.DropIndex(
                name: "IX_Wallet_Transaction_RelatedBookingId",
                table: "Wallet_Transaction");

            migrationBuilder.AddColumn<int>(
                name: "BookingId",
                table: "Wallet_Transaction",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_Wallet_Transaction_BookingId",
                table: "Wallet_Transaction",
                column: "BookingId");

            migrationBuilder.AddForeignKey(
                name: "FK_Wallet_Transaction_Booking_BookingId",
                table: "Wallet_Transaction",
                column: "BookingId",
                principalTable: "Booking",
                principalColumn: "BookingId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
