using System.Text;
using back_end.Data;
using back_end.Hubs;
using back_end.Middlewares;
using back_end.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Controllers
builder.Services.AddControllers();

// DB
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Services
builder.Services.AddScoped<IKioskService, KioskService>();
builder.Services.AddScoped<IDisplayService, DisplayService>();
builder.Services.AddScoped<IAdminService, AdminService>();

// SignalR (live queue updates)
builder.Services.AddSignalR();

// JWT auth (Admin dashboard)
var jwtSecret = builder.Configuration["Jwt:Secret"];

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtSecret ?? string.Empty)),
            ClockSkew = TimeSpan.FromMinutes(1)
        };
    });

builder.Services.AddAuthorization();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();


// For CORS in here i set the allowed url to acess the api - in this case its the frontend http://localhost:3000 which i put in appsettings
var allowedOrigins = builder.Configuration.GetSection("AllowedOrigins").Get<string[]>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy
            .WithOrigins(allowedOrigins!)
            // AllowAnyHeader rather than an explicit allow-list: the SignalR
            // client sends its own negotiation headers (X-Requested-With,
            // X-SignalR-User-Agent, ...) that would otherwise need to be
            // tracked here one by one. Origins and methods stay restricted.
            .AllowAnyHeader()
            .WithMethods("GET", "POST", "PATCH", "DELETE");
    });
});

// Rate Limiting 
builder.Services.AddRateLimiter(options =>
{

    // For Kiosk side (read-only)
    options.AddFixedWindowLimiter("kiosk-read", opt =>
    {
        opt.PermitLimit = 60;
        opt.Window = TimeSpan.FromMinutes(1);
    });

    // For Kiosk side (write)
    options.AddFixedWindowLimiter("kiosk-write", opt =>
    {
        opt.PermitLimit = 10;
        opt.Window = TimeSpan.FromMinutes(1);
    });


    // For Display side (read-only)
    options.AddFixedWindowLimiter("display-read", opt =>
    {
        opt.PermitLimit = 60;
        opt.Window = TimeSpan.FromMinutes(1);
    });

    // For Admin side (read-only)
    options.AddFixedWindowLimiter("admin-read", opt =>
    {
        opt.PermitLimit = 60;
        opt.Window = TimeSpan.FromMinutes(1);
    });


    // For Admin side (write)
    options.AddFixedWindowLimiter("admin-write", opt =>
  {
      opt.PermitLimit = 10;
      opt.Window = TimeSpan.FromMinutes(1);
  });

    options.RejectionStatusCode = 429;
});


var app = builder.Build();

// Apply pending EF Core migrations on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// Swagger (dev only)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHsts();
}

app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";
        await context.Response.WriteAsJsonAsync(new { message = "An unexpected error occurred." });
    });
});

app.Use(async (context, next) =>
{
    context.Response.Headers["X-Content-Type-Options"] = "nosniff";
    context.Response.Headers["X-Frame-Options"] = "DENY";
    await next();
});

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

// API key check happens before rate limiting so unauthenticated requests
// don't consume the shared rate-limit budget.
app.UseMiddleware<ApiKeyMiddleware>();
app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<QueueHub>("/hubs/queue");

app.Run();