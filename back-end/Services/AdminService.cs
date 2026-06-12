using back_end.DTO.Admin;
using back_end.DTO.Common;
using back_end.Models;
namespace back_end.Services
{
    public interface IAdminService
    {
        Task<TodayStatsResponseDto> GetTodayStatsAsync();
        Task<PaginatedResponseDto<CurrentQueueResponseDto>> GetCurrentQueueAsync(int page);
        Task<bool> DeleteQueueAsync(int id);
        Task<bool> UpdateQueueStatusAsync(int id, string status);

        Task<List<ActivityLogs>> GetTodayActivityLogAsync();
    }
}
