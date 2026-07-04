using System.ComponentModel.DataAnnotations;

namespace back_end.DTO.Admin
{
    public class UpdateQueueStatusDto
    {
        [Required]
        [RegularExpression("^(Waiting|Called|Seated|No-Show)$")]
        public required string Status { get; set; }
    }
}
