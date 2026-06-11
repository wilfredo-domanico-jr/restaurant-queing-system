using back_end.DTO.Queue;
using back_end.Models;
using back_end.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;

namespace back_end.Controllers
{
    [ApiController]
    [Route("api/queue")]
    [EnableRateLimiting("fixed")]
    public class QueueController : ControllerBase
    {
        private readonly IQueueService _queueService;
        private readonly ILogger<QueueController> _logger;

        public QueueController(IQueueService queueService, ILogger<QueueController> logger)
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


        [HttpPost("live")]
        public async Task<IActionResult> Live([FromBody] CreateTicketDto ticket)
        {
            var result = await _queueService.CreateTicketAsync(ticket);

            // {
            //   "nowServing": null,
            //   "waitingCount": 0,
            //   "upNext": [],
            //   "ticketsIssued": 0
            // }

            return Ok(new
            {
                message = "Ticket created successfully",
                data = result
            });
        }

    }
}
