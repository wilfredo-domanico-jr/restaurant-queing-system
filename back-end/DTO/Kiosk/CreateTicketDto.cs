using System.ComponentModel.DataAnnotations;

namespace back_end.DTO.Kiosk
{
    public class CreateTicketDto
    {
        [Range(1, 7)]
        public int PartySize { get; set; }

        [Required]
        public required SectionType Section { get; set; }

        [Required]
        [MaxLength(100)]
        public required string GuestName { get; set; }

    }
}
