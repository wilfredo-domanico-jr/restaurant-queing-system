using back_end.Data;
using back_end.DTO.Kiosk;
using back_end.Hubs;
using back_end.Models;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace back_end.Services
{
    public class KioskService : IKioskService
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<QueueHub> _hub;

        public KioskService(AppDbContext context, IHubContext<QueueHub> hub)
        {
            _context = context;
            _hub = hub;
        }

        public async Task<CreateTicketResponseDto> CreateTicketAsync(CreateTicketDto order)
        {

            // ============ START INSERT TICKETS ================= //
            var ticket = new QueueTickets
            {
                PartySize = order.PartySize,
                Section = order.Section.ToString(),
                GuestName = order.GuestName,
                JoinedAt = DateTime.Now,
                Status = "Waiting",
                TicketNumber = "T" + DateTime.Now.Ticks.ToString()[^6..]
            };

            _context.QueueTickets.Add(ticket);



            // ============ END INSERT TICKETS ================= //

            // ============ START ACTIVITY LOGS ================= //
            var log = new ActivityLogs
            {
                Type = "Create",
                Description = $"{ticket.GuestName} joined ({ticket.TicketNumber}) — {ticket.Section}",
                CreatedAt = DateTime.Now
            };

            _context.ActivityLogs.Add(log);

            // ============ END ACTIVITY LOGS ================= //

            await _context.SaveChangesAsync(); // Save here

            await _hub.Clients.All.SendAsync("queueUpdated");

            var today = DateTime.Today;

            var tomorrow = today.AddDays(1);


            // ============ START COUNT AVERAGE WAITING TIME ================= //


            var completedTickets = await _context.QueueTickets
                .Where(t =>
                    t.Status == "Seated" &&
                    t.JoinedAt >= today &&
                    t.JoinedAt < tomorrow &&
                    t.SeatedAt != null)
                .ToListAsync();

            double averageWaitMinutes = 5; // Default to 5 minutes

            if (completedTickets.Any())
            {
                averageWaitMinutes = completedTickets
                    .Select(t => (t.SeatedAt!.Value - t.JoinedAt).TotalMinutes)
                    .Average();
            }
            // ============ END COUNT AVERAGE WAITING TIME ================= //



            // ============ START GET POSITION IN QUEUE ================= //
            var positionInQueue = await _context.QueueTickets
                .Where(t =>
                    t.Status == "Waiting" && t.Id < ticket.Id)
                .CountAsync();
            // ============ END GET POSITION IN QUEUE ================= //


            return new CreateTicketResponseDto
            {
                TicketNumber = ticket.TicketNumber,
                GuestName = ticket.GuestName,
                PartySize = ticket.PartySize,
                Section = ticket.Section,
                PositionInQueue = positionInQueue + 1,
                EstimatedWaitMinutes = (int)Math.Round(averageWaitMinutes)
            };
        }

        public async Task<StatsResponseDto> GetStatsAsync()
        {

            var today = DateTime.Today;
            var tomorrow = today.AddDays(1);


            // ============ START WAITING COUNT ================= //
            int waiting = await _context.QueueTickets
            .Where(t =>
                t.Status == "Waiting" &&
                t.JoinedAt >= today &&
                t.JoinedAt < tomorrow)
            .CountAsync();
            // ============ END WAITING COUNT ================= //


            // ============ START SERVING COUNT ================= //
            int serving = await _context.QueueTickets
            .Where(t =>
                t.Status == "Called" &&
                t.JoinedAt >= today &&
                t.JoinedAt < tomorrow &&
                t.CalledAt != null)
            .CountAsync();
            // ============ END SERVING COUNT ================= //

            // ============ START AVERAGE WAITITNG TIME COUNT ================= //

            var seatedTickets = await _context.QueueTickets
                .Where(t =>
                    t.Status == "Seated" &&
                    t.JoinedAt >= today &&
                    t.JoinedAt < tomorrow &&
                    t.SeatedAt != null)
                .ToListAsync();

            double averageWaitingTime = 0;

            if (seatedTickets.Any())
            {
                averageWaitingTime = seatedTickets
                    .Average(t => (t.SeatedAt!.Value - t.JoinedAt).TotalMinutes);
            }

            // ============ END AVERAGE WAITITNG TIME COUNT ================= //


            return new StatsResponseDto
            {
                NowServing = serving,
                Waiting = waiting,
                EstimatedWaitMinutes = (int)Math.Round(averageWaitingTime)
            };
        }
    }
}
