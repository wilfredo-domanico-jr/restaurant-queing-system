using back_end.Data;
using back_end.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Moq;

namespace back_end.Tests.TestHelpers
{
    public static class TestDbContextFactory
    {
        public static AppDbContext Create()
        {
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;

            return new AppDbContext(options);
        }
    }

    public static class MockHubContextFactory
    {
        public static Mock<IHubContext<QueueHub>> Create(out Mock<IClientProxy> clientProxy)
        {
            clientProxy = new Mock<IClientProxy>();

            var clients = new Mock<IHubClients>();
            clients.Setup(c => c.All).Returns(clientProxy.Object);

            var hubContext = new Mock<IHubContext<QueueHub>>();
            hubContext.Setup(h => h.Clients).Returns(clients.Object);

            return hubContext;
        }
    }
}
