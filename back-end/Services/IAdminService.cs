using back_end.Data;
using back_end.DTO.Admin;
using back_end.Hubs;
using back_end.Models;
using back_end.DTO.Common;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;

namespace back_end.Services
{
    public class AdminService : IAdminService
    {
        private readonly AppDbContext _context;
        private readonly IHubContext<QueueHub> _hub;

        public AdminService(AppDbContext context, IHubContext<QueueHub> hub)
        {
            _context = context;
            _hub = hub;
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


            // ============ START ACTIVITY LOGS ================= //
            var log = new ActivityLogs
            {
                Type = "Removed",
                Description = $"Removed: {queue.GuestName}",
                CreatedAt = DateTime.Now
            };

            // ============ END ACTIVITY LOGS ================= //

            _context.QueueTickets.Remove(queue);
            _context.ActivityLogs.Add(log);



            await _context.SaveChangesAsync();

            await _hub.Clients.All.SendAsync("queueUpdated");

            return true;

        }

        public async Task<bool> UpdateQueueStatusAsync(int id, string status)
        {
            var queue = await _context.QueueTickets.FindAsync(id);

            if (queue == null)
                return false;

            queue.Status = status;

            string description = "";

            if (status == "Called")
            {
                queue.CalledAt = DateTime.Now;
                description = $"Called {queue.TicketNumber} ({queue.GuestName})";
            }


            if (status == "Seated")
            {
                queue.SeatedAt = DateTime.Now;
                description = $"{queue.GuestName} seated";
            }

            if (status == "No-Show")
            {
                description = $"No-show: {queue.GuestName} ({queue.TicketNumber})";
            }


            // ============ START ACTIVITY LOGS ================= //
            var log = new ActivityLogs
            {
                Type = status,
                Description = description,
                CreatedAt = DateTime.Now
            };

            // ============ END ACTIVITY LOGS ================= //

            _context.ActivityLogs.Add(log);

            await _context.SaveChangesAsync();

            await _hub.Clients.All.SendAsync("queueUpdated");

            return true;
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

        public async Task<List<ActivityLogs>> GetTodayActivityLogAsync()
        {
            var today = DateTime.Today;
            var tomorrow = today.AddDays(1);

            var logs = await _context.ActivityLogs
                .Where(l => l.CreatedAt >= today && l.CreatedAt < tomorrow)
                .OrderByDescending(l => l.CreatedAt)
                .Take(5)
                .ToListAsync();

            return logs;
        }



    }
}
