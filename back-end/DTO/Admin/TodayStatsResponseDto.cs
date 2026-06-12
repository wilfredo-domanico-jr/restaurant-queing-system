
namespace back_end.DTO.Admin
{
    public class TodayStatsResponseDto
    {
        public int Waiting { get; set; }
        public int Called { get; set; }
        public int Seated { get; set; }
        public int NoShow { get; set; }
        public double AverageWaitingTime { get; set; }

    }
}
