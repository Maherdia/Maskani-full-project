using DataAccessLayer.DataAccess;
using DataAccessLayer.Interfaces;
using MaskaniBusinessLayer;
using MaskaniDataAccess.DataAccess;
using MaskaniDataAccess.DTOs;
using MaskaniDataAccess.Interfaces;
using MaskaniDataAccessLayer.DataAccess;
using MaskaniDataAccessLayer.DTOs;
//using DataAccessLayer.DataAccessTool
using Microsoft.OpenApi.Models;
using Repositry_DataAccess_.DataAccess;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();

// Register repositories 
builder.Services.AddScoped<IBasicRepository<clsPeopleDTO, clsAddPeopleDTO, clsUpdatePeopleDTO>, PeopleRepository>();
builder.Services.AddScoped<IStudentRepository, StudentRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IOwnerRepository, OwnerRepository>();
builder.Services.AddScoped<IPeopleRepository, PeopleRepository>();
builder.Services.AddScoped<IDormRepository, DormRepository>();
builder.Services.AddScoped<IUniversityRepository, UniversityRepository>();
builder.Services.AddScoped<IRoomRepository, RoomRepository>();
builder.Services.AddScoped<IBookingRepository, BookingRepository>();

// Register services
builder.Services.AddScoped<PeopleService>();
builder.Services.AddScoped<StudentService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<OwnerService>();
builder.Services.AddScoped<DormService>();
builder.Services.AddScoped<UniversityService>();
builder.Services.AddScoped<RoomService>();
builder.Services.AddScoped<BookingService>();

// Add CORS policy to allow frontend at localhost:8083 with credentials support
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowLocalhostFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:8083")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();   // <-- Add this line to allow credentials
    });
});

// Swagger configuration
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "MaskaniAPI", Version = "v1" });
});

var app = builder.Build();

// Enable Swagger UI only in development
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

// Enable CORS middleware - must be before routing
app.UseCors("AllowLocalhostFrontend");

app.UseAuthorization();

app.MapControllers();

app.Run();