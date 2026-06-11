using System.ComponentModel.DataAnnotations;

namespace back_end.DTO.Queue
{
    public class CreateTicketDto
    {
        [Range(1, 7)]
        public int PartySize { get; set; }

        [Required]
        [MaxLength(10)]
        public string Section { get; set; }

        [Required]
        [MaxLength(100)]
        public string GuestName { get; set; }

    }
}
