using back_end.DTO.Admin;

namespace back_end.Services
{
    public interface IAdminService
    {
        Task<TodayStatsResponseDto> GetTodayStatsAsync();
    }
}
