using System.ComponentModel.DataAnnotations;

namespace back_end.Models
{
    public class QueueTickets
    {
        public int Id { get; set; } 

        public string TicketNumber { get; set; }

        public string GuestName { get; set; }

        public int PartySize { get; set; }

        public string Section { get; set; }

        public string Status { get; set; }

        public DateTime JoinedAt { get; set; }

        public DateTime? CalledAt { get; set; }

        public DateTime? SeatedAt { get; set; }

        public int? EstimatedWaitMinutes { get; set; }
    }
}
