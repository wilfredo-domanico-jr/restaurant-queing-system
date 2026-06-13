using back_end.Data;
using back_end.Middlewares;
using back_end.Services;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;

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
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

// Rate Limiting 
builder.Services.AddRateLimiter(options =>
{

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

// Swagger (dev only)
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseRateLimiter();
app.UseMiddleware<ApiKeyMiddleware>();
app.UseAuthorization();

app.MapControllers();

app.Run();