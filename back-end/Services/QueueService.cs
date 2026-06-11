using back_end.DTO.Queue;
using back_end.Models;

namespace back_end.Services
{
    public interface IQueueService
    {
        Task<CreateTicketResponseDto> CreateTicketAsync(CreateTicketDto order);
    }
}
