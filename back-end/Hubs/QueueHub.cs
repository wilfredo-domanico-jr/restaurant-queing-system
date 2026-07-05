using Microsoft.AspNetCore.SignalR;

namespace back_end.Hubs
{
    public class QueueHub : Hub
    {
        // I purposely made it empty and no methods. The reason is that it's for push-only hub.
        // Client never all it and they only listed to it, which i mapped at app.MapHub<QueHub>("/hubs/queue") in Program.cs

    }
}
