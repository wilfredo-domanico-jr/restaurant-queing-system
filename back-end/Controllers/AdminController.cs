
using back_end.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace back_end.Controllers
{
    [ApiController]
    [Route("api/admin")]
    [EnableRateLimiting("fixed")]
    public class AdminController : ControllerBase
    {

        private readonly IAdminService _adminService;
        private readonly ILogger<AdminController> _logger;

        public AdminController(IAdminService adminService, ILogger<AdminController> logger)
        {
            _adminService = adminService;
            _logger = logger;
        }

        [HttpGet("stats-today")]
        public async Task<IActionResult> GetTodayStats()
        {
            var result = await _adminService.GetTodayStatsAsync();

            return Ok(new
            {
                message = "Admin - Today's stats retrieved successfully",
                data = result
            });
        }

        [HttpGet("current-queue")]
        public async Task<IActionResult> GetCurrentQueue([FromQuery] int page = 1)
        {
            var result = await _adminService.GetCurrentQueueAsync(page);

            return Ok(new
            {
                message = "Admin - Current queue retrieved successfully",
                data = result
            });
        }
    }
}
