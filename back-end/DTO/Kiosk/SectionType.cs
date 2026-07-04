using System.Text.Json.Serialization;

namespace back_end.DTO.Kiosk
{
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public enum SectionType
    {
        Indoor,
        Outdoor,
        Bar,
        VIP
    }
}
