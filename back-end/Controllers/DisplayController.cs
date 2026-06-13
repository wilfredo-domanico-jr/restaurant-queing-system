
using back_end.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace back_end.Controllers
{
    [ApiController]
    [Route("api/display")]
    [EnableRateLimiting("display-read")]
    public class DisplayController : ControllerBase
    {

        private readonly IDisplayService _displayService;
        private readonly ILogger<DisplayController> _logger;

        public DisplayController(IDisplayService displayService, ILogger<DisplayController> logger)
        {
            _displayService = displayService;
            _logger = logger;
        }

        [HttpGet("stats-today")]
        public async Task<IActionResult> GetTodayStats()
        {
            var result = await _displayService.GetTodayStatsAsync();

            return Ok(new
            {
                message = "Today's stats retrieved successfully",
                data = result
            });
        }

        [HttpGet("sections-status")]
        public async Task<IActionResult> GetSectionStatus()
        {
            var result = await _displayService.GetSectionStatusAsync();

            return Ok(new
            {
                message = "Section status retrieved successfully",
                data = result
            });
        }
        [HttpGet("now-serving")]
        public async Task<IActionResult> GetNowServing()
        {
            var result = await _displayService.GetNowServingAsync();

            return Ok(new
            {
                message = "Now serving retrieved successfully",
                data = result
            });
        }

        [HttpGet("up-next")]
        public async Task<IActionResult> GetUpNext()
        {
            var result = await _displayService.GetUpNextAsync();

            return Ok(new
            {
                message = "Up next retrieved successfully",
                data = result
            });
        }
    }
}
