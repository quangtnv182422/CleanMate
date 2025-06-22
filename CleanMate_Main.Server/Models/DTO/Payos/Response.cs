namespace CleanMate_Main.Server.Models.DTO.Payos
{
    public record Response(
         int error,
         String message,
         object? data
    );
}
