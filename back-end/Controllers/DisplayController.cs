
using back_end.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace back_end.Controllers
{
    [ApiController]
    [Route("api/display")]
    [EnableRateLimiting("fixed")]
    public class DisplayController : ControllerBase
    {

        private readonly IStatService _statService;
        private readonly ILogger<DisplayController> _logger;

        public DisplayController(IStatService statService, ILogger<DisplayController> logger)
        {
            _statService = statService;
            _logger = logger;
        }

        [HttpGet("stats-today")]
        public async Task<IActionResult> GetTodayStats()
        {
            var result = await _statService.GetTodayStatsAsync();

            return Ok(new
            {
                message = "Today's stats retrieved successfully",
                data = result
            });
        }

        [HttpGet("sections-status")]
        public async Task<IActionResult> GetSectionStatus()
        {
            var result = await _statService.GetSectionStatusAsync();

            return Ok(new
            {
                message = "Section status retrieved successfully",
                data = result
            });
        }
    }
}
