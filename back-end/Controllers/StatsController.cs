using back_end.DTO.Queue;
using back_end.Models;
using back_end.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace back_end.Controllers
{
    [ApiController]
    [Route("api/stats")]
    [EnableRateLimiting("fixed")]
    public class StatsController : ControllerBase
    {

        private readonly IStatService _statService;
        private readonly ILogger<StatsController> _logger;

        public StatsController(IStatService statService, ILogger<StatsController> logger)
        {
            _statService = statService;
            _logger = logger;
        }

        [HttpGet("today")]
        public async Task<IActionResult> GetTodayStats()
        {
            var result = await _statService.GetTodayStatsAsync();

            return Ok(new
            {
                message = "Today's stats retrieved successfully",
                data = result
            });
        }
    }
}
