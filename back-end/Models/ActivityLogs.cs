

namespace back_end.Models
{
    public class ActivityLogs
    {
        public int Id { get; set; }

        public required string Type { get; set; }

        public required string Description { get; set; }

        public DateTime CreatedAt { get; set; }
    }
}
