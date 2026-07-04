using System.Security.Cryptography;
using System.Text;

namespace back_end.Middlewares
{
    public class ApiKeyMiddleware
    {
        private readonly RequestDelegate _next;
        private const string HEADER_NAME = "x-api-key";

        public ApiKeyMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context, IConfiguration config)
        {
            var path = context.Request.Path;

            // Admin/Auth routes are protected by JWT bearer auth instead of the shared key.
            var requiresApiKey = path.StartsWithSegments("/api/kiosk") ||
                                  path.StartsWithSegments("/api/display");

            if (!requiresApiKey)
            {
                await _next(context);
                return;
            }

            if (!context.Request.Headers.TryGetValue(HEADER_NAME, out var extractedKey))
            {
                context.Response.StatusCode = 401;
                await context.Response.WriteAsync("API Key missing");
                return;
            }

            var apiKey = config.GetValue<string>("ApiKey");

            if (string.IsNullOrEmpty(apiKey) || !FixedTimeEquals(apiKey, extractedKey!))
            {
                context.Response.StatusCode = 403;
                await context.Response.WriteAsync("Invalid API Key");
                return;
            }

            await _next(context);
        }

        private static bool FixedTimeEquals(string expected, string actual)
        {
            var expectedBytes = Encoding.UTF8.GetBytes(expected);
            var actualBytes = Encoding.UTF8.GetBytes(actual);

            if (expectedBytes.Length != actualBytes.Length)
                return false;

            return CryptographicOperations.FixedTimeEquals(expectedBytes, actualBytes);
        }
    }
}