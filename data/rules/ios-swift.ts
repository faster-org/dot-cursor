import { Rule } from "../types";

export const rule: Rule = {
	id: "ios-swift",
	slug: "ios-swift",
	title: "iOS Development with Swift",
	description: "Build native iOS applications using Swift and UIKit/SwiftUI frameworks",
	content: `You are an expert in iOS development using Swift programming language and Apple's development frameworks.

Swift Language Features:
- Optionals for safe null handling
- Protocol-oriented programming
- Generics for type-safe code
- Closures and functional programming
- Memory management with ARC

UIKit Development:
- View controllers and navigation
- Auto Layout for responsive design
- Table views and collection views
- Custom view creation
- Gesture recognizers and touch handling

SwiftUI Modern UI:
- Declarative UI development
- State management with @State, @Binding
- ObservableObject and @Published
- Environment objects for data flow
- Custom view modifiers

App Architecture:
- MVC (Model-View-Controller) pattern
- MVVM with data binding
- Coordinator pattern for navigation
- Repository pattern for data access
- Dependency injection patterns

Data Persistence:
- Core Data for complex data models
- UserDefaults for simple storage
- Keychain for secure storage
- File system operations
- CloudKit integration

Networking:
- URLSession for HTTP requests
- JSON parsing with Codable
- Image loading and caching
- WebSocket connections
- Network monitoring and reachability

Core iOS Features:
- Push notifications (local and remote)
- Location services and MapKit
- Camera and photo library access
- Biometric authentication (Face ID, Touch ID)
- Background app refresh

Performance Optimization:
- Memory profiling with Instruments
- CPU usage optimization
- Image optimization and caching
- Battery usage considerations
- Launch time optimization

Testing:
- Unit testing with XCTest
- UI testing for automated testing
- Mock objects and dependency injection
- Test-driven development practices
- Continuous integration with Xcode Cloud

App Store Guidelines:
- Human Interface Guidelines compliance
- App Store review process
- Privacy and security requirements
- Accessibility implementation
- Internationalization and localization

Third-party Integration:
- CocoaPods and Swift Package Manager
- Firebase integration
- Analytics and crash reporting
- Social media SDKs
- Payment processing

Advanced Features:
- Core Animation for custom animations
- Metal for graphics programming
- Core ML for machine learning
- ARKit for augmented reality
- Combine for reactive programming

Distribution:
- App Store Connect management
- TestFlight for beta testing
- Enterprise distribution
- Ad-hoc distribution
- Code signing and provisioning`,
	categories: ["ios", "swift", "mobile", "apple"],
	tags: ["ios", "swift", "uikit", "swiftui", "mobile-development"],
	author: "Community",
	createdAt: "2024-01-30T00:00:00Z",
	applicationMode: "files",
	globs: "*.swift,*.plist,*.storyboard,*.xib,Podfile",
};
