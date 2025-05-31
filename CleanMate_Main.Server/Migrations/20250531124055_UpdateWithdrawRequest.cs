using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CleanMate_Main.Server.Migrations
{
    /// <inheritdoc />
    public partial class UpdateWithdrawRequest : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Withdraw_Wallet",
                table: "WithdrawRequest");

            migrationBuilder.DropIndex(
                name: "IX_WithdrawRequest_WalletId",
                table: "WithdrawRequest");

            migrationBuilder.DropColumn(
                name: "WalletId",
                table: "WithdrawRequest");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "WalletId",
                table: "WithdrawRequest",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateIndex(
                name: "IX_WithdrawRequest_WalletId",
                table: "WithdrawRequest",
                column: "WalletId");

            migrationBuilder.AddForeignKey(
                name: "FK_Withdraw_Wallet",
                table: "WithdrawRequest",
                column: "WalletId",
                principalTable: "User_Wallet",
                principalColumn: "WalletId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
