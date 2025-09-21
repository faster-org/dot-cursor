import { Rule } from "../types";

export const rustDevelopmentRule: Rule = {
	id: "rust-development",
	slug: "rust-development",
	name: "Rust Development",
	description: "Best practices for Rust systems programming",
	tags: ["rust", "systems", "performance", "safety", "cargo"],
	votes: { up: 0, down: 0 },
	featured: false,
	createdAt: "2024-01-01",
	content: `# Rust Development Best Practices

## 1. Project Structure & Cargo Management

Organize your Rust project with proper module structure and dependencies.

\`\`\`toml
# Cargo.toml
[package]
name = "my_app"
version = "0.1.0"
edition = "2021"
authors = ["Your Name <email@example.com>"]
license = "MIT OR Apache-2.0"
description = "A brief description of your project"
repository = "https://github.com/username/my_app"

[dependencies]
serde = { version = "1.0", features = ["derive"] }
tokio = { version = "1.0", features = ["full"] }
clap = { version = "4.0", features = ["derive"] }

[dev-dependencies]
criterion = "0.5"

[[bin]]
name = "main"
path = "src/main.rs"

[[bench]]
name = "benchmarks"
harness = false
\`\`\`

\`\`\`rust
// src/lib.rs
pub mod config;
pub mod database;
pub mod models;
pub mod services;
pub mod utils;

pub use config::Config;
pub use models::*;

pub type Result<T> = std::result::Result<T, Box<dyn std::error::Error>>;

pub async fn run(config: Config) -> Result<()> {
    // Application logic here
    Ok(())
}
\`\`\`

## 2. Error Handling & Result Types

Use Rust's error handling patterns effectively with Result and custom error types.

\`\`\`rust
// src/error.rs
use std::fmt;

#[derive(Debug)]
pub enum AppError {
    Database(DatabaseError),
    Network(NetworkError),
    Validation(String),
    NotFound(String),
}

impl fmt::Display for AppError {
    fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
        match self {
            AppError::Database(err) => write!(f, "Database error: {}", err),
            AppError::Network(err) => write!(f, "Network error: {}", err),
            AppError::Validation(msg) => write!(f, "Validation error: {}", msg),
            AppError::NotFound(msg) => write!(f, "Not found: {}", msg),
        }
    }
}

impl std::error::Error for AppError {}

// Custom Result type for convenience
pub type AppResult<T> = Result<T, AppError>;

// Service with proper error handling
pub struct UserService {
    db: Database,
}

impl UserService {
    pub async fn get_user(&self, id: u64) -> AppResult<User> {
        self.db
            .query_one("SELECT * FROM users WHERE id = ?", &[&id])
            .await
            .map_err(AppError::Database)?
            .ok_or_else(|| AppError::NotFound(format!("User with id {} not found", id)))
    }

    pub async fn create_user(&self, user: CreateUserRequest) -> AppResult<User> {
        if user.name.is_empty() {
            return Err(AppError::Validation("Name cannot be empty".to_string()));
        }

        let user = User {
            id: generate_id(),
            name: user.name,
            email: user.email,
            created_at: chrono::Utc::now(),
        };

        self.db
            .insert_user(&user)
            .await
            .map_err(AppError::Database)?;

        Ok(user)
    }
}
\`\`\`

## 3. Ownership, Borrowing & Lifetimes

Master Rust's ownership system for memory safety and performance.

\`\`\`rust
// Ownership patterns
pub struct UserManager {
    users: Vec<User>,
    cache: HashMap<u64, String>,
}

impl UserManager {
    // Taking ownership
    pub fn add_user(&mut self, user: User) {
        self.cache.insert(user.id, user.name.clone());
        self.users.push(user);
    }

    // Borrowing immutably
    pub fn get_user(&self, id: u64) -> Option<&User> {
        self.users.iter().find(|user| user.id == id)
    }

    // Borrowing mutably
    pub fn update_user_name(&mut self, id: u64, new_name: String) -> Result<(), &'static str> {
        if let Some(user) = self.users.iter_mut().find(|user| user.id == id) {
            user.name = new_name.clone();
            self.cache.insert(id, new_name);
            Ok(())
        } else {
            Err("User not found")
        }
    }

    // Lifetime annotations for returning references
    pub fn find_user_by_email<'a>(&'a self, email: &str) -> Option<&'a User> {
        self.users.iter().find(|user| user.email == email)
    }
}

// Zero-copy string processing
pub fn process_lines(input: &str) -> Vec<&str> {
    input
        .lines()
        .filter(|line| !line.is_empty())
        .collect()
}
\`\`\`

## 4. Traits & Generics

Leverage Rust's type system for code reuse and abstraction.

\`\`\`rust
// Custom traits
pub trait Validator {
    type Error;

    fn validate(&self) -> Result<(), Self::Error>;
}

pub trait Repository<T> {
    type Error;

    async fn find_by_id(&self, id: u64) -> Result<Option<T>, Self::Error>;
    async fn save(&self, entity: &T) -> Result<(), Self::Error>;
    async fn delete(&self, id: u64) -> Result<(), Self::Error>;
}

// Generic implementation
pub struct InMemoryRepository<T> {
    data: Arc<RwLock<HashMap<u64, T>>>,
}

impl<T: Clone + Send + Sync + 'static> Repository<T> for InMemoryRepository<T> {
    type Error = String;

    async fn find_by_id(&self, id: u64) -> Result<Option<T>, Self::Error> {
        let data = self.data.read().await;
        Ok(data.get(&id).cloned())
    }

    async fn save(&self, entity: &T) -> Result<(), Self::Error> {
        // Implementation would need id extraction logic
        Ok(())
    }

    async fn delete(&self, id: u64) -> Result<(), Self::Error> {
        let mut data = self.data.write().await;
        data.remove(&id);
        Ok(())
    }
}

// Trait bounds and where clauses
pub fn process_entities<T, R>(
    entities: Vec<T>,
    repository: R,
) -> impl Future<Output = Result<(), R::Error>>
where
    T: Validator + Send + Sync,
    R: Repository<T> + Send + Sync,
    R::Error: std::fmt::Debug,
{
    async move {
        for entity in entities {
            entity.validate().map_err(|_| "Validation failed")?;
            repository.save(&entity).await?;
        }
        Ok(())
    }
}
\`\`\`

## 5. Async Programming with Tokio

Build efficient async applications with proper concurrency patterns.

\`\`\`rust
// src/server.rs
use tokio::net::TcpListener;
use tokio::io::{AsyncReadExt, AsyncWriteExt};
use std::sync::Arc;

pub struct Server {
    listener: TcpListener,
    user_service: Arc<UserService>,
}

impl Server {
    pub async fn new(addr: &str, user_service: UserService) -> tokio::io::Result<Self> {
        let listener = TcpListener::bind(addr).await?;
        Ok(Self {
            listener,
            user_service: Arc::new(user_service),
        })
    }

    pub async fn run(&self) -> tokio::io::Result<()> {
        loop {
            let (mut socket, addr) = self.listener.accept().await?;
            let user_service = Arc::clone(&self.user_service);

            // Spawn a task for each connection
            tokio::spawn(async move {
                if let Err(e) = handle_connection(socket, user_service).await {
                    eprintln!("Error handling connection from {}: {}", addr, e);
                }
            });
        }
    }
}

async fn handle_connection(
    mut socket: TcpStream,
    user_service: Arc<UserService>,
) -> Result<(), Box<dyn std::error::Error>> {
    let mut buffer = [0; 1024];
    let n = socket.read(&mut buffer).await?;

    let request = String::from_utf8_lossy(&buffer[..n]);
    let response = process_request(&request, &user_service).await?;

    socket.write_all(response.as_bytes()).await?;
    Ok(())
}

// Concurrent processing with join and select
pub async fn batch_process_users(
    user_ids: Vec<u64>,
    user_service: Arc<UserService>,
) -> Result<Vec<User>, AppError> {
    use tokio::time::{timeout, Duration};

    let tasks: Vec<_> = user_ids
        .into_iter()
        .map(|id| {
            let service = Arc::clone(&user_service);
            tokio::spawn(async move {
                timeout(Duration::from_secs(5), service.get_user(id)).await
            })
        })
        .collect();

    let mut results = Vec::new();
    for task in tasks {
        match task.await {
            Ok(Ok(Ok(user))) => results.push(user),
            Ok(Ok(Err(e))) => return Err(e),
            Ok(Err(_)) => return Err(AppError::Network("Timeout".to_string())),
            Err(_) => return Err(AppError::Network("Task panicked".to_string())),
        }
    }

    Ok(results)
}
\`\`\`

## 6. Memory Management & Performance

Optimize memory usage and performance with Rust's zero-cost abstractions.

\`\`\`rust
// Efficient string handling
pub fn process_large_text(input: &str) -> String {
    let mut result = String::with_capacity(input.len());

    for line in input.lines() {
        if !line.trim().is_empty() {
            result.push_str(line.trim());
            result.push('\\n');
        }
    }

    result
}

// Using Box for heap allocation when needed
pub enum Node {
    Leaf(i32),
    Branch(Box<Node>, Box<Node>),
}

impl Node {
    pub fn new_branch(left: Node, right: Node) -> Self {
        Node::Branch(Box::new(left), Box::new(right))
    }
}

// Smart pointers for shared ownership
use std::rc::Rc;
use std::cell::RefCell;

pub struct Graph {
    nodes: Vec<Rc<RefCell<GraphNode>>>,
}

pub struct GraphNode {
    id: usize,
    value: i32,
    neighbors: Vec<Rc<RefCell<GraphNode>>>,
}

// Custom allocator usage (when needed)
use std::alloc::{GlobalAlloc, Layout};

struct MyAllocator;

unsafe impl GlobalAlloc for MyAllocator {
    unsafe fn alloc(&self, layout: Layout) -> *mut u8 {
        std::alloc::System.alloc(layout)
    }

    unsafe fn dealloc(&self, ptr: *mut u8, layout: Layout) {
        std::alloc::System.dealloc(ptr, layout)
    }
}

#[global_allocator]
static GLOBAL: MyAllocator = MyAllocator;
\`\`\`

## 7. Testing Strategies

Write comprehensive tests with Rust's built-in testing framework.

\`\`\`rust
// src/lib.rs
#[cfg(test)]
mod tests {
    use super::*;
    use tokio_test;

    #[test]
    fn test_user_validation() {
        let user = User {
            id: 1,
            name: "John Doe".to_string(),
            email: "john@example.com".to_string(),
            created_at: chrono::Utc::now(),
        };

        assert!(user.validate().is_ok());
    }

    #[test]
    fn test_empty_name_validation() {
        let user = User {
            id: 1,
            name: "".to_string(),
            email: "john@example.com".to_string(),
            created_at: chrono::Utc::now(),
        };

        assert!(user.validate().is_err());
    }

    #[tokio::test]
    async fn test_async_user_service() {
        let mut service = UserService::new();
        let user = service.create_user(CreateUserRequest {
            name: "Jane Doe".to_string(),
            email: "jane@example.com".to_string(),
        }).await.unwrap();

        assert_eq!(user.name, "Jane Doe");
        assert_eq!(user.email, "jane@example.com");
    }

    #[test]
    #[should_panic(expected = "Invalid input")]
    fn test_panic_case() {
        panic!("Invalid input");
    }
}

// Property-based testing with proptest
#[cfg(test)]
mod proptests {
    use super::*;
    use proptest::prelude::*;

    proptest! {
        #[test]
        fn test_string_processing(input in ".*") {
            let result = process_string(&input);
            assert!(result.len() >= 0);
        }

        #[test]
        fn test_number_operations(a in 0..1000i32, b in 0..1000i32) {
            let result = add_numbers(a, b);
            assert_eq!(result, a + b);
        }
    }
}

// Benchmark tests
#[cfg(test)]
mod benchmarks {
    use super::*;
    use criterion::{black_box, criterion_group, criterion_main, Criterion};

    fn benchmark_user_creation(c: &mut Criterion) {
        c.bench_function("create_user", |b| {
            b.iter(|| {
                let user = User {
                    id: black_box(1),
                    name: black_box("John Doe".to_string()),
                    email: black_box("john@example.com".to_string()),
                    created_at: chrono::Utc::now(),
                };
                black_box(user)
            })
        });
    }

    criterion_group!(benches, benchmark_user_creation);
    criterion_main!(benches);
}
\`\`\`

## 8. Serialization with Serde

Handle data serialization and deserialization efficiently.

\`\`\`rust
// src/models.rs
use serde::{Deserialize, Serialize};
use chrono::{DateTime, Utc};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub id: u64,
    pub name: String,
    pub email: String,
    #[serde(with = "chrono::serde::ts_seconds")]
    pub created_at: DateTime<Utc>,
    #[serde(skip_serializing_if = "Option::is_none")]
    pub last_login: Option<DateTime<Utc>>,
}

#[derive(Debug, Deserialize)]
pub struct CreateUserRequest {
    #[serde(deserialize_with = "deserialize_trimmed_string")]
    pub name: String,
    #[serde(deserialize_with = "deserialize_email")]
    pub email: String,
}

// Custom deserialization
fn deserialize_trimmed_string<'de, D>(deserializer: D) -> Result<String, D::Error>
where
    D: serde::Deserializer<'de>,
{
    let s = String::deserialize(deserializer)?;
    Ok(s.trim().to_string())
}

fn deserialize_email<'de, D>(deserializer: D) -> Result<String, D::Error>
where
    D: serde::Deserializer<'de>,
{
    let s = String::deserialize(deserializer)?;
    let email = s.trim().to_lowercase();

    if email.contains('@') {
        Ok(email)
    } else {
        Err(serde::de::Error::custom("Invalid email format"))
    }
}

// JSON handling
pub async fn load_users_from_file(path: &str) -> Result<Vec<User>, Box<dyn std::error::Error>> {
    let content = tokio::fs::read_to_string(path).await?;
    let users: Vec<User> = serde_json::from_str(&content)?;
    Ok(users)
}

pub async fn save_users_to_file(users: &[User], path: &str) -> Result<(), Box<dyn std::error::Error>> {
    let content = serde_json::to_string_pretty(users)?;
    tokio::fs::write(path, content).await?;
    Ok(())
}
\`\`\`

## 9. CLI Applications with Clap

Build robust command-line interfaces.

\`\`\`rust
// src/cli.rs
use clap::{Parser, Subcommand};

#[derive(Parser)]
#[command(name = "myapp")]
#[command(about = "A CLI application for user management")]
#[command(version = "1.0")]
pub struct Cli {
    #[command(subcommand)]
    pub command: Commands,

    #[arg(short, long, global = true)]
    pub verbose: bool,

    #[arg(long, global = true, default_value = "config.toml")]
    pub config: String,
}

#[derive(Subcommand)]
pub enum Commands {
    /// Create a new user
    Create {
        #[arg(short, long)]
        name: String,

        #[arg(short, long)]
        email: String,
    },
    /// List all users
    List {
        #[arg(short, long, default_value = "10")]
        limit: usize,
    },
    /// Delete a user
    Delete {
        #[arg(short, long)]
        id: u64,
    },
}

// src/main.rs
use clap::Parser;

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let cli = Cli::parse();

    // Initialize logging based on verbosity
    if cli.verbose {
        env_logger::Builder::from_env(env_logger::Env::default().default_filter_or("debug")).init();
    } else {
        env_logger::Builder::from_env(env_logger::Env::default().default_filter_or("info")).init();
    }

    // Load configuration
    let config = Config::from_file(&cli.config)?;
    let user_service = UserService::new(config.database_url).await?;

    match cli.command {
        Commands::Create { name, email } => {
            let user = user_service.create_user(CreateUserRequest { name, email }).await?;
            println!("Created user: {:?}", user);
        }
        Commands::List { limit } => {
            let users = user_service.list_users(limit).await?;
            for user in users {
                println!("{}: {} ({})", user.id, user.name, user.email);
            }
        }
        Commands::Delete { id } => {
            user_service.delete_user(id).await?;
            println!("Deleted user with id: {}", id);
        }
    }

    Ok(())
}
\`\`\`

## 10. Unsafe Rust & FFI

Use unsafe code responsibly when needed for performance or interoperability.

\`\`\`rust
// FFI with C libraries
use std::ffi::{CStr, CString};
use std::os::raw::{c_char, c_int};

extern "C" {
    fn external_function(input: *const c_char) -> c_int;
}

pub fn call_external_function(input: &str) -> Result<i32, Box<dyn std::error::Error>> {
    let c_input = CString::new(input)?;
    let result = unsafe { external_function(c_input.as_ptr()) };
    Ok(result)
}

// Unsafe operations with proper safety documentation
/// # Safety
///
/// This function is unsafe because it dereferences a raw pointer.
/// The caller must ensure that:
/// - \`ptr\` is valid and points to an initialized value of type T
/// - \`ptr\` is properly aligned
/// - The memory referenced by \`ptr\` is not accessed by any other code during the lifetime of the returned reference
pub unsafe fn get_value_unchecked<T>(ptr: *const T) -> &'static T {
    &*ptr
}

// Safe wrapper around unsafe operations
pub struct SafeBuffer {
    data: Vec<u8>,
    len: usize,
}

impl SafeBuffer {
    pub fn new(capacity: usize) -> Self {
        Self {
            data: Vec::with_capacity(capacity),
            len: 0,
        }
    }

    pub fn write_bytes(&mut self, bytes: &[u8]) -> Result<(), &'static str> {
        if self.len + bytes.len() > self.data.capacity() {
            return Err("Buffer overflow");
        }

        unsafe {
            let dst = self.data.as_mut_ptr().add(self.len);
            std::ptr::copy_nonoverlapping(bytes.as_ptr(), dst, bytes.len());
            self.len += bytes.len();
            self.data.set_len(self.len);
        }

        Ok(())
    }
}
\`\`\`

## Checklist

- [ ] Use Cargo.toml properly with appropriate metadata and dependencies
- [ ] Implement proper error handling with custom error types and Result
- [ ] Master ownership, borrowing, and lifetime management
- [ ] Leverage traits and generics for code reuse and type safety
- [ ] Build efficient async applications with Tokio
- [ ] Optimize memory usage and performance with zero-cost abstractions
- [ ] Write comprehensive tests including unit, integration, and property-based tests
- [ ] Use Serde for efficient serialization and deserialization
- [ ] Build robust CLI applications with Clap
- [ ] Use unsafe code responsibly with proper safety documentation
- [ ] Follow Rust naming conventions and idioms
- [ ] Implement proper logging and error reporting
- [ ] Use clippy and rustfmt for code quality and formatting
- [ ] Handle concurrency safely with Rust's type system
- [ ] Minimize allocations and use appropriate data structures`,
};
