using Microsoft.EntityFrameworkCore;
using TodoList.Data;
using TodoList.Repositories;
using TodoList.Services;

var builder = WebApplication.CreateBuilder(args);

//  CORS-tjeneste
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",  
        builder => builder
            .WithOrigins("http://localhost:3000")  
            .AllowAnyHeader()
            .AllowAnyMethod());
});


builder.Services.AddControllersWithViews();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddScoped<ITodoRepository, TodoRepository>();
builder.Services.AddScoped<ITodoService, TodoService>();


builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();


if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}


app.UseCors("AllowReactApp");

app.UseHttpsRedirection();
app.UseStaticFiles();  
app.UseRouting();
app.UseAuthorization();


app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Todo}/{action=Index}/{id?}");


app.MapFallbackToFile("index.html");

app.Run();
