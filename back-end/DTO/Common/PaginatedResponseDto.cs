
namespace back_end.DTO.Common
{
    public class PaginatedResponseDto<T>
    {

        public List<T> Items { get; set; } = [];
        public int Page { get; set; }
        public int PageSize { get; set; }
        public int TotalItems { get; set; }
        public int TotalPages { get; set; }
    }
}
