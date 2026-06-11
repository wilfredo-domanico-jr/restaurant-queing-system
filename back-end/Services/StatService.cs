using back_end.DTO.Stats;

namespace back_end.Services
{
    public interface IStatService
    {
        Task<TodayStatsResponseDto> GetTodayStatsAsync();
    }
}
