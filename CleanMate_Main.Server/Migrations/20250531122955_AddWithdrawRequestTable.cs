using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CleanMate_Main.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddWithdrawRequestTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "BookingId",
                table: "Wallet_Transaction",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<int>(
                name: "RelatedBookingId",
                table: "Wallet_Transaction",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "WithdrawRequest",
                columns: table => new
                {
                    RequestId = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    UserId = table.Column<string>(type: "nvarchar(450)", maxLength: 450, nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Status = table.Column<string>(type: "nvarchar(50)", maxLength: 50, nullable: false),
                    RequestedAt = table.Column<DateTime>(type: "datetime2", nullable: false, defaultValueSql: "(getdate())"),
                    ProcessedAt = table.Column<DateTime>(type: "datetime2", nullable: true),
                    AdminNote = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    TransactionId = table.Column<int>(type: "int", nullable: true),
                    ProcessedBy = table.Column<string>(type: "nvarchar(450)", maxLength: 450, nullable: true),
                    WalletId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WithdrawRequest", x => x.RequestId);
                    table.ForeignKey(
                        name: "FK_Withdraw_Admin",
                        column: x => x.ProcessedBy,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Withdraw_Transaction",
                        column: x => x.TransactionId,
                        principalTable: "Wallet_Transaction",
                        principalColumn: "TransactionId");
                    table.ForeignKey(
                        name: "FK_Withdraw_User",
                        column: x => x.UserId,
                        principalTable: "AspNetUsers",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_Withdraw_Wallet",
                        column: x => x.WalletId,
                        principalTable: "User_Wallet",
                        principalColumn: "WalletId",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Wallet_Transaction_BookingId",
                table: "Wallet_Transaction",
                column: "BookingId");

            migrationBuilder.CreateIndex(
                name: "IX_WithdrawRequest_ProcessedBy",
                table: "WithdrawRequest",
                column: "ProcessedBy");

            migrationBuilder.CreateIndex(
                name: "IX_WithdrawRequest_TransactionId",
                table: "WithdrawRequest",
                column: "TransactionId",
                unique: true,
                filter: "[TransactionId] IS NOT NULL");

            migrationBuilder.CreateIndex(
                name: "IX_WithdrawRequest_UserId",
                table: "WithdrawRequest",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_WithdrawRequest_WalletId",
                table: "WithdrawRequest",
                column: "WalletId");

            migrationBuilder.AddForeignKey(
                name: "FK_Wallet_Transaction_Booking_BookingId",
                table: "Wallet_Transaction",
                column: "BookingId",
                principalTable: "Booking",
                principalColumn: "BookingId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Wallet_Transaction_Booking_BookingId",
                table: "Wallet_Transaction");

            migrationBuilder.DropTable(
                name: "WithdrawRequest");

            migrationBuilder.DropIndex(
                name: "IX_Wallet_Transaction_BookingId",
                table: "Wallet_Transaction");

            migrationBuilder.DropColumn(
                name: "BookingId",
                table: "Wallet_Transaction");

            migrationBuilder.DropColumn(
                name: "RelatedBookingId",
                table: "Wallet_Transaction");
        }
    }
}
