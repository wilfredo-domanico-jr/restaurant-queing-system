using back_end.Data;
using back_end.DTO.Queue;
using back_end.Models;
using Microsoft.EntityFrameworkCore;

namespace back_end.Services
{
    public class QueueService : IQueueService
    {
        private readonly AppDbContext _context;

        public QueueService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<CreateTicketResponseDto> CreateTicketAsync(CreateTicketDto order)
        {

            // ============ START INSERT TICKETS ================= //
            var ticket = new QueueTickets
            {
                PartySize = order.PartySize,
                Section = order.Section,
                GuestName = order.GuestName,
                JoinedAt = DateTime.Now,
                Status = "Waiting",
                TicketNumber = "T" + DateTime.Now.Ticks.ToString()[^6..]
            };

            _context.QueueTickets.Add(ticket);
            await _context.SaveChangesAsync();

            // ============ END INSERT TICKETS ================= //


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
    }
}
