using Microsoft.AspNetCore.SignalR;

namespace CleanMate_Main.Server.SignalR
{
    public class WithdrawHub : Hub
    {
        public async Task SendWorkUpdate(string employeeId)
        {
            await Clients.All.SendAsync("ReceiveWithdrawUpdate", employeeId);
        }
    }
}
