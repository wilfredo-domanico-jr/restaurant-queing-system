
namespace back_end.DTO.Display
{
    public class UpNextResponseDto
    {

        public required string TicketNumber { get; set; }

        public required string GuestName { get; set; }

        public int WaitingMinutes { get; set; }
    }
}
