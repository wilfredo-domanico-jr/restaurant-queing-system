using System.ComponentModel.DataAnnotations;

namespace back_end.DTO.Queue
{
    public class CreateTicketResponseDto
    {
       
        public string TicketNumber { get; set; }

        public int EstimatedWaitMinutes { get; set; }

        public string GuestName { get; set; }

        public int PartySize { get; set; }

        public string Section { get; set; }

        public int PositionInQueue { get; set; }



    }
}
