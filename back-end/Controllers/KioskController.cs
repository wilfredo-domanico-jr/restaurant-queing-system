using back_end.DTO.Kiosk;
using back_end.Models;
using back_end.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace back_end.Controllers
{
    [ApiController]
    [Route("api/kiosk")]

    public class KioskController : ControllerBase
    {
        private readonly IKioskService _kioskService;
        private readonly ILogger<KioskController> _logger;

        public KioskController(IKioskService kioskService, ILogger<KioskController> logger)
        {
            _kioskService = kioskService;
            _logger = logger;
        }


        [EnableRateLimiting("kiosk-read")]
        [HttpGet("stats")]
        public async Task<IActionResult> GetStats()
        {
            var result = await _kioskService.GetStatsAsync();


            return Ok(new
            {
                message = "Kiosk Stats fetch successfully",
                data = result
            });
        }


        [EnableRateLimiting("kiosk-write")]
        [HttpPost("create-ticket")]
        public async Task<IActionResult> CreateTicket([FromBody] CreateTicketDto ticket)
        {
            var result = await _kioskService.CreateTicketAsync(ticket);


            return Ok(new
            {
                message = "Ticket created successfully",
                data = result
            });
        }



    }
}
