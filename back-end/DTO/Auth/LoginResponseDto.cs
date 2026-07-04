namespace back_end.DTO.Auth
{
    public class LoginResponseDto
    {
        public required string Token { get; set; }
        public required DateTime ExpiresAt { get; set; }
    }
}
