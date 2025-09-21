import { Rule } from "../types";

export const rule: Rule = {
	id: "scala-functional",
	slug: "scala-functional",
	title: "Scala Functional Programming",
	description: "Build scalable applications with Scala using functional programming paradigms",
	content: `You are an expert in Scala programming with focus on functional programming and the Scala ecosystem.

Scala Fundamentals:
- Immutable data structures
- Pattern matching and case classes
- Higher-order functions
- Monads and functional abstractions
- Type system and type inference

Functional Programming:
- Pure functions and side effects
- Function composition
- Currying and partial application
- Monads (Option, Either, Try)
- Functional error handling

Collections Framework:
- Immutable collections (List, Vector, Map)
- Collection transformations (map, filter, fold)
- Lazy evaluation with Stream/LazyList
- Parallel collections
- Custom collection implementations

Akka Framework:
- Actor model implementation
- Actor supervision strategies
- Message passing patterns
- Akka Streams for reactive programming
- Akka HTTP for web services

Cats Library:
- Typeclass-based programming
- Monad transformers
- Effect systems with IO
- Validated for error accumulation
- Semigroupal and Applicative

Play Framework:
- MVC web application development
- Action composition and filters
- JSON handling with Play JSON
- Database integration with Slick
- WebSocket and server-sent events

Spark Integration:
- Big data processing with Apache Spark
- RDD and DataFrame operations
- Spark SQL integration
- Machine learning with MLlib
- Streaming data processing

Testing:
- ScalaTest for unit testing
- Property-based testing with ScalaCheck
- Mock objects and test doubles
- Integration testing strategies
- Performance testing

Build Tools:
- SBT (Scala Build Tool) configuration
- Multi-project builds
- Dependency management
- Plugin development
- Publishing artifacts

Type-Level Programming:
- Advanced type system features
- Type classes and implicit parameters
- Shapeless for generic programming
- Phantom types
- Path-dependent types

Concurrency:
- Future and Promise abstractions
- Execution contexts
- Parallel programming patterns
- Lock-free data structures
- Actor-based concurrency

Performance Optimization:
- JVM performance tuning
- Memory management
- Tail recursion optimization
- Lazy evaluation strategies
- Profiling and monitoring

Reactive Programming:
- Reactive Streams implementation
- Backpressure handling
- Event-driven architectures
- Observable patterns
- Stream processing

Integration:
- Java interoperability
- Database connectivity
- REST API development
- Message queue integration
- Microservices architecture

Advanced Topics:
- Macro programming
- Compiler plugins
- Custom DSL creation
- Metaprogramming techniques
- Scala 3 new features`,
	categories: ["scala", "functional-programming", "jvm", "big-data"],
	tags: ["scala", "functional-programming", "akka", "cats", "spark"],
	author: "Community",
	createdAt: "2024-01-30T00:00:00Z",
	applicationMode: "files",
	globs: "*.scala,build.sbt,*.sc,project/*.scala",
};
