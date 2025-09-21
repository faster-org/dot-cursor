import { Rule } from "../types";

export const swiftIosRule: Rule = {
	id: "swift-ios",
	slug: "swift-ios",
	name: "Swift iOS Development",
	description: "Best practices for iOS app development with Swift",
	tags: ["swift", "ios", "mobile", "xcode", "app-development"],
	votes: { up: 0, down: 0 },
	featured: false,
	createdAt: "2024-01-01",
	content: `# Swift iOS Development Best Practices

## 1. Project Structure & Architecture

Organize your iOS project with clean architecture patterns.

\`\`\`swift
// MVVM Architecture Example
import UIKit
import Combine

// Model
struct User: Codable {
    let id: Int
    let name: String
    let email: String
    let avatarURL: URL?
}

// View Model
class UserViewModel: ObservableObject {
    @Published var users: [User] = []
    @Published var isLoading = false
    @Published var errorMessage: String?

    private let userService: UserServiceProtocol
    private var cancellables = Set<AnyCancellable>()

    init(userService: UserServiceProtocol = UserService()) {
        self.userService = userService
    }

    func loadUsers() {
        isLoading = true
        errorMessage = nil

        userService.fetchUsers()
            .receive(on: DispatchQueue.main)
            .sink(
                receiveCompletion: { [weak self] completion in
                    self?.isLoading = false
                    if case .failure(let error) = completion {
                        self?.errorMessage = error.localizedDescription
                    }
                },
                receiveValue: { [weak self] users in
                    self?.users = users
                }
            )
            .store(in: &cancellables)
    }
}

// View Controller
class UserListViewController: UIViewController {
    @IBOutlet weak var tableView: UITableView!
    @IBOutlet weak var activityIndicator: UIActivityIndicatorView!

    private let viewModel = UserViewModel()
    private var cancellables = Set<AnyCancellable>()

    override func viewDidLoad() {
        super.viewDidLoad()
        setupUI()
        bindViewModel()
        viewModel.loadUsers()
    }

    private func setupUI() {
        title = "Users"
        tableView.register(UserTableViewCell.self, forCellReuseIdentifier: "UserCell")
        tableView.dataSource = self
        tableView.delegate = self
    }

    private func bindViewModel() {
        viewModel.$users
            .receive(on: DispatchQueue.main)
            .sink { [weak self] _ in
                self?.tableView.reloadData()
            }
            .store(in: &cancellables)

        viewModel.$isLoading
            .receive(on: DispatchQueue.main)
            .sink { [weak self] isLoading in
                if isLoading {
                    self?.activityIndicator.startAnimating()
                } else {
                    self?.activityIndicator.stopAnimating()
                }
            }
            .store(in: &cancellables)
    }
}
\`\`\`

## 2. Networking & Data Management

Implement robust networking with proper error handling and caching.

\`\`\`swift
import Foundation
import Combine

// Network Service
protocol UserServiceProtocol {
    func fetchUsers() -> AnyPublisher<[User], NetworkError>
    func fetchUser(id: Int) -> AnyPublisher<User, NetworkError>
}

class UserService: UserServiceProtocol {
    private let session: URLSession
    private let baseURL = URL(string: "https://api.example.com")!

    init(session: URLSession = .shared) {
        self.session = session
    }

    func fetchUsers() -> AnyPublisher<[User], NetworkError> {
        let url = baseURL.appendingPathComponent("users")

        return session.dataTaskPublisher(for: url)
            .map(.data)
            .decode(type: [User].self, decoder: JSONDecoder())
            .mapError { error in
                if error is DecodingError {
                    return NetworkError.decodingError
                } else {
                    return NetworkError.networkError(error)
                }
            }
            .eraseToAnyPublisher()
    }

    func fetchUser(id: Int) -> AnyPublisher<User, NetworkError> {
        let url = baseURL.appendingPathComponent("users/\\(id)")

        return session.dataTaskPublisher(for: url)
            .map(.data)
            .decode(type: User.self, decoder: JSONDecoder())
            .mapError { error in
                if error is DecodingError {
                    return NetworkError.decodingError
                } else {
                    return NetworkError.networkError(error)
                }
            }
            .eraseToAnyPublisher()
    }
}

// Error Handling
enum NetworkError: Error, LocalizedError {
    case networkError(Error)
    case decodingError
    case invalidURL
    case noData

    var errorDescription: String? {
        switch self {
        case .networkError(let error):
            return "Network error: \\(error.localizedDescription)"
        case .decodingError:
            return "Failed to decode response"
        case .invalidURL:
            return "Invalid URL"
        case .noData:
            return "No data received"
        }
    }
}

// Core Data Manager
import CoreData

class CoreDataManager {
    static let shared = CoreDataManager()

    private init() {}

    lazy var persistentContainer: NSPersistentContainer = {
        let container = NSPersistentContainer(name: "DataModel")
        container.loadPersistentStores { _, error in
            if let error = error {
                fatalError("Core Data error: \\(error)")
            }
        }
        return container
    }()

    var context: NSManagedObjectContext {
        return persistentContainer.viewContext
    }

    func save() {
        if context.hasChanges {
            do {
                try context.save()
            } catch {
                print("Save error: \\(error)")
            }
        }
    }
}
\`\`\`

## 3. SwiftUI Modern UI Development

Build declarative user interfaces with SwiftUI.

\`\`\`swift
import SwiftUI

// SwiftUI View
struct UserListView: View {
    @StateObject private var viewModel = UserViewModel()
    @State private var searchText = ""

    var filteredUsers: [User] {
        if searchText.isEmpty {
            return viewModel.users
        } else {
            return viewModel.users.filter {
                $0.name.localizedCaseInsensitiveContains(searchText)
            }
        }
    }

    var body: some View {
        NavigationView {
            VStack {
                if viewModel.isLoading {
                    ProgressView("Loading users...")
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                } else {
                    List(filteredUsers, id: \\.id) { user in
                        NavigationLink(destination: UserDetailView(user: user)) {
                            UserRowView(user: user)
                        }
                    }
                    .searchable(text: $searchText, prompt: "Search users")
                    .refreshable {
                        await refreshUsers()
                    }
                }
            }
            .navigationTitle("Users")
            .onAppear {
                viewModel.loadUsers()
            }
            .alert("Error", isPresented: .constant(viewModel.errorMessage != nil)) {
                Button("OK") {
                    viewModel.errorMessage = nil
                }
            } message: {
                Text(viewModel.errorMessage ?? "")
            }
        }
    }

    private func refreshUsers() async {
        viewModel.loadUsers()
    }
}

// Custom View Components
struct UserRowView: View {
    let user: User

    var body: some View {
        HStack {
            AsyncImage(url: user.avatarURL) { image in
                image
                    .resizable()
                    .aspectRatio(contentMode: .fill)
            } placeholder: {
                Circle()
                    .fill(Color.gray.opacity(0.3))
            }
            .frame(width: 50, height: 50)
            .clipShape(Circle())

            VStack(alignment: .leading, spacing: 4) {
                Text(user.name)
                    .font(.headline)
                Text(user.email)
                    .font(.subheadline)
                    .foregroundColor(.secondary)
            }

            Spacer()
        }
        .padding(.vertical, 4)
    }
}

// View Modifiers
struct LoadingModifier: ViewModifier {
    let isLoading: Bool

    func body(content: Content) -> some View {
        ZStack {
            content
                .disabled(isLoading)
                .blur(radius: isLoading ? 2 : 0)

            if isLoading {
                ProgressView()
                    .scaleEffect(1.5)
            }
        }
    }
}

extension View {
    func loading(_ isLoading: Bool) -> some View {
        modifier(LoadingModifier(isLoading: isLoading))
    }
}
\`\`\`

## 4. Memory Management & Performance

Implement proper memory management and performance optimization.

\`\`\`swift
import UIKit

// Memory Management
class ImageCache {
    static let shared = ImageCache()
    private let cache = NSCache<NSString, UIImage>()

    private init() {
        cache.countLimit = 100
        cache.totalCostLimit = 50 * 1024 * 1024 // 50MB
    }

    func image(for key: String) -> UIImage? {
        return cache.object(forKey: key as NSString)
    }

    func setImage(_ image: UIImage, for key: String) {
        cache.setObject(image, forKey: key as NSString)
    }
}

// Weak References and Closures
class NetworkManager {
    func fetchData(completion: @escaping (Result<Data, Error>) -> Void) {
        URLSession.shared.dataTask(with: URL(string: "https://api.example.com")!) { data, response, error in
            DispatchQueue.main.async {
                if let error = error {
                    completion(.failure(error))
                } else if let data = data {
                    completion(.success(data))
                }
            }
        }.resume()
    }
}

class ViewController: UIViewController {
    private let networkManager = NetworkManager()

    override func viewDidLoad() {
        super.viewDidLoad()

        // Use weak self to avoid retain cycles
        networkManager.fetchData { [weak self] result in
            switch result {
            case .success(let data):
                self?.handleSuccess(data)
            case .failure(let error):
                self?.handleError(error)
            }
        }
    }

    private func handleSuccess(_ data: Data) {
        // Handle success
    }

    private func handleError(_ error: Error) {
        // Handle error
    }
}

// Lazy Loading
class UserProfileViewController: UIViewController {
    @IBOutlet weak var profileImageView: UIImageView!

    private lazy var imagePickerController: UIImagePickerController = {
        let picker = UIImagePickerController()
        picker.delegate = self
        picker.sourceType = .photoLibrary
        return picker
    }()

    @IBAction func selectImageTapped(_ sender: UIButton) {
        present(imagePickerController, animated: true)
    }
}
\`\`\`

## 5. Testing Strategies

Implement comprehensive testing with unit tests, UI tests, and snapshot tests.

\`\`\`swift
import XCTest
@testable import MyApp

// Unit Tests
class UserViewModelTests: XCTestCase {
    var viewModel: UserViewModel!
    var mockUserService: MockUserService!

    override func setUp() {
        super.setUp()
        mockUserService = MockUserService()
        viewModel = UserViewModel(userService: mockUserService)
    }

    override func tearDown() {
        viewModel = nil
        mockUserService = nil
        super.tearDown()
    }

    func testLoadUsersSuccess() {
        // Given
        let expectedUsers = [
            User(id: 1, name: "John Doe", email: "john@example.com", avatarURL: nil)
        ]
        mockUserService.mockUsers = expectedUsers

        let expectation = XCTestExpectation(description: "Users loaded")

        // When
        viewModel.$users
            .dropFirst()
            .sink { users in
                XCTAssertEqual(users.count, 1)
                XCTAssertEqual(users.first?.name, "John Doe")
                expectation.fulfill()
            }
            .store(in: &cancellables)

        viewModel.loadUsers()

        // Then
        wait(for: [expectation], timeout: 1.0)
    }

    func testLoadUsersFailure() {
        // Given
        mockUserService.shouldReturnError = true

        let expectation = XCTestExpectation(description: "Error message set")

        // When
        viewModel.$errorMessage
            .compactMap { $0 }
            .sink { errorMessage in
                XCTAssertFalse(errorMessage.isEmpty)
                expectation.fulfill()
            }
            .store(in: &cancellables)

        viewModel.loadUsers()

        // Then
        wait(for: [expectation], timeout: 1.0)
    }
}

// Mock Service
class MockUserService: UserServiceProtocol {
    var mockUsers: [User] = []
    var shouldReturnError = false

    func fetchUsers() -> AnyPublisher<[User], NetworkError> {
        if shouldReturnError {
            return Fail(error: NetworkError.networkError(NSError(domain: "Test", code: 0)))
                .eraseToAnyPublisher()
        } else {
            return Just(mockUsers)
                .setFailureType(to: NetworkError.self)
                .eraseToAnyPublisher()
        }
    }

    func fetchUser(id: Int) -> AnyPublisher<User, NetworkError> {
        if let user = mockUsers.first(where: { $0.id == id }) {
            return Just(user)
                .setFailureType(to: NetworkError.self)
                .eraseToAnyPublisher()
        } else {
            return Fail(error: NetworkError.noData)
                .eraseToAnyPublisher()
        }
    }
}

// UI Tests
class MyAppUITests: XCTestCase {
    var app: XCUIApplication!

    override func setUp() {
        super.setUp()
        app = XCUIApplication()
        app.launch()
    }

    func testUserListNavigation() {
        let userListTable = app.tables["UserListTable"]
        XCTAssertTrue(userListTable.waitForExistence(timeout: 5))

        let firstCell = userListTable.cells.firstMatch
        XCTAssertTrue(firstCell.exists)

        firstCell.tap()

        let userDetailView = app.otherElements["UserDetailView"]
        XCTAssertTrue(userDetailView.waitForExistence(timeout: 3))
    }
}
\`\`\`

## 6. Security & Privacy

Implement security best practices and privacy protection.

\`\`\`swift
import Security
import LocalAuthentication

// Keychain Helper
class KeychainHelper {
    static let shared = KeychainHelper()

    private init() {}

    func save(key: String, data: Data) -> Bool {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecValueData as String: data
        ]

        SecItemDelete(query as CFDictionary)
        return SecItemAdd(query as CFDictionary, nil) == errSecSuccess
    }

    func load(key: String) -> Data? {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key,
            kSecReturnData as String: true,
            kSecMatchLimit as String: kSecMatchLimitOne
        ]

        var result: AnyObject?
        let status = SecItemCopyMatching(query as CFDictionary, &result)

        return status == errSecSuccess ? result as? Data : nil
    }

    func delete(key: String) -> Bool {
        let query: [String: Any] = [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrAccount as String: key
        ]

        return SecItemDelete(query as CFDictionary) == errSecSuccess
    }
}

// Biometric Authentication
class BiometricAuthManager {
    static let shared = BiometricAuthManager()

    private init() {}

    func authenticateUser(completion: @escaping (Bool, Error?) -> Void) {
        let context = LAContext()
        var error: NSError?

        if context.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &error) {
            let reason = "Authenticate to access your account"

            context.evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, localizedReason: reason) { success, authError in
                DispatchQueue.main.async {
                    completion(success, authError)
                }
            }
        } else {
            DispatchQueue.main.async {
                completion(false, error)
            }
        }
    }
}

// Network Security
class SecureNetworkManager {
    private let session: URLSession

    init() {
        let configuration = URLSessionConfiguration.default
        configuration.timeoutIntervalForRequest = 30
        configuration.timeoutIntervalForResource = 60

        self.session = URLSession(
            configuration: configuration,
            delegate: NetworkDelegate(),
            delegateQueue: nil
        )
    }

    func makeSecureRequest(url: URL, completion: @escaping (Result<Data, Error>) -> Void) {
        var request = URLRequest(url: url)
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        // Add authentication header
        if let token = getAuthToken() {
            request.setValue("Bearer \\(token)", forHTTPHeaderField: "Authorization")
        }

        session.dataTask(with: request) { data, response, error in
            DispatchQueue.main.async {
                if let error = error {
                    completion(.failure(error))
                } else if let data = data {
                    completion(.success(data))
                }
            }
        }.resume()
    }

    private func getAuthToken() -> String? {
        guard let tokenData = KeychainHelper.shared.load(key: "auth_token") else {
            return nil
        }
        return String(data: tokenData, encoding: .utf8)
    }
}

class NetworkDelegate: NSObject, URLSessionDelegate {
    func urlSession(_ session: URLSession, didReceive challenge: URLAuthenticationChallenge, completionHandler: @escaping (URLSession.AuthChallengeDisposition, URLCredential?) -> Void) {

        // Implement certificate pinning
        guard let serverTrust = challenge.protectionSpace.serverTrust else {
            completionHandler(.cancelAuthenticationChallenge, nil)
            return
        }

        // Add your certificate validation logic here
        completionHandler(.useCredential, URLCredential(trust: serverTrust))
    }
}
\`\`\`

## 7. Accessibility & Localization

Make your app accessible and support multiple languages.

\`\`\`swift
import UIKit

// Accessibility
extension UIView {
    func configureAccessibility(label: String?, hint: String? = nil, traits: UIAccessibilityTraits = .none) {
        isAccessibilityElement = true
        accessibilityLabel = label
        accessibilityHint = hint
        accessibilityTraits = traits
    }
}

class AccessibleViewController: UIViewController {
    @IBOutlet weak var titleLabel: UILabel!
    @IBOutlet weak var submitButton: UIButton!

    override func viewDidLoad() {
        super.viewDidLoad()
        setupAccessibility()
    }

    private func setupAccessibility() {
        titleLabel.configureAccessibility(
            label: "Welcome to our app",
            hint: "Main title of the screen"
        )

        submitButton.configureAccessibility(
            label: "Submit form",
            hint: "Double tap to submit the form",
            traits: .button
        )

        // Dynamic Type support
        titleLabel.font = UIFont.preferredFont(forTextStyle: .headline)
        titleLabel.adjustsFontForContentSizeCategory = true
    }
}

// Localization
class LocalizationManager {
    static let shared = LocalizationManager()

    private init() {}

    func localizedString(for key: String, comment: String = "") -> String {
        return NSLocalizedString(key, comment: comment)
    }
}

extension String {
    var localized: String {
        return LocalizationManager.shared.localizedString(for: self)
    }

    func localized(with arguments: CVarArg...) -> String {
        return String(format: localized, arguments: arguments)
    }
}

// Usage
let welcomeMessage = "welcome_message".localized
let userGreeting = "user_greeting".localized(with: userName)
\`\`\`

## 8. App Store & Distribution

Prepare your app for App Store submission and distribution.

\`\`\`swift
// App Configuration
import UIKit

@main
class AppDelegate: UIResponder, UIApplicationDelegate {

    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {

        #if DEBUG
        setupDebugConfiguration()
        #else
        setupReleaseConfiguration()
        #endif

        configureAppearance()
        return true
    }

    private func setupDebugConfiguration() {
        // Debug-only configuration
        print("App launched in DEBUG mode")
    }

    private func setupReleaseConfiguration() {
        // Production configuration
        // Disable logging, enable analytics, etc.
    }

    private func configureAppearance() {
        // Global UI configuration
        UINavigationBar.appearance().tintColor = .systemBlue
        UITabBar.appearance().tintColor = .systemBlue
    }
}

// Version Management
class AppVersionManager {
    static let shared = AppVersionManager()

    private init() {}

    var currentVersion: String {
        return Bundle.main.infoDictionary?["CFBundleShortVersionString"] as? String ?? "1.0.0"
    }

    var buildNumber: String {
        return Bundle.main.infoDictionary?["CFBundleVersion"] as? String ?? "1"
    }

    func checkForUpdates() {
        // Implement update checking logic
    }
}

// Analytics Integration
class AnalyticsManager {
    static let shared = AnalyticsManager()

    private init() {}

    func track(event: String, parameters: [String: Any]? = nil) {
        #if !DEBUG
        // Track analytics events in production only
        print("Analytics Event: \\(event), Parameters: \\(parameters ?? [:])")
        #endif
    }

    func setUserProperty(key: String, value: String) {
        #if !DEBUG
        // Set user properties for analytics
        #endif
    }
}
\`\`\`

## 9. Performance Optimization

Optimize app performance for better user experience.

\`\`\`swift
import UIKit

// Image Loading and Caching
class ImageLoader {
    static let shared = ImageLoader()

    private let cache = NSCache<NSString, UIImage>()
    private let downloadQueue = DispatchQueue(label: "image.download", qos: .utility, attributes: .concurrent)

    private init() {
        cache.countLimit = 100
        cache.totalCostLimit = 50 * 1024 * 1024 // 50MB
    }

    func loadImage(from url: URL, completion: @escaping (UIImage?) -> Void) {
        let cacheKey = url.absoluteString as NSString

        // Check cache first
        if let cachedImage = cache.object(forKey: cacheKey) {
            DispatchQueue.main.async {
                completion(cachedImage)
            }
            return
        }

        // Download image
        downloadQueue.async {
            URLSession.shared.dataTask(with: url) { data, response, error in
                guard let data = data, let image = UIImage(data: data) else {
                    DispatchQueue.main.async {
                        completion(nil)
                    }
                    return
                }

                // Cache the image
                self.cache.setObject(image, forKey: cacheKey)

                DispatchQueue.main.async {
                    completion(image)
                }
            }.resume()
        }
    }
}

// Table View Performance
class OptimizedTableViewCell: UITableViewCell {
    static let identifier = "OptimizedTableViewCell"

    override func prepareForReuse() {
        super.prepareForReuse()
        // Reset cell state
        imageView?.image = nil
        textLabel?.text = nil
        detailTextLabel?.text = nil
    }

    func configure(with model: CellModel) {
        textLabel?.text = model.title
        detailTextLabel?.text = model.subtitle

        // Load image asynchronously
        if let imageURL = model.imageURL {
            ImageLoader.shared.loadImage(from: imageURL) { [weak self] image in
                self?.imageView?.image = image
                self?.setNeedsLayout()
            }
        }
    }
}

// Memory Warning Handling
class ViewController: UIViewController {
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()

        // Clear caches
        ImageLoader.shared.clearCache()

        // Release non-essential resources
        releaseNonEssentialResources()
    }

    private func releaseNonEssentialResources() {
        // Implement resource cleanup
    }
}
\`\`\`

## 10. Debugging & Monitoring

Implement comprehensive debugging and monitoring solutions.

\`\`\`swift
import os.log

// Logging
class Logger {
    static let shared = Logger()

    private let subsystem = Bundle.main.bundleIdentifier ?? "com.example.app"

    private lazy var networkLogger = os.Logger(subsystem: subsystem, category: "network")
    private lazy var uiLogger = os.Logger(subsystem: subsystem, category: "ui")
    private lazy var dataLogger = os.Logger(subsystem: subsystem, category: "data")

    private init() {}

    func logNetwork(_ message: String, type: OSLogType = .info) {
        networkLogger.log(level: type, "\\(message)")
    }

    func logUI(_ message: String, type: OSLogType = .info) {
        uiLogger.log(level: type, "\\(message)")
    }

    func logData(_ message: String, type: OSLogType = .info) {
        dataLogger.log(level: type, "\\(message)")
    }
}

// Crash Reporting
class CrashReporter {
    static let shared = CrashReporter()

    private init() {}

    func configure() {
        NSSetUncaughtExceptionHandler { exception in
            CrashReporter.shared.handleException(exception)
        }
    }

    private func handleException(_ exception: NSException) {
        let crashInfo = [
            "name": exception.name.rawValue,
            "reason": exception.reason ?? "Unknown",
            "callStack": exception.callStackSymbols.joined(separator: "\\n")
        ]

        // Send crash report to your analytics service
        print("Crash detected: \\(crashInfo)")
    }
}

// Performance Monitoring
class PerformanceMonitor {
    static let shared = PerformanceMonitor()

    private init() {}

    func measureExecutionTime<T>(
        _ operation: () throws -> T,
        label: String = "Operation"
    ) rethrows -> T {
        let startTime = CFAbsoluteTimeGetCurrent()
        let result = try operation()
        let timeElapsed = CFAbsoluteTimeGetCurrent() - startTime

        Logger.shared.logData("\\(label) took \\(timeElapsed) seconds", type: .debug)

        return result
    }
}
\`\`\`

## Checklist

- [ ] Follow MVC or MVVM architecture patterns consistently
- [ ] Implement proper memory management and avoid retain cycles
- [ ] Use SwiftUI or UIKit effectively with modern best practices
- [ ] Handle networking asynchronously with proper error handling
- [ ] Write comprehensive unit tests and UI tests
- [ ] Implement accessibility features and support Dynamic Type
- [ ] Secure sensitive data with Keychain and implement biometric authentication
- [ ] Support localization and internationalization
- [ ] Optimize performance with lazy loading and caching strategies
- [ ] Follow Apple's Human Interface Guidelines
- [ ] Configure proper App Store metadata and screenshots
- [ ] Implement analytics and crash reporting
- [ ] Use Instruments for performance profiling
- [ ] Handle different device sizes and orientations
- [ ] Follow Swift naming conventions and coding standards`,
};
