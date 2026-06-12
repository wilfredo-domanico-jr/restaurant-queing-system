
namespace back_end.DTO.Admin
{
    public class CurrentQueueResponseDto
    {
        public required string TicketNumber { get; set; }
        public required string GuestName { get; set; }
        public int PartySize { get; set; }
        public required string Section { get; set; }
        public int WaitingMinutes { get; set; }

        public DateTime JoinedAt { get; set; }
        public required string Status { get; set; }

    }
}
