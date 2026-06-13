
using back_end.Services;
using back_end.DTO.Admin;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace back_end.Controllers
{
    [ApiController]
    [Route("api/admin")]

    public class AdminController : ControllerBase
    {

        private readonly IAdminService _adminService;
        private readonly ILogger<AdminController> _logger;

        public AdminController(IAdminService adminService, ILogger<AdminController> logger)
        {
            _adminService = adminService;
            _logger = logger;
        }

        [EnableRateLimiting("admin-read")]
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

        [EnableRateLimiting("admin-read")]
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


        [EnableRateLimiting("admin-write")]
        [HttpDelete("delete-queue")]
        public async Task<IActionResult> DeleteQueue([FromQuery] int id)
        {
            var result = await _adminService.DeleteQueueAsync(id);

            if (!result)
            {
                return NotFound(new
                {
                    message = "Queue not found"
                });
            }

            return Ok(new
            {
                message = "Queue deleted successfully"
            });
        }

        [EnableRateLimiting("admin-write")]
        [HttpPatch("update-queue-status")]
        public async Task<IActionResult> UpdateQueueStatus(
                   [FromQuery] int id,
                   [FromBody] UpdateQueueStatusDto dto)
        {
            var result = await _adminService.UpdateQueueStatusAsync(id, dto.Status);

            if (!result)
            {
                return NotFound(new
                {
                    message = "Queue not found"
                });
            }

            return Ok(new
            {
                message = "Queue status updated successfully"
            });
        }

        [EnableRateLimiting("admin-read")]
        [HttpGet("activity-logs")]
        public async Task<IActionResult> GetTodayActivityLog()
        {
            var result = await _adminService.GetTodayActivityLogAsync();

            return Ok(new
            {
                message = "Admin - Today's activity logs retrieved successfully",
                data = result
            });
        }

    }
}
