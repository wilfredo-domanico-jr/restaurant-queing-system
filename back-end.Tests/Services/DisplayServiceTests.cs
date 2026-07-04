using back_end.Models;
using back_end.Services;
using back_end.Tests.TestHelpers;

namespace back_end.Tests.Services
{
    // Note: DisplayService.GetUpNextAsync (and AdminService.GetCurrentQueueAsync)
    // project EF.Functions.DateDiffMinute, a SQL Server-only translation with no
    // in-memory-provider equivalent — calling them against UseInMemoryDatabase
    // throws InvalidOperationException. They aren't covered here; verifying them
    // would require an integration test against a real SQL Server, which is out
    // of scope for these unit tests.
    public class DisplayServiceTests
    {
        [Fact]
        public async Task GetTodayStatsAsync_ReturnsWaitingSeatedAndIssuedCounts()
        {
            using var context = TestDbContextFactory.Create();
            var joinedAt = DateTime.Now.AddMinutes(-15);
            var seatedAt = DateTime.Now.AddMinutes(-5);

            context.QueueTickets.AddRange(
                new QueueTickets { TicketNumber = "T1", GuestName = "A", PartySize = 1, Section = "Indoor", Status = "Waiting", JoinedAt = DateTime.Now },
                new QueueTickets { TicketNumber = "T2", GuestName = "B", PartySize = 1, Section = "Indoor", Status = "Seated", JoinedAt = joinedAt, SeatedAt = seatedAt }
            );
            await context.SaveChangesAsync();

            var service = new DisplayService(context);
            var result = await service.GetTodayStatsAsync();

            Assert.Equal(1, result.Waiting);
            Assert.Equal(1, result.Seated);
            Assert.Equal(1, result.IssuedTicket);
            Assert.Equal(10, result.AverageWaitingTime, precision: 0);
        }

        [Fact]
        public async Task GetSectionStatusAsync_CountsWaitingTicketsPerSection()
        {
            using var context = TestDbContextFactory.Create();
            context.QueueTickets.AddRange(
                new QueueTickets { TicketNumber = "T1", GuestName = "A", PartySize = 1, Section = "Bar", Status = "Waiting", JoinedAt = DateTime.Now },
                new QueueTickets { TicketNumber = "T2", GuestName = "B", PartySize = 1, Section = "VIP", Status = "Waiting", JoinedAt = DateTime.Now },
                new QueueTickets { TicketNumber = "T3", GuestName = "C", PartySize = 1, Section = "Bar", Status = "Seated", JoinedAt = DateTime.Now }
            );
            await context.SaveChangesAsync();

            var service = new DisplayService(context);
            var result = await service.GetSectionStatusAsync();

            Assert.Equal(0, result.Indoor);
            Assert.Equal(0, result.Outdoor);
            Assert.Equal(1, result.Bar);
            Assert.Equal(1, result.VIP);
        }

        [Fact]
        public async Task GetNowServingAsync_ReturnsEarliestCalledTicket()
        {
            using var context = TestDbContextFactory.Create();
            var earlierCall = DateTime.Now.AddMinutes(-10);
            var laterCall = DateTime.Now.AddMinutes(-2);

            context.QueueTickets.AddRange(
                new QueueTickets { TicketNumber = "T1", GuestName = "First", PartySize = 1, Section = "Indoor", Status = "Called", JoinedAt = DateTime.Now, CalledAt = earlierCall },
                new QueueTickets { TicketNumber = "T2", GuestName = "Second", PartySize = 1, Section = "Indoor", Status = "Called", JoinedAt = DateTime.Now, CalledAt = laterCall }
            );
            await context.SaveChangesAsync();

            var service = new DisplayService(context);
            var result = await service.GetNowServingAsync();

            Assert.NotNull(result);
            Assert.Equal("First", result!.GuestName);
        }

        [Fact]
        public async Task GetNowServingAsync_NoCalledTickets_ReturnsNull()
        {
            using var context = TestDbContextFactory.Create();
            context.QueueTickets.Add(new QueueTickets { TicketNumber = "T1", GuestName = "A", PartySize = 1, Section = "Indoor", Status = "Waiting", JoinedAt = DateTime.Now });
            await context.SaveChangesAsync();

            var service = new DisplayService(context);
            var result = await service.GetNowServingAsync();

            Assert.Null(result);
        }
    }
}
