using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace CleanMate_Main.Server.SignalR
{
    public class WorkHub : Hub
    {
        public async Task SendWorkUpdate(string employeeId)
        {
            await Clients.All.SendAsync("ReceiveWorkUpdate", employeeId);
        }
    }
}
