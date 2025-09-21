import { Rule } from "../types";

export const phpLaravelRule: Rule = {
	id: "php-laravel",
	slug: "php-laravel",
	name: "PHP Laravel",
	description: "Best practices for Laravel PHP development",
	tags: ["php", "laravel", "mvc", "eloquent", "artisan"],
	votes: { up: 0, down: 0 },
	featured: false,
	createdAt: "2024-01-01",
	content: `# PHP Laravel Development Best Practices

## 1. Project Structure & Organization

Follow Laravel's conventional directory structure and naming patterns.

\`\`\`php
// app/Http/Controllers/UserController.php
<?php

namespace App\\Http\\Controllers;

use App\\Http\\Requests\\StoreUserRequest;
use App\\Models\\User;
use Illuminate\\Http\\Request;

class UserController extends Controller
{
    public function index()
    {
        return User::paginate(15);
    }

    public function store(StoreUserRequest $request)
    {
        return User::create($request->validated());
    }
}
\`\`\`

## 2. Eloquent Model Best Practices

Define relationships, use accessors/mutators, and implement proper validation.

\`\`\`php
// app/Models/User.php
<?php

namespace App\\Models;

use Illuminate\\Database\\Eloquent\\Factories\\HasFactory;
use Illuminate\\Database\\Eloquent\\Model;
use Illuminate\\Database\\Eloquent\\SoftDeletes;

class User extends Model
{
    use HasFactory, SoftDeletes;

    protected $fillable = ['name', 'email', 'password'];

    protected $hidden = ['password', 'remember_token'];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function posts()
    {
        return $this->hasMany(Post::class);
    }

    public function getFullNameAttribute()
    {
        return $this->first_name . ' ' . $this->last_name;
    }
}
\`\`\`

## 3. Form Request Validation

Use dedicated form request classes for complex validation logic.

\`\`\`php
// app/Http/Requests/StoreUserRequest.php
<?php

namespace App\\Http\\Requests;

use Illuminate\\Foundation\\Http\\FormRequest;

class StoreUserRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:8|confirmed',
        ];
    }

    public function messages()
    {
        return [
            'email.unique' => 'This email is already registered.',
        ];
    }
}
\`\`\`

## 4. Service Layer Pattern

Extract business logic into dedicated service classes.

\`\`\`php
// app/Services/UserService.php
<?php

namespace App\\Services;

use App\\Models\\User;
use Illuminate\\Support\\Facades\\Hash;
use Illuminate\\Support\\Facades\\Mail;

class UserService
{
    public function createUser(array $data): User
    {
        $user = User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        Mail::to($user)->send(new WelcomeEmail($user));

        return $user;
    }

    public function updateUserProfile(User $user, array $data): User
    {
        $user->update($data);

        return $user->refresh();
    }
}
\`\`\`

## 5. API Resource Transformation

Use API resources for consistent data transformation.

\`\`\`php
// app/Http/Resources/UserResource.php
<?php

namespace App\\Http\\Resources;

use Illuminate\\Http\\Resources\\Json\\JsonResource;

class UserResource extends JsonResource
{
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'email' => $this->email,
            'posts_count' => $this->posts_count,
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }
}
\`\`\`

## 6. Database Migrations & Seeders

Write clear, reversible migrations and useful seeders.

\`\`\`php
// database/migrations/create_users_table.php
<?php

use Illuminate\\Database\\Migrations\\Migration;
use Illuminate\\Database\\Schema\\Blueprint;
use Illuminate\\Support\\Facades\\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
            $table->softDeletes();

            $table->index(['email', 'deleted_at']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('users');
    }
};
\`\`\`

## 7. Job Queues & Background Processing

Use jobs for time-consuming tasks and proper queue configuration.

\`\`\`php
// app/Jobs/SendWelcomeEmail.php
<?php

namespace App\\Jobs;

use App\\Models\\User;
use Illuminate\\Bus\\Queueable;
use Illuminate\\Contracts\\Queue\\ShouldQueue;
use Illuminate\\Foundation\\Bus\\Dispatchable;
use Illuminate\\Queue\\InteractsWithQueue;
use Illuminate\\Queue\\SerializesModels;
use Illuminate\\Support\\Facades\\Mail;

class SendWelcomeEmail implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    public $tries = 3;
    public $timeout = 60;

    public function __construct(
        public User $user
    ) {}

    public function handle()
    {
        Mail::to($this->user)->send(new WelcomeEmail($this->user));
    }

    public function failed(Throwable $exception)
    {
        // Handle failed job
    }
}
\`\`\`

## 8. Middleware Implementation

Create custom middleware for authentication, authorization, and request handling.

\`\`\`php
// app/Http/Middleware/CheckUserRole.php
<?php

namespace App\\Http\\Middleware;

use Closure;
use Illuminate\\Http\\Request;

class CheckUserRole
{
    public function handle(Request $request, Closure $next, string $role)
    {
        if (!$request->user() || !$request->user()->hasRole($role)) {
            abort(403, 'Unauthorized action.');
        }

        return $next($request);
    }
}
\`\`\`

## 9. Testing Best Practices

Write comprehensive tests using Laravel's testing tools.

\`\`\`php
// tests/Feature/UserControllerTest.php
<?php

namespace Tests\\Feature;

use App\\Models\\User;
use Illuminate\\Foundation\\Testing\\RefreshDatabase;
use Tests\\TestCase;

class UserControllerTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_be_created()
    {
        $userData = [
            'name' => 'John Doe',
            'email' => 'john@example.com',
            'password' => 'password123',
            'password_confirmation' => 'password123',
        ];

        $response = $this->postJson('/api/users', $userData);

        $response->assertStatus(201)
                ->assertJsonStructure(['id', 'name', 'email']);

        $this->assertDatabaseHas('users', [
            'name' => 'John Doe',
            'email' => 'john@example.com',
        ]);
    }
}
\`\`\`

## 10. Performance Optimization

Implement caching, eager loading, and query optimization.

\`\`\`php
// Eager loading to prevent N+1 queries
$users = User::with(['posts', 'roles'])->get();

// Query scopes for reusable query logic
class User extends Model
{
    public function scopeActive($query)
    {
        return $query->where('active', true);
    }

    public function scopeWithPostsCount($query)
    {
        return $query->withCount('posts');
    }
}

// Caching expensive queries
$users = Cache::remember('active_users', 3600, function () {
    return User::active()->withPostsCount()->get();
});
\`\`\`

## Checklist

- [ ] Follow Laravel naming conventions for controllers, models, and routes
- [ ] Use form request validation for complex validation logic
- [ ] Implement proper Eloquent relationships and use eager loading
- [ ] Extract business logic into service classes
- [ ] Use API resources for consistent data transformation
- [ ] Write reversible database migrations with proper indexing
- [ ] Implement job queues for background processing
- [ ] Create custom middleware for cross-cutting concerns
- [ ] Write comprehensive feature and unit tests
- [ ] Optimize queries and implement appropriate caching strategies
- [ ] Use Laravel's built-in security features (CSRF, XSS protection)
- [ ] Follow RESTful API design principles
- [ ] Implement proper error handling and logging
- [ ] Use environment configuration for different deployment stages
- [ ] Keep dependencies updated and follow security best practices`,
};
