
namespace back_end.DTO.Kiosk
{
    public class CreateTicketResponseDto
    {

        public required string TicketNumber { get; set; }

        public int EstimatedWaitMinutes { get; set; }

        public required string GuestName { get; set; }

        public int PartySize { get; set; }

        public required string Section { get; set; }

        public int PositionInQueue { get; set; }



    }
}
