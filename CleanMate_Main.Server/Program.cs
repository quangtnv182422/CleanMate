using CleanMate_Main.Server.Models.DbContext;
using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Proxy.GGMail;
using CleanMate_Main.Server.Repository.CleanService.AllService;
using CleanMate_Main.Server.Repository.CleanService.CleanPerHour;
using CleanMate_Main.Server.Repository.Employee;
using CleanMate_Main.Server.SeedData;
using CleanMate_Main.Server.Services.Authentication;
using CleanMate_Main.Server.Services.CleanService.AllService;
using CleanMate_Main.Server.Services.CleanService.CleanPerHour;
using CleanMate_Main.Server.Services.Employee;
using CleanMate_Main.Server.Services.Smtp;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

//Kết nối DB
builder.Services.AddDbContext<CleanMateMainDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("MyCnn")));
builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
builder.Services.AddScoped<IEmployeeService, EmployeeService>();
//Cấu hình Identity DB
builder.Services.AddIdentity<AspNetUser, AspNetRole>(options =>
{
    //options.Password.RequiredLength = 6;
    //options.Password.RequireNonAlphanumeric = false;

    options.SignIn.RequireConfirmedAccount = true;
/*    options.Password.RequireDigit = false;                // Không yêu cầu mật khẩu phải chứa số
    options.Password.RequireLowercase = false;            // Không yêu cầu chữ cái thường
    options.Password.RequireUppercase = false;            // Không yêu cầu chữ cái hoa
    options.Password.RequireNonAlphanumeric = false;      // Không yêu cầu ký tự đặc biệt (ví dụ: @, #, !, ...)*/
    options.Password.RequiredLength = 6;                  // Yêu cầu mật khẩu có độ dài tối thiểu là 6 ký tự

    options.Lockout.AllowedForNewUsers = false;  // Vô hiệu hóa Lockout cho người dùng mới
   // options.Lockout.MaxFailedAccessAttempts = 5;  // Số lần thử đăng nhập sai tối đa
    options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
})
    .AddEntityFrameworkStores<CleanMateMainDbContext>()
    .AddDefaultTokenProviders();


//AuthenService
builder.Services.AddScoped<IAuthenService, AuthenService>();
//CleanPerHour
builder.Services.AddScoped<ICleanPerHourRepo, CleanPerHourRepo>();
builder.Services.AddScoped<ICleanPerHourService, CleanPerHourService>();
//All Clean Service
builder.Services.AddScoped<IAllServiceRepository, AllServiceRepository>();
builder.Services.AddScoped<IAllService_Service, AllService_Service>();
//emailSender
builder.Services.AddTransient<IEmailSender, EmailSender>();
builder.Services.AddTransient<IEmailService, EmailService>();


// Cấu hình JWT (dành cho API)
builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = builder.Configuration["Jwt:Issuer"],
        ValidAudience = builder.Configuration["Jwt:Audience"],
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
    };

    options.Events = new JwtBearerEvents
    {
        OnMessageReceived = context =>
        {
            // Lấy token từ cookie "jwt"
            var token = context.Request.Cookies["jwt"];
            if (!string.IsNullOrEmpty(token))
            {
                context.Token = token;
            }
            return Task.CompletedTask;
        }
    };
});

// Add CORS policy
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("https://localhost:60391") // React app origin
                  .AllowAnyMethod() // Allow GET, POST, etc.
                  .AllowAnyHeader() // Allow headers like Content-Type
                  .AllowCredentials(); // Allow cookies if needed
        });
});



var app = builder.Build();

//Add role tạm thời sau khi khở tạo
using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<AspNetRole>>();

    await RoleData.SeedRolesAsync(roleManager);
}


app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseRouting();
app.UseCors("AllowReactApp"); 
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
