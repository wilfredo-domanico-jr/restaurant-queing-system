using back_end.DTO.Kiosk;
using back_end.Models;
using back_end.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace back_end.Controllers
{
    [ApiController]
    [Route("api/kiosk")]
    [EnableRateLimiting("fixed")]
    public class KioskController : ControllerBase
    {
        private readonly IKioskService _queueService;
        private readonly ILogger<KioskController> _logger;

        public KioskController(IKioskService queueService, ILogger<KioskController> logger)
        {
            _queueService = queueService;
            _logger = logger;
        }

        [HttpPost("create-ticket")]
        public async Task<IActionResult> CreateTicket([FromBody] CreateTicketDto ticket)
        {
            var result = await _queueService.CreateTicketAsync(ticket);


            return Ok(new
            {
                message = "Ticket created successfully",
                data = result
            });
        }



    }
}
