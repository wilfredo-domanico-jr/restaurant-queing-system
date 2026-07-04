using back_end.DTO.Kiosk;
using back_end.Models;
using back_end.Services;
using back_end.Tests.TestHelpers;
using Moq;

namespace back_end.Tests.Services
{
    public class KioskServiceTests
    {
        [Fact]
        public async Task CreateTicketAsync_CreatesTicketAndActivityLog_AndBroadcasts()
        {
            using var context = TestDbContextFactory.Create();
            var hub = MockHubContextFactory.Create(out var proxy);
            var service = new KioskService(context, hub.Object);

            var dto = new CreateTicketDto
            {
                PartySize = 3,
                Section = SectionType.Outdoor,
                GuestName = "Ada Lovelace",
            };

            var result = await service.CreateTicketAsync(dto);

            Assert.Equal("Ada Lovelace", result.GuestName);
            Assert.Equal(3, result.PartySize);
            Assert.Equal("Outdoor", result.Section);
            Assert.StartsWith("T", result.TicketNumber);
            Assert.Equal(1, result.PositionInQueue);

            var ticket = Assert.Single(context.QueueTickets);
            Assert.Equal("Waiting", ticket.Status);

            var log = Assert.Single(context.ActivityLogs);
            Assert.Equal("Create", log.Type);

            proxy.Verify(p => p.SendCoreAsync("queueUpdated", It.IsAny<object?[]>(), It.IsAny<CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task CreateTicketAsync_PositionInQueue_CountsOnlyEarlierWaitingTickets()
        {
            using var context = TestDbContextFactory.Create();
            var hub = MockHubContextFactory.Create(out _);
            var service = new KioskService(context, hub.Object);

            context.QueueTickets.AddRange(
                new QueueTickets { TicketNumber = "T1", GuestName = "A", PartySize = 1, Section = "Indoor", Status = "Waiting", JoinedAt = DateTime.Now },
                new QueueTickets { TicketNumber = "T2", GuestName = "B", PartySize = 1, Section = "Indoor", Status = "Seated", JoinedAt = DateTime.Now }
            );
            await context.SaveChangesAsync();

            var dto = new CreateTicketDto { PartySize = 1, Section = SectionType.Indoor, GuestName = "New Guest" };

            var result = await service.CreateTicketAsync(dto);

            // Only the 1 earlier "Waiting" ticket counts; the "Seated" one doesn't.
            Assert.Equal(2, result.PositionInQueue);
        }

        [Fact]
        public async Task GetStatsAsync_CountsWaitingAndServing()
        {
            using var context = TestDbContextFactory.Create();
            var hub = MockHubContextFactory.Create(out _);
            var service = new KioskService(context, hub.Object);

            context.QueueTickets.AddRange(
                new QueueTickets { TicketNumber = "T1", GuestName = "A", PartySize = 1, Section = "Indoor", Status = "Waiting", JoinedAt = DateTime.Now },
                new QueueTickets { TicketNumber = "T2", GuestName = "B", PartySize = 1, Section = "Indoor", Status = "Waiting", JoinedAt = DateTime.Now },
                new QueueTickets { TicketNumber = "T3", GuestName = "C", PartySize = 1, Section = "Indoor", Status = "Called", JoinedAt = DateTime.Now, CalledAt = DateTime.Now }
            );
            await context.SaveChangesAsync();

            var result = await service.GetStatsAsync();

            Assert.Equal(2, result.Waiting);
            Assert.Equal(1, result.NowServing);
        }
    }
}
