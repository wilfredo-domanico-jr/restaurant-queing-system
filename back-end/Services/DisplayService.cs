using back_end.DTO.Display;

namespace back_end.Services
{
    public interface IDisplayService
    {
        Task<TodayStatsResponseDto> GetTodayStatsAsync();
        Task<SectionStatusResponseDto> GetSectionStatusAsync();
        Task<NowServingResponseDto?> GetNowServingAsync();
    }
}
