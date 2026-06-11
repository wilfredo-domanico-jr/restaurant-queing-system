using back_end.DTO.Kiosk;


namespace back_end.Services
{
    public interface IKioskService
    {
        Task<CreateTicketResponseDto> CreateTicketAsync(CreateTicketDto order);
    }
}
