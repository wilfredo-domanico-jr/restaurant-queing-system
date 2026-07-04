using back_end.Models;
using back_end.Services;
using back_end.Tests.TestHelpers;
using Microsoft.AspNetCore.SignalR;
using Moq;

namespace back_end.Tests.Services
{
    public class AdminServiceTests
    {
        private static QueueTickets MakeTicket(string status, string section = "Indoor", DateTime? joinedAt = null, DateTime? seatedAt = null, DateTime? calledAt = null)
        {
            return new QueueTickets
            {
                TicketNumber = "T" + Guid.NewGuid().ToString("N")[..6],
                GuestName = "Guest",
                PartySize = 2,
                Section = section,
                Status = status,
                JoinedAt = joinedAt ?? DateTime.Now,
                SeatedAt = seatedAt,
                CalledAt = calledAt,
            };
        }

        [Fact]
        public async Task GetTodayStatsAsync_CountsPerStatusAndAveragesWaitTime()
        {
            using var context = TestDbContextFactory.Create();
            var joinedAt = DateTime.Now.AddMinutes(-30);
            var seatedAt = DateTime.Now.AddMinutes(-20);

            context.QueueTickets.AddRange(
                MakeTicket("Waiting"),
                MakeTicket("Waiting"),
                MakeTicket("Called"),
                MakeTicket("Seated", joinedAt: joinedAt, seatedAt: seatedAt),
                MakeTicket("No-Show")
            );
            await context.SaveChangesAsync();

            var hub = MockHubContextFactory.Create(out _);
            var service = new AdminService(context, hub.Object);

            var result = await service.GetTodayStatsAsync();

            Assert.Equal(2, result.Waiting);
            Assert.Equal(1, result.Called);
            Assert.Equal(1, result.Seated);
            Assert.Equal(1, result.NoShow);
            Assert.Equal(10, result.AverageWaitingTime, precision: 0);
        }

        [Fact]
        public async Task DeleteQueueAsync_RemovesTicketAndLogsActivity_ReturnsTrue()
        {
            using var context = TestDbContextFactory.Create();
            var ticket = MakeTicket("Waiting");
            context.QueueTickets.Add(ticket);
            await context.SaveChangesAsync();

            var hub = MockHubContextFactory.Create(out var proxy);
            var service = new AdminService(context, hub.Object);

            var result = await service.DeleteQueueAsync(ticket.Id);

            Assert.True(result);
            Assert.Empty(context.QueueTickets);
            Assert.Single(context.ActivityLogs);
            proxy.Verify(p => p.SendCoreAsync("queueUpdated", It.IsAny<object?[]>(), It.IsAny<System.Threading.CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task DeleteQueueAsync_UnknownId_ReturnsFalseAndDoesNotBroadcast()
        {
            using var context = TestDbContextFactory.Create();
            var hub = MockHubContextFactory.Create(out var proxy);
            var service = new AdminService(context, hub.Object);

            var result = await service.DeleteQueueAsync(999);

            Assert.False(result);
            proxy.Verify(p => p.SendCoreAsync(It.IsAny<string>(), It.IsAny<object?[]>(), It.IsAny<System.Threading.CancellationToken>()), Times.Never);
        }

        [Theory]
        [InlineData("Called")]
        [InlineData("Seated")]
        [InlineData("No-Show")]
        public async Task UpdateQueueStatusAsync_SetsTimestampsForStatus(string status)
        {
            using var context = TestDbContextFactory.Create();
            var ticket = MakeTicket("Waiting");
            context.QueueTickets.Add(ticket);
            await context.SaveChangesAsync();

            var hub = MockHubContextFactory.Create(out var proxy);
            var service = new AdminService(context, hub.Object);

            var result = await service.UpdateQueueStatusAsync(ticket.Id, status);

            Assert.True(result);
            var updated = await context.QueueTickets.FindAsync(ticket.Id);
            Assert.Equal(status, updated!.Status);

            if (status == "Called")
                Assert.NotNull(updated.CalledAt);

            if (status == "Seated")
                Assert.NotNull(updated.SeatedAt);

            proxy.Verify(p => p.SendCoreAsync("queueUpdated", It.IsAny<object?[]>(), It.IsAny<System.Threading.CancellationToken>()), Times.Once);
        }

        [Fact]
        public async Task UpdateQueueStatusAsync_UnknownId_ReturnsFalse()
        {
            using var context = TestDbContextFactory.Create();
            var hub = MockHubContextFactory.Create(out _);
            var service = new AdminService(context, hub.Object);

            var result = await service.UpdateQueueStatusAsync(999, "Called");

            Assert.False(result);
        }

        [Fact]
        public async Task GetSectionStatusAsync_CountsWaitingTicketsPerSection()
        {
            using var context = TestDbContextFactory.Create();
            context.QueueTickets.AddRange(
                MakeTicket("Waiting", section: "Indoor"),
                MakeTicket("Waiting", section: "Indoor"),
                MakeTicket("Waiting", section: "Outdoor"),
                MakeTicket("Waiting", section: "Bar"),
                MakeTicket("Waiting", section: "VIP"),
                MakeTicket("Called", section: "Indoor") // not counted: not Waiting
            );
            await context.SaveChangesAsync();

            var hub = MockHubContextFactory.Create(out _);
            var service = new AdminService(context, hub.Object);

            var result = await service.GetSectionStatusAsync();

            Assert.Equal(2, result.Indoor);
            Assert.Equal(1, result.Outdoor);
            Assert.Equal(1, result.Bar);
            Assert.Equal(1, result.VIP);
        }

        [Fact]
        public async Task GetTodayActivityLogAsync_ReturnsTop5OrderedByMostRecent()
        {
            using var context = TestDbContextFactory.Create();
            var today = DateTime.Today;

            for (var i = 0; i < 7; i++)
            {
                context.ActivityLogs.Add(new ActivityLogs
                {
                    Type = "Create",
                    Description = $"entry-{i}",
                    CreatedAt = today.AddHours(i),
                });
            }
            // an entry from yesterday should be excluded
            context.ActivityLogs.Add(new ActivityLogs
            {
                Type = "Create",
                Description = "yesterday",
                CreatedAt = today.AddDays(-1),
            });
            await context.SaveChangesAsync();

            var hub = MockHubContextFactory.Create(out _);
            var service = new AdminService(context, hub.Object);

            var result = await service.GetTodayActivityLogAsync();

            Assert.Equal(5, result.Count);
            Assert.Equal("entry-6", result[0].Description);
            Assert.DoesNotContain(result, l => l.Description == "yesterday");
        }
    }
}
