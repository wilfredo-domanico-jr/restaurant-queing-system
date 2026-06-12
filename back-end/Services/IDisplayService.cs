using back_end.Data;
using back_end.DTO.Display;
using Microsoft.EntityFrameworkCore;

namespace back_end.Services
{
    public class DisplayService : IDisplayService
    {
        private readonly AppDbContext _context;

        public DisplayService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<TodayStatsResponseDto> GetTodayStatsAsync()
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

            // ============ START SEATED COUNT ================= //

            int seated = await _context.QueueTickets
            .Where(t =>
                t.Status == "Seated" &&
                t.JoinedAt >= today &&
                t.JoinedAt < tomorrow)
            .CountAsync();

            // ============ END SEATED COUNT ================= //

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


            // ============ START ISSUED TICKET COUNT ================= //

            int issued = await _context.QueueTickets
            .Where(t =>
                t.Status == "Seated" &&
                t.JoinedAt >= today &&
                t.JoinedAt < tomorrow)
            .CountAsync();

            // ============ END ISSUED TICKET COUNT ================= //

            return new TodayStatsResponseDto
            {
                Waiting = waiting,
                Seated = seated,
                AverageWaitingTime = averageWaitingTime,
                IssuedTicket = issued,
            };
        }

        public async Task<SectionStatusResponseDto> GetSectionStatusAsync()
        {
            var today = DateTime.Today;
            var tomorrow = today.AddDays(1);

            // ============ START INDOOR COUNT ================= //
            int indoor = await _context.QueueTickets
            .Where(t =>
                t.Status == "Waiting" &&
                t.Section == "Indoor" &&
                t.JoinedAt >= today &&
                t.JoinedAt < tomorrow)
            .CountAsync();
            // ============ END INDOOR COUNT ================= //

            // ============ START OUTDOOR COUNT ================= //
            int outdoor = await _context.QueueTickets
            .Where(t =>
                t.Status == "Waiting" &&
                t.Section == "Outdoor" &&
                t.JoinedAt >= today &&
                t.JoinedAt < tomorrow)
            .CountAsync();
            // ============ END OUTDOOR COUNT ================= //

            // ============ START BAR COUNT ================= //
            int bar = await _context.QueueTickets
            .Where(t =>
                t.Status == "Waiting" &&
                t.Section == "Bar" &&
                t.JoinedAt >= today &&
                t.JoinedAt < tomorrow)
            .CountAsync();
            // ============ END BAR COUNT ================= //

            // ============ START VIP COUNT ================= //
            int vip = await _context.QueueTickets
            .Where(t =>
                t.Status == "Waiting" &&
                t.Section == "VIP" &&
                t.JoinedAt >= today &&
                t.JoinedAt < tomorrow)
            .CountAsync();
            // ============ END VIP COUNT ================= //

            return new SectionStatusResponseDto
            {
                Indoor = indoor,
                Outdoor = outdoor,
                Bar = bar,
                VIP = vip,
            };
        }

        public async Task<NowServingResponseDto?> GetNowServingAsync()
        {
            var today = DateTime.Today;
            var tomorrow = today.AddDays(1);

            // ============ START NOW SERVING ================= //

            var data = await _context.QueueTickets
            .Where(t =>
                t.Status == "Called" &&
                t.JoinedAt >= today &&
                t.JoinedAt < tomorrow &&
                t.CalledAt != null)
            .OrderBy(t => t.CalledAt)
            .FirstOrDefaultAsync();


            if (data == null)
                return null;


            // ============ END NOW SERVING ================= //

            return new NowServingResponseDto
            {
                TicketNumber = data.TicketNumber,
                GuestName = data.GuestName,
                PartySize = data.PartySize,
                JoinedAt = data.JoinedAt,
                Section = data.Section

            };
        }

    }
}
