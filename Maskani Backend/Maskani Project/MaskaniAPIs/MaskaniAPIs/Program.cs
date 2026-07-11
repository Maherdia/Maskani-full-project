using MaskaniBusinessLayer;
using MaskaniDataAccess.DataAccess;
using MaskaniDataAccess.DTOs;
using MaskaniDataAccess.Interfaces;
using MaskaniDataAccessLayer.DataAccess;
using MaskaniDataAccessLayer.DTOs;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();

// Register repositories
builder.Services.AddScoped<IBasicRepository<clsPeopleDTO, clsAddPeopleDTO, clsUpdatePeopleDTO>, PeopleRepository>();
builder.Services.AddScoped<IStudentRepository, StudentRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IOwnerRepository, OwnerRepository>();
builder.Services.AddScoped<IPeopleRepository, PeopleRepository>();


// Register services
builder.Services.AddScoped<PeopleService>();
builder.Services.AddScoped<StudentService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<OwnerService>();

// Configure Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "MaskaniAPI", Version = "v1" });
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapControllers();

app.Run();
