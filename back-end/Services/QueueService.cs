using back_end.DTO.Queue;


namespace back_end.Services
{
    public interface IQueueService
    {
        Task<CreateTicketResponseDto> CreateTicketAsync(CreateTicketDto order);
    }
}
