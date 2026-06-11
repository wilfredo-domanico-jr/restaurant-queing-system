using System.ComponentModel.DataAnnotations;

namespace back_end.Models
{
    public class QueueTickets
    {
        public int Id { get; set; } 

        public required string TicketNumber { get; set; }

        public required string GuestName { get; set; }

        public int PartySize { get; set; }

        public required string Section { get; set; }

        public required string Status { get; set; }

        public DateTime JoinedAt { get; set; }

        public DateTime? CalledAt { get; set; }

        public DateTime? SeatedAt { get; set; }

        public int? EstimatedWaitMinutes { get; set; }
    }
}
