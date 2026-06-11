using System.ComponentModel.DataAnnotations;

namespace back_end.DTO.Stats
{
    public class TodayStatsResponseDto
    {

        public int Waiting { get; set; }

        public int Seated { get; set; }

        public double AverageWaitingTime { get; set; }

        public int IssuedTicket { get; set; }

    }
}
