using DataAccessLayer.DataAccess;
using DataAccessLayer.Interfaces;
using MaskaniAPI;
using MaskaniAPI.Middleware;
using MaskaniBusinessLayer;
using MaskaniBusinessLayer.Utility;
using MaskaniDataAccess.DataAccess;
using MaskaniDataAccess.DTOs;
using MaskaniDataAccess.Interfaces;
using MaskaniDataAccessLayer.DataAccess;
using MaskaniDataAccessLayer.DTOs;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Repositry_DataAccess_.DataAccess;
using System.Text;
using System.Threading.RateLimiting;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddHttpContextAccessor();
builder.Services.AddScoped<CurrentUserService>();

builder.Services.AddHttpClient<clsEmailValidator>();
builder.Services.AddHttpClient<GeocodingService>();

builder.Services.AddScoped<
    IBasicRepository<
        clsPeopleDTO,
        clsAddPeopleDTO,
        clsUpdatePeopleDTO>,
    PeopleRepository>();

builder.Services.AddScoped<
    IStudentRepository,
    StudentRepository>();

builder.Services.AddScoped<
    IUserRepository,
    UserRepository>();

builder.Services.AddScoped<
    IOwnerRepository,
    OwnerRepository>();

builder.Services.AddScoped<
    IPeopleRepository,
    PeopleRepository>();

builder.Services.AddScoped<
    IDormRepository,
    DormRepository>();

builder.Services.AddScoped<
    IUniversityRepository,
    UniversityRepository>();

builder.Services.AddScoped<
    IRoomRepository,
    RoomRepository>();

builder.Services.AddScoped<
    IBookingRepository,
    BookingRepository>();

builder.Services.AddScoped<
    IDormImageRepository,
    DormImageRepository>();

builder.Services.AddScoped<
    IAcademicTermRepository,
    AcademicTermRepository>();

builder.Services.AddScoped<PeopleService>();
builder.Services.AddScoped<StudentService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<OwnerService>();
builder.Services.AddScoped<DormService>();
builder.Services.AddScoped<UniversityService>();
builder.Services.AddScoped<RoomService>();
builder.Services.AddScoped<BookingService>();
builder.Services.AddScoped<CloudinaryService>();
builder.Services.AddScoped<DormImageService>();
builder.Services.AddScoped<JwtService>();
builder.Services.AddScoped<AcademicTermService>();

string jwtKey =
    builder.Configuration["Jwt:Key"]
    ?? throw new InvalidOperationException(
        "JWT signing key is missing.");

string jwtIssuer =
    builder.Configuration["Jwt:Issuer"]
    ?? throw new InvalidOperationException(
        "JWT issuer is missing.");

string jwtAudience =
    builder.Configuration["Jwt:Audience"]
    ?? throw new InvalidOperationException(
        "JWT audience is missing.");

if (string.IsNullOrWhiteSpace(jwtKey))
{
    throw new InvalidOperationException(
        "JWT signing key is empty.");
}

if (Encoding.UTF8.GetByteCount(jwtKey) < 32)
{
    throw new InvalidOperationException(
        "JWT signing key must be at least 32 bytes long.");
}

builder.Services
    .AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme =
            JwtBearerDefaults.AuthenticationScheme;

        options.DefaultChallengeScheme =
            JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
    {
        options.RequireHttpsMetadata =
            !builder.Environment.IsDevelopment();

        options.SaveToken = false;

        options.TokenValidationParameters =
            new TokenValidationParameters
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,

                ValidIssuer = jwtIssuer,
                ValidAudience = jwtAudience,

                IssuerSigningKey =
                    new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(jwtKey)),

                ClockSkew = TimeSpan.Zero
            };
    });

builder.Services.AddAuthorization();

string[] allowedOrigins =
    builder.Configuration
        .GetSection("Cors:AllowedOrigins")
        .Get<string[]>()
    ?? Array.Empty<string>();

if (builder.Environment.IsDevelopment() &&
    allowedOrigins.Length == 0)
{
    allowedOrigins =
    [
        "http://localhost:5173"
    ];
}

if (!builder.Environment.IsDevelopment() &&
    allowedOrigins.Length == 0)
{
    throw new InvalidOperationException(
        "At least one production CORS origin must be configured.");
}

builder.Services.AddCors(options =>
{
    options.AddPolicy(
        "FrontendPolicy",
        policy =>
        {
            policy
                .WithOrigins(allowedOrigins)
                .AllowAnyHeader()
                .AllowAnyMethod();
        });
});

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode =
        StatusCodes.Status429TooManyRequests;

    options.OnRejected =
        async (context, cancellationToken) =>
        {
            context.HttpContext.Response.ContentType =
                "application/problem+json";

            await context.HttpContext.Response.WriteAsJsonAsync(
                new ProblemDetails
                {
                    Title = "Too many requests.",
                    Detail =
                        "Please wait before trying again.",
                    Status =
                        StatusCodes.Status429TooManyRequests
                },
                cancellationToken);
        };

    options.GlobalLimiter =
        PartitionedRateLimiter
            .Create<HttpContext, string>(
                context =>
                {
                    string partitionKey =
                        context.User.Identity?.IsAuthenticated == true
                            ? context.User.FindFirst(
                                    System.Security.Claims
                                        .ClaimTypes.NameIdentifier)
                                ?.Value
                              ?? context.Connection
                                  .RemoteIpAddress
                                  ?.ToString()
                              ?? "unknown"
                            : context.Connection
                                .RemoteIpAddress
                                ?.ToString()
                              ?? "unknown";

                    return RateLimitPartition
                        .GetFixedWindowLimiter(
                            partitionKey,
                            _ =>
                                new FixedWindowRateLimiterOptions
                                {
                                    PermitLimit = 100,
                                    Window =
                                        TimeSpan.FromMinutes(1),
                                    QueueLimit = 0,
                                    QueueProcessingOrder =
                                        QueueProcessingOrder
                                            .OldestFirst,
                                    AutoReplenishment = true
                                });
                });

    options.AddPolicy(
        "AuthPolicy",
        context =>
        {
            string partitionKey =
                context.Connection
                    .RemoteIpAddress
                    ?.ToString()
                ?? "unknown";

            return RateLimitPartition
                .GetFixedWindowLimiter(
                    partitionKey,
                    _ =>
                        new FixedWindowRateLimiterOptions
                        {
                            PermitLimit = 5,
                            Window =
                                TimeSpan.FromMinutes(1),
                            QueueLimit = 0,
                            QueueProcessingOrder =
                                QueueProcessingOrder
                                    .OldestFirst,
                            AutoReplenishment = true
                        });
        });
});

builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc(
        "v1",
        new OpenApiInfo
        {
            Title = "MaskaniAPI",
            Version = "v1"
        });

    options.AddSecurityDefinition(
        "Bearer",
        new OpenApiSecurityScheme
        {
            Name = "Authorization",
            Type = SecuritySchemeType.Http,
            Scheme = "Bearer",
            BearerFormat = "JWT",
            In = ParameterLocation.Header,
            Description =
                "Enter the JWT token. Swagger adds the Bearer prefix automatically."
        });

    options.AddSecurityRequirement(
        new OpenApiSecurityRequirement
        {
            {
                new OpenApiSecurityScheme
                {
                    Reference =
                        new OpenApiReference
                        {
                            Type =
                                ReferenceType.SecurityScheme,
                            Id = "Bearer"
                        }
                },
                Array.Empty<string>()
            }
        });
});

var app = builder.Build();

app.UseMiddleware<ExceptionMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
else
{
    app.UseHsts();
}

app.UseHttpsRedirection();

app.UseCors("FrontendPolicy");

app.UseRateLimiter();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();