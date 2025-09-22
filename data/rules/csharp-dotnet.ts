import { Rule } from "../types";

export const rule: Rule = {
	id: "csharp-dotnet",
	slug: "csharp-dotnet",
	title: "C# .NET",
	description: "Best practices for C# and .NET development",
	
	categories: ["development", "best-practices"],tags: ["csharp", "dotnet", "aspnet", "entity-framework", "mvc"],
	votes: { up: 0, down: 0 },
	featured: false,
	createdAt: "2024-01-01",
	
	applicationMode: "intelligent",content: `# C# .NET Development Best Practices

## 1. Project Structure & Solution Organization

Organize your .NET solution with clear separation of concerns.

\`\`\`csharp
// MyApp.Domain/Models/User.cs
namespace MyApp.Domain.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public bool IsActive { get; set; } = true;

        public ICollection<Post> Posts { get; set; } = new List<Post>();
    }
}

// MyApp.Application/Services/IUserService.cs
namespace MyApp.Application.Services
{
    public interface IUserService
    {
        Task<User> GetUserByIdAsync(int id);
        Task<User> CreateUserAsync(CreateUserDto dto);
        Task<IEnumerable<User>> GetActiveUsersAsync();
    }
}
\`\`\`

## 2. Entity Framework Core Best Practices

Use EF Core efficiently with proper configuration and queries.

\`\`\`csharp
// MyApp.Infrastructure/Data/ApplicationDbContext.cs
using Microsoft.EntityFrameworkCore;

namespace MyApp.Infrastructure.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }
        public DbSet<Post> Posts { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
                entity.HasIndex(e => e.Email).IsUnique();

                entity.HasMany(e => e.Posts)
                      .WithOne(e => e.User)
                      .HasForeignKey(e => e.UserId)
                      .OnDelete(DeleteBehavior.Cascade);
            });

            base.OnModelCreating(modelBuilder);
        }
    }
}

// Repository pattern implementation
public class UserRepository : IUserRepository
{
    private readonly ApplicationDbContext _context;

    public UserRepository(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<User?> GetByIdAsync(int id)
    {
        return await _context.Users
            .Include(u => u.Posts)
            .FirstOrDefaultAsync(u => u.Id == id);
    }

    public async Task<IEnumerable<User>> GetActiveUsersAsync()
    {
        return await _context.Users
            .Where(u => u.IsActive)
            .OrderBy(u => u.Name)
            .ToListAsync();
    }
}
\`\`\`

## 3. ASP.NET Core Controllers

Build clean, testable controllers with proper dependency injection.

\`\`\`csharp
// MyApp.Api/Controllers/UsersController.cs
using Microsoft.AspNetCore.Mvc;
using MyApp.Application.Services;
using MyApp.Application.DTOs;

namespace MyApp.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private readonly IUserService _userService;
        private readonly ILogger<UsersController> _logger;

        public UsersController(IUserService userService, ILogger<UsersController> logger)
        {
            _userService = userService;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {
            try
            {
                var users = await _userService.GetActiveUsersAsync();
                var userDtos = users.Select(u => new UserDto
                {
                    Id = u.Id,
                    Name = u.Name,
                    Email = u.Email,
                    PostCount = u.Posts.Count
                });

                return Ok(userDtos);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error retrieving users");
                return StatusCode(500, "Internal server error");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            var user = await _userService.GetUserByIdAsync(id);

            if (user == null)
            {
                return NotFound();
            }

            return Ok(new UserDto
            {
                Id = user.Id,
                Name = user.Name,
                Email = user.Email,
                PostCount = user.Posts.Count
            });
        }

        [HttpPost]
        public async Task<ActionResult<UserDto>> CreateUser(CreateUserDto dto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            try
            {
                var user = await _userService.CreateUserAsync(dto);
                var userDto = new UserDto
                {
                    Id = user.Id,
                    Name = user.Name,
                    Email = user.Email,
                    PostCount = 0
                };

                return CreatedAtAction(nameof(GetUser), new { id = user.Id }, userDto);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(ex.Message);
            }
        }
    }
}
\`\`\`

## 4. Data Transfer Objects (DTOs)

Use DTOs for API contracts and data validation.

\`\`\`csharp
// MyApp.Application/DTOs/UserDto.cs
using System.ComponentModel.DataAnnotations;

namespace MyApp.Application.DTOs
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string Email { get; set; } = string.Empty;
        public int PostCount { get; set; }
    }

    public class CreateUserDto
    {
        [Required]
        [StringLength(100, MinimumLength = 2)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [EmailAddress]
        [StringLength(255)]
        public string Email { get; set; } = string.Empty;

        [StringLength(500)]
        public string? Bio { get; set; }
    }

    public class UpdateUserDto
    {
        [StringLength(100, MinimumLength = 2)]
        public string? Name { get; set; }

        [EmailAddress]
        [StringLength(255)]
        public string? Email { get; set; }

        [StringLength(500)]
        public string? Bio { get; set; }
    }
}
\`\`\`

## 5. Dependency Injection Configuration

Configure services and dependencies properly in Program.cs.

\`\`\`csharp
// Program.cs (.NET 6+)
using Microsoft.EntityFrameworkCore;
using MyApp.Infrastructure.Data;
using MyApp.Application.Services;
using MyApp.Infrastructure.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

// Register repositories
builder.Services.AddScoped<IUserRepository, UserRepository>();
builder.Services.AddScoped<IPostRepository, PostRepository>();

// Register services
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IPostService, PostService>();

// Add controllers and API explorer
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add authentication
builder.Services.AddAuthentication("Bearer")
    .AddJwtBearer("Bearer", options =>
    {
        options.Authority = builder.Configuration["Auth:Authority"];
        options.Audience = builder.Configuration["Auth:Audience"];
    });

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        policy => policy.WithOrigins("https://localhost:3000")
                        .AllowAnyHeader()
                        .AllowAnyMethod());
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();
app.UseCors("AllowSpecificOrigin");
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

app.Run();
\`\`\`

## 6. Service Layer Implementation

Implement business logic in service classes with proper error handling.

\`\`\`csharp
// MyApp.Application/Services/UserService.cs
using MyApp.Domain.Models;
using MyApp.Application.DTOs;
using MyApp.Infrastructure.Repositories;

namespace MyApp.Application.Services
{
    public class UserService : IUserService
    {
        private readonly IUserRepository _userRepository;
        private readonly ILogger<UserService> _logger;

        public UserService(IUserRepository userRepository, ILogger<UserService> logger)
        {
            _userRepository = userRepository;
            _logger = logger;
        }

        public async Task<User?> GetUserByIdAsync(int id)
        {
            if (id <= 0)
            {
                throw new ArgumentException("User ID must be positive", nameof(id));
            }

            return await _userRepository.GetByIdAsync(id);
        }

        public async Task<User> CreateUserAsync(CreateUserDto dto)
        {
            // Check if email already exists
            var existingUser = await _userRepository.GetByEmailAsync(dto.Email);
            if (existingUser != null)
            {
                throw new ArgumentException("Email already exists");
            }

            var user = new User
            {
                Name = dto.Name,
                Email = dto.Email.ToLowerInvariant(),
                CreatedAt = DateTime.UtcNow,
                IsActive = true
            };

            try
            {
                await _userRepository.AddAsync(user);
                await _userRepository.SaveChangesAsync();

                _logger.LogInformation("User created successfully: {UserId}", user.Id);
                return user;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error creating user: {Email}", dto.Email);
                throw;
            }
        }

        public async Task<IEnumerable<User>> GetActiveUsersAsync()
        {
            return await _userRepository.GetActiveUsersAsync();
        }
    }
}
\`\`\`

## 7. Unit Testing with xUnit

Write comprehensive unit tests for your application logic.

\`\`\`csharp
// MyApp.Tests/Services/UserServiceTests.cs
using Xunit;
using Moq;
using Microsoft.Extensions.Logging;
using MyApp.Application.Services;
using MyApp.Infrastructure.Repositories;
using MyApp.Domain.Models;
using MyApp.Application.DTOs;

namespace MyApp.Tests.Services
{
    public class UserServiceTests
    {
        private readonly Mock<IUserRepository> _mockUserRepository;
        private readonly Mock<ILogger<UserService>> _mockLogger;
        private readonly UserService _userService;

        public UserServiceTests()
        {
            _mockUserRepository = new Mock<IUserRepository>();
            _mockLogger = new Mock<ILogger<UserService>>();
            _userService = new UserService(_mockUserRepository.Object, _mockLogger.Object);
        }

        [Fact]
        public async Task GetUserByIdAsync_ValidId_ReturnsUser()
        {
            // Arrange
            var userId = 1;
            var expectedUser = new User { Id = userId, Name = "Test User" };
            _mockUserRepository.Setup(repo => repo.GetByIdAsync(userId))
                              .ReturnsAsync(expectedUser);

            // Act
            var result = await _userService.GetUserByIdAsync(userId);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(expectedUser.Id, result.Id);
            Assert.Equal(expectedUser.Name, result.Name);
        }

        [Theory]
        [InlineData(0)]
        [InlineData(-1)]
        public async Task GetUserByIdAsync_InvalidId_ThrowsArgumentException(int invalidId)
        {
            // Act & Assert
            await Assert.ThrowsAsync<ArgumentException>(
                () => _userService.GetUserByIdAsync(invalidId));
        }

        [Fact]
        public async Task CreateUserAsync_ValidDto_ReturnsCreatedUser()
        {
            // Arrange
            var dto = new CreateUserDto
            {
                Name = "New User",
                Email = "newuser@example.com"
            };

            _mockUserRepository.Setup(repo => repo.GetByEmailAsync(dto.Email))
                              .ReturnsAsync((User?)null);
            _mockUserRepository.Setup(repo => repo.AddAsync(It.IsAny<User>()))
                              .Returns(Task.CompletedTask);
            _mockUserRepository.Setup(repo => repo.SaveChangesAsync())
                              .Returns(Task.CompletedTask);

            // Act
            var result = await _userService.CreateUserAsync(dto);

            // Assert
            Assert.NotNull(result);
            Assert.Equal(dto.Name, result.Name);
            Assert.Equal(dto.Email.ToLowerInvariant(), result.Email);
            Assert.True(result.IsActive);
        }
    }
}
\`\`\`

## 8. Configuration and Secrets Management

Manage configuration and secrets securely.

\`\`\`json
// appsettings.json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "ConnectionStrings": {
    "DefaultConnection": "Server=(localdb)\\mssqllocaldb;Database=MyAppDb;Trusted_Connection=true;MultipleActiveResultSets=true"
  },
  "Auth": {
    "Authority": "https://localhost:5001",
    "Audience": "myapp-api"
  },
  "Email": {
    "SmtpHost": "smtp.gmail.com",
    "SmtpPort": 587,
    "UseSsl": true
  }
}
\`\`\`

\`\`\`csharp
// Configuration access in services
public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;

    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
    }

    public async Task SendEmailAsync(string to, string subject, string body)
    {
        var smtpHost = _configuration["Email:SmtpHost"];
        var smtpPort = _configuration.GetValue<int>("Email:SmtpPort");
        var useSsl = _configuration.GetValue<bool>("Email:UseSsl");

        // Email sending logic here
    }
}
\`\`\`

## 9. Middleware and Error Handling

Implement custom middleware for cross-cutting concerns.

\`\`\`csharp
// MyApp.Api/Middleware/ErrorHandlingMiddleware.cs
public class ErrorHandlingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ErrorHandlingMiddleware> _logger;

    public ErrorHandlingMiddleware(RequestDelegate next, ILogger<ErrorHandlingMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred");
            await HandleExceptionAsync(context, ex);
        }
    }

    private static async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        context.Response.ContentType = "application/json";

        var response = exception switch
        {
            ArgumentException argEx => new { error = argEx.Message, statusCode = 400 },
            UnauthorizedAccessException => new { error = "Unauthorized", statusCode = 401 },
            KeyNotFoundException => new { error = "Resource not found", statusCode = 404 },
            _ => new { error = "Internal server error", statusCode = 500 }
        };

        context.Response.StatusCode = response.statusCode;
        await context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }
}

// Register middleware in Program.cs
app.UseMiddleware<ErrorHandlingMiddleware>();
\`\`\`

## 10. Performance and Caching

Implement caching and performance optimizations.

\`\`\`csharp
// Add caching services
builder.Services.AddMemoryCache();
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = builder.Configuration.GetConnectionString("Redis");
});

// Service with caching
public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly IMemoryCache _cache;
    private readonly TimeSpan _cacheExpiration = TimeSpan.FromMinutes(15);

    public async Task<User?> GetUserByIdAsync(int id)
    {
        var cacheKey = $"user_{id}";

        if (_cache.TryGetValue(cacheKey, out User? cachedUser))
        {
            return cachedUser;
        }

        var user = await _userRepository.GetByIdAsync(id);

        if (user != null)
        {
            _cache.Set(cacheKey, user, _cacheExpiration);
        }

        return user;
    }

    public async Task<IEnumerable<User>> GetActiveUsersAsync()
    {
        return await _userRepository.GetActiveUsersAsync();
    }
}
\`\`\`

## Checklist

- [ ] Use proper project structure with separation of concerns
- [ ] Configure Entity Framework Core with proper mappings and relationships
- [ ] Implement repository pattern for data access abstraction
- [ ] Build clean, testable controllers with dependency injection
- [ ] Use DTOs for API contracts and data validation
- [ ] Configure services and dependencies in Program.cs
- [ ] Implement business logic in service classes with error handling
- [ ] Write comprehensive unit tests with mocking
- [ ] Manage configuration and secrets securely
- [ ] Implement custom middleware for cross-cutting concerns
- [ ] Use caching for performance optimization
- [ ] Follow C# naming conventions and coding standards
- [ ] Implement proper logging throughout the application
- [ ] Use async/await patterns consistently
- [ ] Handle exceptions gracefully with appropriate HTTP status codes`,
};
