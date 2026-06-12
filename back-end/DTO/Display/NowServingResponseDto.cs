
namespace back_end.DTO.Display
{
    public class NowServingResponseDto
    {

        public required string TicketNumber { get; set; }

        public required string GuestName { get; set; }

        public int PartySize { get; set; }

        public DateTime JoinedAt { get; set; }

        public required string Section { get; set; }
    }
}
