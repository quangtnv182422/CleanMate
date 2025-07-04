﻿using CleanMate_Main.Server.Models.DbContext;
using CleanMate_Main.Server.Models.Entities;
using CleanMate_Main.Server.Proxy.GGMail;
using CleanMate_Main.Server.Proxy.Payos;
using CleanMate_Main.Server.Proxy.VietQR;
using CleanMate_Main.Server.Proxy.vnPay;
using CleanMate_Main.Server.Repository.Address;
using CleanMate_Main.Server.Repository.Bookings;
using CleanMate_Main.Server.Repository.CleanService.AllService;
using CleanMate_Main.Server.Repository.CleanService.CleanPerHour;
using CleanMate_Main.Server.Repository.Customer;
using CleanMate_Main.Server.Repository.Employee;
using CleanMate_Main.Server.Repository.Feedbacks;
using CleanMate_Main.Server.Repository.Payments;
using CleanMate_Main.Server.Repository.Transaction;
using CleanMate_Main.Server.Repository.Vouchers;
using CleanMate_Main.Server.Repository.Wallet;
using CleanMate_Main.Server.SeedData;
using CleanMate_Main.Server.Services.Address;
using CleanMate_Main.Server.Services.Authentication;
using CleanMate_Main.Server.Services.Bookings;
using CleanMate_Main.Server.Services.CleanService.AllService;
using CleanMate_Main.Server.Services.CleanService.CleanPerHour;
using CleanMate_Main.Server.Services.Customer;
using CleanMate_Main.Server.Services.Employee;
using CleanMate_Main.Server.Services.Feedbacks;
using CleanMate_Main.Server.Services.Payments;
using CleanMate_Main.Server.Services.Smtp;
using CleanMate_Main.Server.Services.Transaction;
using CleanMate_Main.Server.Services.Vouchers;
using CleanMate_Main.Server.Services.Wallet;
using CleanMate_Main.Server.SignalR;
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

//SignalR
builder.Services.AddSignalR();
//AuthenService
builder.Services.AddScoped<IAuthenService, AuthenService>();
//CleanPerHour
builder.Services.AddScoped<ICleanPerHourRepo, CleanPerHourRepo>();
builder.Services.AddScoped<ICleanPerHourService, CleanPerHourService>();
//All Clean Service
builder.Services.AddScoped<IAllServiceRepository, AllServiceRepository>();
builder.Services.AddScoped<IAllService_Service, AllService_Service>();
//All Employee Service
builder.Services.AddScoped<IEmployeeRepository, EmployeeRepository>();
builder.Services.AddScoped<IEmployeeService, EmployeeService>();
//Booking
builder.Services.AddScoped<IBookingRepository, BookingRepository>();
builder.Services.AddScoped<IBookingService, BookingService>();
//Address
builder.Services.AddScoped<IAddressRepository, AddressRepository>();
builder.Services.AddScoped<IAddressService, AddressService>();
//Wallet
builder.Services.AddScoped<IUserWalletRepo, UserWalletRepo>();
builder.Services.AddScoped<IUserWalletService, UserWalletService>();
//Transaction
builder.Services.AddScoped<ITransactionRepo, TransactionRepo>();
builder.Services.AddScoped<ITransactionService, TransactionService>();
//Payment
builder.Services.AddScoped<IPaymentRepo, PaymentRepo>();
builder.Services.AddScoped<IPaymentService, PaymentService>();
//Feedback
builder.Services.AddScoped<IFeedbackRepo, FeedbackRepo>();
builder.Services.AddScoped<IFeedbackService, FeedbackService>();
//Customer
builder.Services.AddScoped<ICustomerRepository, CustomerRepository>();
builder.Services.AddScoped<ICustomerService, CustomerService>();
//Voucher
builder.Services.AddScoped<IVoucherRepository, VoucherRepository>();
builder.Services.AddScoped<IVoucherService, VoucherService>();
//PayOS
builder.Services.AddScoped<IPayosService, PayosService>();
//emailSender
builder.Services.AddTransient<IEmailSender, EmailSender>();
builder.Services.AddTransient<IEmailService, EmailService>();
//vnPay
builder.Services.AddScoped<IVnPayService, VnPayService>();
//vietqr
builder.Services.AddScoped<IVIetQRService, VietQRService>();
//User Helper
builder.Services.AddScoped(typeof(CleanMate_Main.Server.Common.Utils.UserHelper<>));

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
/*builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp",
        policy =>
        {
            policy.WithOrigins("https://localhost:60391") // phần này sau nhớ phải đổi đọc ra từ file cấu hình ----------------------
                  .AllowAnyMethod() // Allow GET, POST, etc.
                  .AllowAnyHeader() // Allow headers like Content-Type
                  .AllowCredentials(); // Allow cookies if needed
        });
});*/
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        // Đọc origin từ appsettings.json
        var allowedOrigin = builder.Configuration["Cors:AllowedOrigin"];
        if (!string.IsNullOrEmpty(allowedOrigin))
        {
            policy.WithOrigins(allowedOrigin)
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials(); // Giữ nếu cần cookie/xác thực
        }
        else
        {
            // Fallback cho local hoặc lỗi cấu hình
            policy.WithOrigins("https://localhost:60391")
                  .AllowAnyMethod()
                  .AllowAnyHeader()
                  .AllowCredentials();
        }
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

app.MapHub<WorkHub>("/workHub");

app.MapFallbackToFile("/index.html");

app.Run();
