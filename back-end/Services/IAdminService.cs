using back_end.Data;
using back_end.DTO.Admin;
using back_end.DTO.Common;
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

        public async Task<PaginatedResponseDto<CurrentQueueResponseDto>> GetCurrentQueueAsync(int page)
        {
            int pageSize = 5;
            var today = DateTime.Today;
            var tomorrow = today.AddDays(1);

            // ============ START CURRENT QUEUE ================= //
            var query = _context.QueueTickets
      .Where(t =>
          (t.Status == "Waiting" || t.Status == "Called") &&
          t.JoinedAt >= today &&
          t.JoinedAt < tomorrow);

            var totalItems = await query.CountAsync();

            var items = await query
                .OrderBy(t => t.JoinedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(t => new CurrentQueueResponseDto
                {
                    Id = t.Id,
                    TicketNumber = t.TicketNumber,
                    GuestName = t.GuestName,
                    PartySize = t.PartySize,
                    Section = t.Section,
                    WaitingMinutes = EF.Functions.DateDiffMinute(t.JoinedAt, DateTime.Now),
                    JoinedAt = t.JoinedAt,
                    Status = t.Status
                })
                .ToListAsync();

            // ============ END WAITING COUNT ================= //



            return new PaginatedResponseDto<CurrentQueueResponseDto>
            {
                Items = items,
                Page = page,
                PageSize = pageSize,
                TotalItems = totalItems,
                TotalPages = (int)Math.Ceiling((double)totalItems / pageSize)
            };
        }


        public async Task<bool> DeleteQueueAsync(int id)
        {
            var queue = await _context.QueueTickets
                .FirstOrDefaultAsync(x => x.Id == id);

            if (queue == null)
                return false;

            _context.QueueTickets.Remove(queue);
            await _context.SaveChangesAsync();

            return true;

        }

        public async Task<bool> UpdateQueueStatusAsync(int id, string status)
        {
            var queue = await _context.QueueTickets.FindAsync(id);

            if (queue == null)
                return false;

            queue.Status = status;


            if (status == "Called")
                queue.CalledAt = DateTime.Now;

            if (status == "Seated")
                queue.SeatedAt = DateTime.Now;

            await _context.SaveChangesAsync();

            return true;
        }

    }
}
