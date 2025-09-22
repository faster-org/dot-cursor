import { Rule } from "../types";

export const rule: Rule = {
	id: "rust-web-development",
	slug: "rust-web-development",
	title: "Rust Web Development with Axum and SQLx",
	tags: ["rust", "web", "axum", "sqlx", "backend", "tokio"],
	languages: ["rust"],
	description:
		"Build high-performance web APIs using Rust, Axum framework, and SQLx for database operations",
	content: `# Rust Web Development with Axum and SQLx

## 1. Project Setup and Dependencies

### Cargo.toml Configuration
\`\`\`toml
[package]
name = "rust-web-api"
version = "0.1.0"
edition = "2021"

[dependencies]
# Web framework
axum = { version = "0.7", features = ["macros"] }
tokio = { version = "1.0", features = ["full"] }
tower = "0.4"
tower-http = { version = "0.5", features = ["cors", "trace"] }

# Database
sqlx = { version = "0.7", features = ["runtime-tokio-rustls", "postgres", "uuid", "chrono", "migrate"] }

# Serialization
serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"

# Error handling
anyhow = "1.0"
thiserror = "1.0"

# Logging
tracing = "0.1"
tracing-subscriber = { version = "0.3", features = ["env-filter"] }

# Validation
validator = { version = "0.18", features = ["derive"] }

# Authentication
jsonwebtoken = "9.2"
argon2 = "0.5"

# Environment
dotenvy = "0.15"

# UUID and time
uuid = { version = "1.0", features = ["v4", "serde"] }
chrono = { version = "0.4", features = ["serde"] }

[dev-dependencies]
httptest = "0.15"
\`\`\`

### Project Structure
\`\`\`
src/
├── main.rs              # Application entry point
├── lib.rs               # Library root
├── config/              # Configuration management
│   └── mod.rs
├── handlers/            # HTTP request handlers
│   ├── mod.rs
│   ├── auth.rs
│   └── users.rs
├── models/              # Data models
│   ├── mod.rs
│   └── user.rs
├── middleware/          # Custom middleware
│   ├── mod.rs
│   └── auth.rs
├── database/            # Database setup and migrations
│   ├── mod.rs
│   └── connection.rs
├── services/            # Business logic
│   ├── mod.rs
│   └── user_service.rs
├── utils/               # Utility functions
│   ├── mod.rs
│   └── password.rs
└── errors/              # Error types
    └── mod.rs
migrations/              # Database migrations
tests/                   # Integration tests
\`\`\`

## 2. Database Setup with SQLx

### Database Configuration
\`\`\`rust
// src/config/mod.rs
use serde::Deserialize;

#[derive(Debug, Deserialize, Clone)]
pub struct Config {
    pub database_url: String,
    pub jwt_secret: String,
    pub server_port: u16,
    pub log_level: String,
}

impl Config {
    pub fn from_env() -> Result<Self, anyhow::Error> {
        dotenvy::dotenv().ok();

        Ok(Config {
            database_url: std::env::var("DATABASE_URL")
                .map_err(|_| anyhow::anyhow!("DATABASE_URL must be set"))?,
            jwt_secret: std::env::var("JWT_SECRET")
                .map_err(|_| anyhow::anyhow!("JWT_SECRET must be set"))?,
            server_port: std::env::var("PORT")
                .unwrap_or_else(|_| "3000".to_string())
                .parse()?,
            log_level: std::env::var("LOG_LEVEL")
                .unwrap_or_else(|_| "info".to_string()),
        })
    }
}
\`\`\`

### Database Connection
\`\`\`rust
// src/database/connection.rs
use sqlx::{PgPool, Pool, Postgres};
use tracing::info;

pub type DatabaseConnection = Pool<Postgres>;

pub async fn create_connection_pool(database_url: &str) -> Result<DatabaseConnection, sqlx::Error> {
    info!("Connecting to database...");

    let pool = PgPool::connect(database_url).await?;

    info!("Database connection established");
    Ok(pool)
}

pub async fn run_migrations(pool: &DatabaseConnection) -> Result<(), sqlx::Error> {
    info!("Running database migrations...");
    sqlx::migrate!("./migrations").run(pool).await?;
    info!("Migrations completed successfully");
    Ok(())
}
\`\`\`

### User Model
\`\`\`rust
// src/models/user.rs
use chrono::{DateTime, Utc};
use serde::{Deserialize, Serialize};
use sqlx::FromRow;
use uuid::Uuid;
use validator::Validate;

#[derive(Debug, Serialize, FromRow)]
pub struct User {
    pub id: Uuid,
    pub email: String,
    pub username: String,
    pub password_hash: String,
    pub is_active: bool,
    pub created_at: DateTime<Utc>,
    pub updated_at: DateTime<Utc>,
}

#[derive(Debug, Deserialize, Validate)]
pub struct CreateUserRequest {
    #[validate(email)]
    pub email: String,
    #[validate(length(min = 3, max = 50))]
    pub username: String,
    #[validate(length(min = 8))]
    pub password: String,
}

#[derive(Debug, Deserialize, Validate)]
pub struct LoginRequest {
    #[validate(email)]
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize)]
pub struct UserResponse {
    pub id: Uuid,
    pub email: String,
    pub username: String,
    pub is_active: bool,
    pub created_at: DateTime<Utc>,
}

impl From<User> for UserResponse {
    fn from(user: User) -> Self {
        Self {
            id: user.id,
            email: user.email,
            username: user.username,
            is_active: user.is_active,
            created_at: user.created_at,
        }
    }
}

#[derive(Debug, Serialize)]
pub struct AuthResponse {
    pub token: String,
    pub user: UserResponse,
}
\`\`\`

## 3. Error Handling

### Custom Error Types
\`\`\`rust
// src/errors/mod.rs
use axum::{
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use serde_json::json;
use thiserror::Error;

#[derive(Error, Debug)]
pub enum AppError {
    #[error("Database error: {0}")]
    Database(#[from] sqlx::Error),

    #[error("Validation error: {0}")]
    Validation(String),

    #[error("Authentication error: {0}")]
    Authentication(String),

    #[error("Authorization error: {0}")]
    Authorization(String),

    #[error("Not found: {0}")]
    NotFound(String),

    #[error("Internal server error: {0}")]
    Internal(#[from] anyhow::Error),

    #[error("Bad request: {0}")]
    BadRequest(String),
}

impl IntoResponse for AppError {
    fn into_response(self) -> Response {
        let (status, error_message) = match self {
            AppError::Database(ref err) => {
                tracing::error!("Database error: {:?}", err);
                (StatusCode::INTERNAL_SERVER_ERROR, "Internal server error")
            }
            AppError::Validation(ref msg) => (StatusCode::BAD_REQUEST, msg.as_str()),
            AppError::Authentication(ref msg) => (StatusCode::UNAUTHORIZED, msg.as_str()),
            AppError::Authorization(ref msg) => (StatusCode::FORBIDDEN, msg.as_str()),
            AppError::NotFound(ref msg) => (StatusCode::NOT_FOUND, msg.as_str()),
            AppError::Internal(ref err) => {
                tracing::error!("Internal error: {:?}", err);
                (StatusCode::INTERNAL_SERVER_ERROR, "Internal server error")
            }
            AppError::BadRequest(ref msg) => (StatusCode::BAD_REQUEST, msg.as_str()),
        };

        let body = Json(json!({
            "error": error_message,
            "status": status.as_u16()
        }));

        (status, body).into_response()
    }
}

pub type Result<T> = std::result::Result<T, AppError>;
\`\`\`

## 4. Authentication and JWT

### Password Utilities
\`\`\`rust
// src/utils/password.rs
use argon2::{
    password_hash::{rand_core::OsRng, PasswordHash, PasswordHasher, PasswordVerifier, SaltString},
    Argon2,
};
use crate::errors::{AppError, Result};

pub fn hash_password(password: &str) -> Result<String> {
    let salt = SaltString::generate(&mut OsRng);
    let argon2 = Argon2::default();

    let password_hash = argon2
        .hash_password(password.as_bytes(), &salt)
        .map_err(|e| AppError::Internal(anyhow::anyhow!("Failed to hash password: {}", e)))?
        .to_string();

    Ok(password_hash)
}

pub fn verify_password(password: &str, hash: &str) -> Result<bool> {
    let parsed_hash = PasswordHash::new(hash)
        .map_err(|e| AppError::Internal(anyhow::anyhow!("Invalid password hash: {}", e)))?;

    let argon2 = Argon2::default();

    Ok(argon2.verify_password(password.as_bytes(), &parsed_hash).is_ok())
}
\`\`\`

### JWT Middleware
\`\`\`rust
// src/middleware/auth.rs
use axum::{
    extract::{Request, State},
    http::header::AUTHORIZATION,
    middleware::Next,
    response::Response,
};
use jsonwebtoken::{decode, DecodingKey, Validation};
use serde::{Deserialize, Serialize};
use uuid::Uuid;

use crate::{errors::AppError, AppState};

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String, // User ID
    pub exp: usize,  // Expiration time
    pub iat: usize,  // Issued at
}

pub async fn auth_middleware(
    State(state): State<AppState>,
    mut request: Request,
    next: Next,
) -> Result<Response, AppError> {
    let auth_header = request
        .headers()
        .get(AUTHORIZATION)
        .and_then(|header| header.to_str().ok())
        .ok_or_else(|| AppError::Authentication("Missing authorization header".to_string()))?;

    let token = auth_header
        .strip_prefix("Bearer ")
        .ok_or_else(|| AppError::Authentication("Invalid authorization header format".to_string()))?;

    let claims = decode::<Claims>(
        token,
        &DecodingKey::from_secret(state.config.jwt_secret.as_ref()),
        &Validation::default(),
    )
    .map_err(|_| AppError::Authentication("Invalid token".to_string()))?;

    let user_id = Uuid::parse_str(&claims.sub)
        .map_err(|_| AppError::Authentication("Invalid user ID in token".to_string()))?;

    // Add user ID to request extensions
    request.extensions_mut().insert(user_id);

    Ok(next.run(request).await)
}
\`\`\`

## 5. Services Layer

### User Service
\`\`\`rust
// src/services/user_service.rs
use uuid::Uuid;
use chrono::Utc;
use sqlx::PgPool;

use crate::{
    models::user::{User, CreateUserRequest, UserResponse},
    utils::password::{hash_password, verify_password},
    errors::{AppError, Result},
};

pub struct UserService {
    db: PgPool,
}

impl UserService {
    pub fn new(db: PgPool) -> Self {
        Self { db }
    }

    pub async fn create_user(&self, request: CreateUserRequest) -> Result<UserResponse> {
        // Check if user already exists
        let existing = sqlx::query_as::<_, User>(
            "SELECT * FROM users WHERE email = $1 OR username = $2"
        )
        .bind(&request.email)
        .bind(&request.username)
        .fetch_optional(&self.db)
        .await?;

        if existing.is_some() {
            return Err(AppError::BadRequest("User already exists".to_string()));
        }

        // Hash password
        let password_hash = hash_password(&request.password)?;

        // Create user
        let user = sqlx::query_as::<_, User>(
            r#"
            INSERT INTO users (id, email, username, password_hash, is_active, created_at, updated_at)
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING *
            "#
        )
        .bind(Uuid::new_v4())
        .bind(&request.email)
        .bind(&request.username)
        .bind(&password_hash)
        .bind(true)
        .bind(Utc::now())
        .bind(Utc::now())
        .fetch_one(&self.db)
        .await?;

        Ok(user.into())
    }

    pub async fn authenticate_user(&self, email: &str, password: &str) -> Result<User> {
        let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE email = $1 AND is_active = true")
            .bind(email)
            .fetch_optional(&self.db)
            .await?
            .ok_or_else(|| AppError::Authentication("Invalid credentials".to_string()))?;

        if !verify_password(password, &user.password_hash)? {
            return Err(AppError::Authentication("Invalid credentials".to_string()));
        }

        Ok(user)
    }

    pub async fn get_user_by_id(&self, id: Uuid) -> Result<UserResponse> {
        let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE id = $1 AND is_active = true")
            .bind(id)
            .fetch_optional(&self.db)
            .await?
            .ok_or_else(|| AppError::NotFound("User not found".to_string()))?;

        Ok(user.into())
    }

    pub async fn list_users(&self, limit: i64, offset: i64) -> Result<Vec<UserResponse>> {
        let users = sqlx::query_as::<_, User>(
            "SELECT * FROM users WHERE is_active = true ORDER BY created_at DESC LIMIT $1 OFFSET $2"
        )
        .bind(limit)
        .bind(offset)
        .fetch_all(&self.db)
        .await?;

        Ok(users.into_iter().map(|user| user.into()).collect())
    }
}
\`\`\`

## 6. HTTP Handlers

### Authentication Handlers
\`\`\`rust
// src/handlers/auth.rs
use axum::{extract::State, http::StatusCode, Json};
use chrono::{Duration, Utc};
use jsonwebtoken::{encode, EncodingKey, Header};
use validator::Validate;

use crate::{
    models::user::{AuthResponse, CreateUserRequest, LoginRequest},
    middleware::auth::Claims,
    services::user_service::UserService,
    errors::{AppError, Result},
    AppState,
};

pub async fn register(
    State(state): State<AppState>,
    Json(request): Json<CreateUserRequest>,
) -> Result<(StatusCode, Json<AuthResponse>)> {
    // Validate request
    request.validate()
        .map_err(|e| AppError::Validation(format!("Validation error: {}", e)))?;

    let user_service = UserService::new(state.db.clone());
    let user = user_service.create_user(request).await?;

    // Generate JWT token
    let claims = Claims {
        sub: user.id.to_string(),
        exp: (Utc::now() + Duration::hours(24)).timestamp() as usize,
        iat: Utc::now().timestamp() as usize,
    };

    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(state.config.jwt_secret.as_ref()),
    )
    .map_err(|e| AppError::Internal(anyhow::anyhow!("Failed to generate token: {}", e)))?;

    let response = AuthResponse { token, user };

    Ok((StatusCode::CREATED, Json(response)))
}

pub async fn login(
    State(state): State<AppState>,
    Json(request): Json<LoginRequest>,
) -> Result<Json<AuthResponse>> {
    // Validate request
    request.validate()
        .map_err(|e| AppError::Validation(format!("Validation error: {}", e)))?;

    let user_service = UserService::new(state.db.clone());
    let user = user_service.authenticate_user(&request.email, &request.password).await?;

    // Generate JWT token
    let claims = Claims {
        sub: user.id.to_string(),
        exp: (Utc::now() + Duration::hours(24)).timestamp() as usize,
        iat: Utc::now().timestamp() as usize,
    };

    let token = encode(
        &Header::default(),
        &claims,
        &EncodingKey::from_secret(state.config.jwt_secret.as_ref()),
    )
    .map_err(|e| AppError::Internal(anyhow::anyhow!("Failed to generate token: {}", e)))?;

    let response = AuthResponse {
        token,
        user: user.into(),
    };

    Ok(Json(response))
}
\`\`\`

### User Handlers
\`\`\`rust
// src/handlers/users.rs
use axum::{
    extract::{Query, Request, State},
    Extension,
    Json,
};
use serde::Deserialize;
use uuid::Uuid;

use crate::{
    models::user::UserResponse,
    services::user_service::UserService,
    errors::Result,
    AppState,
};

#[derive(Deserialize)]
pub struct ListUsersQuery {
    #[serde(default = "default_limit")]
    pub limit: i64,
    #[serde(default)]
    pub offset: i64,
}

fn default_limit() -> i64 {
    20
}

pub async fn get_current_user(
    State(state): State<AppState>,
    Extension(user_id): Extension<Uuid>,
) -> Result<Json<UserResponse>> {
    let user_service = UserService::new(state.db.clone());
    let user = user_service.get_user_by_id(user_id).await?;
    Ok(Json(user))
}

pub async fn list_users(
    State(state): State<AppState>,
    Query(query): Query<ListUsersQuery>,
) -> Result<Json<Vec<UserResponse>>> {
    let user_service = UserService::new(state.db.clone());
    let users = user_service.list_users(query.limit.min(100), query.offset).await?;
    Ok(Json(users))
}
\`\`\`

## 7. Application Setup

### Main Application
\`\`\`rust
// src/main.rs
use axum::{
    middleware,
    routing::{get, post},
    Router,
};
use tower::ServiceBuilder;
use tower_http::{cors::CorsLayer, trace::TraceLayer};
use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};

mod config;
mod database;
mod errors;
mod handlers;
mod middleware;
mod models;
mod services;
mod utils;

use config::Config;
use database::connection::{create_connection_pool, run_migrations};

#[derive(Clone)]
pub struct AppState {
    pub db: sqlx::PgPool,
    pub config: Config,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Initialize tracing
    tracing_subscriber::registry()
        .with(
            tracing_subscriber::EnvFilter::try_from_default_env()
                .unwrap_or_else(|_| "rust_web_api=debug,tower_http=debug".into()),
        )
        .with(tracing_subscriber::fmt::layer())
        .init();

    // Load configuration
    let config = Config::from_env()?;

    // Create database connection pool
    let db = create_connection_pool(&config.database_url).await?;

    // Run migrations
    run_migrations(&db).await?;

    // Create application state
    let state = AppState { db, config: config.clone() };

    // Create router
    let app = create_router(state);

    // Start server
    let listener = tokio::net::TcpListener::bind(format!("0.0.0.0:{}", config.server_port)).await?;
    tracing::info!("Server starting on port {}", config.server_port);

    axum::serve(listener, app).await?;

    Ok(())
}

fn create_router(state: AppState) -> Router {
    // Public routes
    let public_routes = Router::new()
        .route("/auth/register", post(handlers::auth::register))
        .route("/auth/login", post(handlers::auth::login));

    // Protected routes
    let protected_routes = Router::new()
        .route("/users/me", get(handlers::users::get_current_user))
        .route("/users", get(handlers::users::list_users))
        .route_layer(middleware::from_fn_with_state(
            state.clone(),
            middleware::auth::auth_middleware,
        ));

    Router::new()
        .nest("/api", public_routes.merge(protected_routes))
        .layer(
            ServiceBuilder::new()
                .layer(TraceLayer::new_for_http())
                .layer(CorsLayer::permissive()),
        )
        .with_state(state)
}
\`\`\`

## 8. Database Migrations

### Initial Migration
\`\`\`sql
-- migrations/20240101000000_create_users_table.sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_created_at ON users(created_at);

-- Function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE
ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
\`\`\`

## 9. Testing

### Integration Tests
\`\`\`rust
// tests/integration_tests.rs
use axum::{
    body::Body,
    http::{Request, StatusCode},
    Router,
};
use serde_json::json;
use tower::ServiceExt;

use rust_web_api::{create_router, AppState, Config};

async fn setup_test_app() -> Router {
    let config = Config {
        database_url: "postgresql://test:test@localhost/test_db".to_string(),
        jwt_secret: "test_secret".to_string(),
        server_port: 3000,
        log_level: "debug".to_string(),
    };

    let db = sqlx::PgPool::connect(&config.database_url).await.unwrap();
    let state = AppState { db, config };

    create_router(state)
}

#[tokio::test]
async fn test_user_registration() {
    let app = setup_test_app().await;

    let request_body = json!({
        "email": "test@example.com",
        "username": "testuser",
        "password": "password123"
    });

    let response = app
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/api/auth/register")
                .header("content-type", "application/json")
                .body(Body::from(request_body.to_string()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::CREATED);
}

#[tokio::test]
async fn test_user_login() {
    let app = setup_test_app().await;

    // First register a user
    let register_body = json!({
        "email": "test@example.com",
        "username": "testuser",
        "password": "password123"
    });

    app.clone()
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/api/auth/register")
                .header("content-type", "application/json")
                .body(Body::from(register_body.to_string()))
                .unwrap(),
        )
        .await
        .unwrap();

    // Then login
    let login_body = json!({
        "email": "test@example.com",
        "password": "password123"
    });

    let response = app
        .oneshot(
            Request::builder()
                .method("POST")
                .uri("/api/auth/login")
                .header("content-type", "application/json")
                .body(Body::from(login_body.to_string()))
                .unwrap(),
        )
        .await
        .unwrap();

    assert_eq!(response.status(), StatusCode::OK);
}
\`\`\`

## Checklist for Rust Web Development

- [ ] Set up proper project structure with modules
- [ ] Configure SQLx with database connection pooling
- [ ] Implement comprehensive error handling with custom types
- [ ] Set up JWT authentication with secure password hashing
- [ ] Create service layer for business logic separation
- [ ] Implement input validation using validator crate
- [ ] Add proper logging with tracing
- [ ] Write database migrations for schema management
- [ ] Implement middleware for authentication and CORS
- [ ] Add comprehensive integration tests
- [ ] Configure environment variables properly
- [ ] Set up proper HTTP status codes and responses
- [ ] Implement pagination for list endpoints
- [ ] Add proper documentation with rustdoc`,
};
