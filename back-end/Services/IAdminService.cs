using back_end.Data;
using back_end.DTO.Admin;
using Microsoft.EntityFrameworkCore;

namespace back_end.Services
{
    public class AdminService : IAdminService
    {
        private readonly AppDbContext _context;

        public AdminService(AppDbContext context)
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

            // ============ START CALLED COUNT ================= //
            int called = await _context.QueueTickets
            .Where(t =>
                t.Status == "Called" &&
                t.JoinedAt >= today &&
                t.JoinedAt < tomorrow)
            .CountAsync();
            // ============ END CALLED COUNT ================= //


            // ============ START SEATED COUNT ================= //

            int seated = await _context.QueueTickets
            .Where(t =>
                t.Status == "Seated" &&
                t.JoinedAt >= today &&
                t.JoinedAt < tomorrow)
            .CountAsync();

            // ============ END SEATED COUNT ================= //

            // ============ START NO-SHOW COUNT ================= //

            int noShow = await _context.QueueTickets
            .Where(t =>
                t.Status == "No-Show" &&
                t.JoinedAt >= today &&
                t.JoinedAt < tomorrow)
            .CountAsync();

            // ============ END NO-SHOW COUNT ================= //

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

            return new TodayStatsResponseDto
            {
                Waiting = waiting,
                Called = called,
                Seated = seated,
                NoShow = noShow,
                AverageWaitingTime = averageWaitingTime
            };
        }


    }
}
