using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace CleanMate_Main.Server.Controllers.Employee
{
    [Route("[controller]")]
    [ApiController]
    [Authorize(Roles = "Cleaner")]
    public class WorkController : ControllerBase
    {

    }
}
