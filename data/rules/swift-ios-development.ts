export default {
	title: "Swift iOS Development with SwiftUI and UIKit",
	tags: ["swift", "ios", "swiftui", "uikit", "mobile", "apple"],
	languages: ["swift"],
	description:
		"Comprehensive guide for building iOS applications with Swift, SwiftUI, and UIKit best practices",
	content: `# Swift iOS Development with SwiftUI and UIKit

## 1. Project Setup and Architecture

### Modern iOS Project Structure
\`\`\`
MyApp/
├── MyApp/
│   ├── App/
│   │   ├── MyAppApp.swift
│   │   ├── ContentView.swift
│   │   └── Info.plist
│   ├── Features/
│   │   ├── Authentication/
│   │   │   ├── Views/
│   │   │   ├── ViewModels/
│   │   │   └── Services/
│   │   ├── Profile/
│   │   └── Settings/
│   ├── Core/
│   │   ├── Models/
│   │   ├── Services/
│   │   ├── Network/
│   │   ├── Storage/
│   │   └── Extensions/
│   ├── Shared/
│   │   ├── Components/
│   │   ├── Modifiers/
│   │   ├── Utils/
│   │   └── Constants/
│   └── Resources/
│       ├── Assets.xcassets
│       ├── Colors.xcassets
│       └── Localizable.strings
├── MyAppTests/
├── MyAppUITests/
└── Packages/ (if using local SPM packages)
\`\`\`

### SwiftUI App Structure with MVVM
\`\`\`swift
// MyAppApp.swift
import SwiftUI

@main
struct MyAppApp: App {
    @StateObject private var appState = AppState()
    @StateObject private var authenticationManager = AuthenticationManager()

    var body: some Scene {
        WindowGroup {
            ContentView()
                .environmentObject(appState)
                .environmentObject(authenticationManager)
                .onAppear {
                    setupApp()
                }
        }
    }

    private func setupApp() {
        // Configure app-wide settings
        configureNetworking()
        configureAnalytics()
        authenticationManager.checkAuthenticationStatus()
    }

    private func configureNetworking() {
        NetworkManager.shared.configure(
            baseURL: Configuration.apiBaseURL,
            timeout: 30.0
        )
    }

    private func configureAnalytics() {
        #if !DEBUG
        AnalyticsManager.shared.configure()
        #endif
    }
}
\`\`\`

## 2. SwiftUI Views and Components

### Reusable SwiftUI Components
\`\`\`swift
// Custom Button Component
struct PrimaryButton: View {
    let title: String
    let action: () -> Void
    let isLoading: Bool
    let isDisabled: Bool

    init(
        _ title: String,
        isLoading: Bool = false,
        isDisabled: Bool = false,
        action: @escaping () -> Void
    ) {
        self.title = title
        self.isLoading = isLoading
        self.isDisabled = isDisabled
        self.action = action
    }

    var body: some View {
        Button(action: action) {
            HStack {
                if isLoading {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: .white))
                        .scaleEffect(0.8)
                } else {
                    Text(title)
                        .font(.headline)
                        .fontWeight(.semibold)
                }
            }
            .frame(maxWidth: .infinity)
            .frame(height: 50)
            .foregroundColor(.white)
            .background(
                isDisabled ? Color.gray : Color.accentColor
            )
            .cornerRadius(12)
            .disabled(isDisabled || isLoading)
        }
        .animation(.easeInOut(duration: 0.2), value: isLoading)
    }
}

// Custom Text Field Component
struct CustomTextField: View {
    let title: String
    @Binding var text: String
    let placeholder: String
    let isSecure: Bool
    let keyboardType: UIKeyboardType
    let validation: ((String) -> String?)?

    @State private var isEditing = false
    @State private var validationMessage: String?

    init(
        _ title: String,
        text: Binding<String>,
        placeholder: String = "",
        isSecure: Bool = false,
        keyboardType: UIKeyboardType = .default,
        validation: ((String) -> String?)? = nil
    ) {
        self.title = title
        self._text = text
        self.placeholder = placeholder
        self.isSecure = isSecure
        self.keyboardType = keyboardType
        self.validation = validation
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text(title)
                .font(.subheadline)
                .fontWeight(.medium)
                .foregroundColor(.primary)

            Group {
                if isSecure {
                    SecureField(placeholder, text: $text)
                } else {
                    TextField(placeholder, text: $text)
                        .keyboardType(keyboardType)
                }
            }
            .textFieldStyle(RoundedBorderTextFieldStyle())
            .onEditingChanged { editing in
                isEditing = editing
                if !editing {
                    validateInput()
                }
            }

            if let validationMessage = validationMessage {
                Text(validationMessage)
                    .font(.caption)
                    .foregroundColor(.red)
                    .transition(.opacity)
            }
        }
        .animation(.easeInOut(duration: 0.2), value: validationMessage)
    }

    private func validateInput() {
        validationMessage = validation?(text)
    }
}

// Custom Card Component
struct Card<Content: View>: View {
    let content: Content
    let padding: EdgeInsets
    let cornerRadius: CGFloat
    let shadow: Bool

    init(
        padding: EdgeInsets = EdgeInsets(top: 16, leading: 16, bottom: 16, trailing: 16),
        cornerRadius: CGFloat = 12,
        shadow: Bool = true,
        @ViewBuilder content: () -> Content
    ) {
        self.content = content()
        self.padding = padding
        self.cornerRadius = cornerRadius
        self.shadow = shadow
    }

    var body: some View {
        content
            .padding(padding)
            .background(Color(.systemBackground))
            .cornerRadius(cornerRadius)
            .conditionalModifier(shadow) { view in
                view.shadow(
                    color: Color.black.opacity(0.1),
                    radius: 8,
                    x: 0,
                    y: 2
                )
            }
    }
}
\`\`\`

### Advanced SwiftUI Patterns
\`\`\`swift
// View Modifier for Conditional Modifications
extension View {
    @ViewBuilder
    func conditionalModifier<Content: View>(
        _ condition: Bool,
        transform: (Self) -> Content
    ) -> some View {
        if condition {
            transform(self)
        } else {
            self
        }
    }
}

// Custom Environment Key
private struct UserPreferencesKey: EnvironmentKey {
    static let defaultValue = UserPreferences()
}

extension EnvironmentValues {
    var userPreferences: UserPreferences {
        get { self[UserPreferencesKey.self] }
        set { self[UserPreferencesKey.self] = newValue }
    }
}

// Preference Key for Dynamic Content
struct SizePreferenceKey: PreferenceKey {
    static var defaultValue: CGSize = .zero

    static func reduce(value: inout CGSize, nextValue: () -> CGSize) {
        let next = nextValue()
        value = CGSize(
            width: max(value.width, next.width),
            height: max(value.height, next.height)
        )
    }
}

extension View {
    func measureSize(_ perform: @escaping (CGSize) -> Void) -> some View {
        background(
            GeometryReader { geometry in
                Color.clear
                    .preference(key: SizePreferenceKey.self, value: geometry.size)
            }
        )
        .onPreferenceChange(SizePreferenceKey.self, perform: perform)
    }
}
\`\`\`

## 3. MVVM Architecture with Combine

### Observable ViewModel Base Class
\`\`\`swift
import Foundation
import Combine

// Base ViewModel Protocol
protocol ViewModelProtocol: ObservableObject {
    var isLoading: Bool { get set }
    var errorMessage: String? { get set }

    func handleError(_ error: Error)
}

// Base ViewModel Implementation
class BaseViewModel: ViewModelProtocol {
    @Published var isLoading = false
    @Published var errorMessage: String?

    protected var cancellables = Set<AnyCancellable>()

    func handleError(_ error: Error) {
        DispatchQueue.main.async {
            self.isLoading = false

            if let appError = error as? AppError {
                self.errorMessage = appError.localizedDescription
            } else {
                self.errorMessage = "An unexpected error occurred"
            }
        }
    }

    func clearError() {
        errorMessage = nil
    }
}

// User Profile ViewModel Example
class UserProfileViewModel: BaseViewModel {
    @Published var user: User?
    @Published var posts: [Post] = []

    private let userService: UserServiceProtocol
    private let postService: PostServiceProtocol

    init(
        userService: UserServiceProtocol = UserService(),
        postService: PostServiceProtocol = PostService()
    ) {
        self.userService = userService
        self.postService = postService
        super.init()
    }

    func loadUserProfile(userId: String) {
        isLoading = true
        clearError()

        Publishers.CombineLatest(
            userService.fetchUser(id: userId),
            postService.fetchUserPosts(userId: userId)
        )
        .receive(on: DispatchQueue.main)
        .sink(
            receiveCompletion: { [weak self] completion in
                self?.isLoading = false
                if case .failure(let error) = completion {
                    self?.handleError(error)
                }
            },
            receiveValue: { [weak self] user, posts in
                self?.user = user
                self?.posts = posts
            }
        )
        .store(in: &cancellables)
    }

    func refreshProfile() {
        guard let userId = user?.id else { return }
        loadUserProfile(userId: userId)
    }
}
\`\`\`

### Service Layer with Combine
\`\`\`swift
import Foundation
import Combine

// Network Service Protocol
protocol NetworkServiceProtocol {
    func request<T: Codable>(
        endpoint: APIEndpoint,
        responseType: T.Type
    ) -> AnyPublisher<T, AppError>
}

// Network Service Implementation
class NetworkService: NetworkServiceProtocol {
    static let shared = NetworkService()

    private let session: URLSession
    private let baseURL: URL

    init(session: URLSession = .shared, baseURL: URL = Configuration.apiBaseURL) {
        self.session = session
        self.baseURL = baseURL
    }

    func request<T: Codable>(
        endpoint: APIEndpoint,
        responseType: T.Type
    ) -> AnyPublisher<T, AppError> {
        guard let url = buildURL(for: endpoint) else {
            return Fail(error: AppError.invalidURL)
                .eraseToAnyPublisher()
        }

        let request = buildRequest(url: url, endpoint: endpoint)

        return session.dataTaskPublisher(for: request)
            .tryMap { data, response in
                try self.validateResponse(data: data, response: response)
                return data
            }
            .decode(type: T.self, decoder: JSONDecoder.apiDecoder)
            .mapError { error in
                if let appError = error as? AppError {
                    return appError
                } else if error is DecodingError {
                    return AppError.decodingError
                } else {
                    return AppError.networkError(error.localizedDescription)
                }
            }
            .eraseToAnyPublisher()
    }

    private func buildURL(for endpoint: APIEndpoint) -> URL? {
        var components = URLComponents(url: baseURL.appendingPathComponent(endpoint.path), resolvingAgainstBaseURL: false)
        components?.queryItems = endpoint.queryItems
        return components?.url
    }

    private func buildRequest(url: URL, endpoint: APIEndpoint) -> URLRequest {
        var request = URLRequest(url: url)
        request.httpMethod = endpoint.method.rawValue
        request.allHTTPHeaderFields = endpoint.headers
        request.httpBody = endpoint.body
        return request
    }

    private func validateResponse(data: Data, response: URLResponse) throws {
        guard let httpResponse = response as? HTTPURLResponse else {
            throw AppError.invalidResponse
        }

        guard 200...299 ~= httpResponse.statusCode else {
            throw AppError.httpError(httpResponse.statusCode)
        }
    }
}

// User Service Implementation
protocol UserServiceProtocol {
    func fetchUser(id: String) -> AnyPublisher<User, AppError>
    func updateUser(_ user: User) -> AnyPublisher<User, AppError>
}

class UserService: UserServiceProtocol {
    private let networkService: NetworkServiceProtocol

    init(networkService: NetworkServiceProtocol = NetworkService.shared) {
        self.networkService = networkService
    }

    func fetchUser(id: String) -> AnyPublisher<User, AppError> {
        let endpoint = APIEndpoint.user(id: id)
        return networkService.request(endpoint: endpoint, responseType: User.self)
    }

    func updateUser(_ user: User) -> AnyPublisher<User, AppError> {
        let endpoint = APIEndpoint.updateUser(user)
        return networkService.request(endpoint: endpoint, responseType: User.self)
    }
}
\`\`\`

## 4. Core Data Integration

### Core Data Stack Setup
\`\`\`swift
import CoreData
import Combine

class CoreDataStack: ObservableObject {
    static let shared = CoreDataStack()

    lazy var persistentContainer: NSPersistentContainer = {
        let container = NSPersistentContainer(name: "DataModel")

        container.loadPersistentStores { _, error in
            if let error = error {
                fatalError("Core Data error: \\(error.localizedDescription)")
            }
        }

        container.viewContext.automaticallyMergesChangesFromParent = true
        container.viewContext.mergePolicy = NSMergeByPropertyObjectTrumpMergePolicy

        return container
    }()

    var viewContext: NSManagedObjectContext {
        persistentContainer.viewContext
    }

    func newBackgroundContext() -> NSManagedObjectContext {
        persistentContainer.newBackgroundContext()
    }

    func save() {
        let context = viewContext

        if context.hasChanges {
            do {
                try context.save()
            } catch {
                print("Save error: \\(error)")
            }
        }
    }

    func saveBackground(_ context: NSManagedObjectContext) {
        if context.hasChanges {
            do {
                try context.save()
            } catch {
                print("Background save error: \\(error)")
            }
        }
    }
}

// Repository Pattern for Core Data
protocol UserRepositoryProtocol {
    func fetchUsers() -> AnyPublisher<[UserEntity], Error>
    func save(user: User) -> AnyPublisher<UserEntity, Error>
    func delete(userEntity: UserEntity) -> AnyPublisher<Void, Error>
}

class UserRepository: UserRepositoryProtocol {
    private let coreDataStack: CoreDataStack

    init(coreDataStack: CoreDataStack = .shared) {
        self.coreDataStack = coreDataStack
    }

    func fetchUsers() -> AnyPublisher<[UserEntity], Error> {
        Future { promise in
            let context = self.coreDataStack.viewContext
            let request: NSFetchRequest<UserEntity> = UserEntity.fetchRequest()
            request.sortDescriptors = [NSSortDescriptor(keyPath: \\UserEntity.name, ascending: true)]

            do {
                let users = try context.fetch(request)
                promise(.success(users))
            } catch {
                promise(.failure(error))
            }
        }
        .eraseToAnyPublisher()
    }

    func save(user: User) -> AnyPublisher<UserEntity, Error> {
        Future { promise in
            let context = self.coreDataStack.newBackgroundContext()

            context.perform {
                let userEntity = UserEntity(context: context)
                userEntity.id = user.id
                userEntity.name = user.name
                userEntity.email = user.email
                userEntity.createdAt = Date()

                do {
                    try context.save()
                    promise(.success(userEntity))
                } catch {
                    promise(.failure(error))
                }
            }
        }
        .eraseToAnyPublisher()
    }

    func delete(userEntity: UserEntity) -> AnyPublisher<Void, Error> {
        Future { promise in
            let context = self.coreDataStack.viewContext
            context.delete(userEntity)

            do {
                try context.save()
                promise(.success(()))
            } catch {
                promise(.failure(error))
            }
        }
        .eraseToAnyPublisher()
    }
}
\`\`\`

## 5. UIKit Integration with SwiftUI

### UIViewRepresentable for Custom UIKit Components
\`\`\`swift
import SwiftUI
import UIKit

// Custom UITextField Wrapper
struct UITextFieldWrapper: UIViewRepresentable {
    @Binding var text: String
    let placeholder: String
    let isFirstResponder: Bool
    let onCommit: () -> Void

    func makeUIView(context: Context) -> UITextField {
        let textField = UITextField()
        textField.placeholder = placeholder
        textField.delegate = context.coordinator
        textField.borderStyle = .roundedRect
        textField.font = UIFont.systemFont(ofSize: 16)

        // Add toolbar with done button
        let toolbar = UIToolbar()
        toolbar.sizeToFit()
        let doneButton = UIBarButtonItem(
            barButtonSystemItem: .done,
            target: context.coordinator,
            action: #selector(Coordinator.donePressed)
        )
        toolbar.setItems([UIBarButtonItem(barButtonSystemItem: .flexibleSpace, target: nil, action: nil), doneButton], animated: false)
        textField.inputAccessoryView = toolbar

        return textField
    }

    func updateUIView(_ uiView: UITextField, context: Context) {
        uiView.text = text

        if isFirstResponder && !uiView.isFirstResponder {
            uiView.becomeFirstResponder()
        } else if !isFirstResponder && uiView.isFirstResponder {
            uiView.resignFirstResponder()
        }
    }

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    class Coordinator: NSObject, UITextFieldDelegate {
        let parent: UITextFieldWrapper

        init(_ parent: UITextFieldWrapper) {
            self.parent = parent
        }

        func textFieldDidChangeSelection(_ textField: UITextField) {
            parent.text = textField.text ?? ""
        }

        func textFieldDidEndEditing(_ textField: UITextField) {
            parent.onCommit()
        }

        @objc func donePressed() {
            UIApplication.shared.sendAction(#selector(UIResponder.resignFirstResponder), to: nil, from: nil, for: nil)
        }
    }
}

// UIViewControllerRepresentable for Complex Screens
struct ImagePickerView: UIViewControllerRepresentable {
    @Binding var selectedImage: UIImage?
    @Environment(.presentationMode) var presentationMode

    let sourceType: UIImagePickerController.SourceType

    func makeUIViewController(context: Context) -> UIImagePickerController {
        let picker = UIImagePickerController()
        picker.sourceType = sourceType
        picker.delegate = context.coordinator
        return picker
    }

    func updateUIViewController(_ uiViewController: UIImagePickerController, context: Context) {}

    func makeCoordinator() -> Coordinator {
        Coordinator(self)
    }

    class Coordinator: NSObject, UIImagePickerControllerDelegate, UINavigationControllerDelegate {
        let parent: ImagePickerView

        init(_ parent: ImagePickerView) {
            self.parent = parent
        }

        func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [UIImagePickerController.InfoKey : Any]) {
            if let image = info[.originalImage] as? UIImage {
                parent.selectedImage = image
            }
            parent.presentationMode.wrappedValue.dismiss()
        }

        func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
            parent.presentationMode.wrappedValue.dismiss()
        }
    }
}
\`\`\`

## 6. Testing Strategies

### Unit Testing ViewModels
\`\`\`swift
import XCTest
import Combine
@testable import MyApp

class UserProfileViewModelTests: XCTestCase {
    var viewModel: UserProfileViewModel!
    var mockUserService: MockUserService!
    var mockPostService: MockPostService!
    var cancellables: Set<AnyCancellable>!

    override func setUp() {
        super.setUp()
        mockUserService = MockUserService()
        mockPostService = MockPostService()
        viewModel = UserProfileViewModel(
            userService: mockUserService,
            postService: mockPostService
        )
        cancellables = Set<AnyCancellable>()
    }

    override func tearDown() {
        viewModel = nil
        mockUserService = nil
        mockPostService = nil
        cancellables = nil
        super.tearDown()
    }

    func testLoadUserProfileSuccess() {
        // Given
        let expectedUser = User.mock()
        let expectedPosts = [Post.mock(), Post.mock()]

        mockUserService.fetchUserResult = .success(expectedUser)
        mockPostService.fetchUserPostsResult = .success(expectedPosts)

        let expectation = XCTestExpectation(description: "Load user profile")

        // When
        viewModel.$isLoading
            .dropFirst() // Skip initial false value
            .sink { isLoading in
                if !isLoading {
                    expectation.fulfill()
                }
            }
            .store(in: &cancellables)

        viewModel.loadUserProfile(userId: "123")

        // Then
        wait(for: [expectation], timeout: 1.0)

        XCTAssertEqual(viewModel.user, expectedUser)
        XCTAssertEqual(viewModel.posts, expectedPosts)
        XCTAssertFalse(viewModel.isLoading)
        XCTAssertNil(viewModel.errorMessage)
    }

    func testLoadUserProfileFailure() {
        // Given
        let expectedError = AppError.networkError("Network failure")
        mockUserService.fetchUserResult = .failure(expectedError)

        let expectation = XCTestExpectation(description: "Handle error")

        // When
        viewModel.$errorMessage
            .compactMap { $0 }
            .sink { _ in
                expectation.fulfill()
            }
            .store(in: &cancellables)

        viewModel.loadUserProfile(userId: "123")

        // Then
        wait(for: [expectation], timeout: 1.0)

        XCTAssertNil(viewModel.user)
        XCTAssertTrue(viewModel.posts.isEmpty)
        XCTAssertFalse(viewModel.isLoading)
        XCTAssertNotNil(viewModel.errorMessage)
    }
}

// Mock Services for Testing
class MockUserService: UserServiceProtocol {
    var fetchUserResult: Result<User, AppError>!

    func fetchUser(id: String) -> AnyPublisher<User, AppError> {
        Future { promise in
            promise(self.fetchUserResult)
        }
        .eraseToAnyPublisher()
    }

    func updateUser(_ user: User) -> AnyPublisher<User, AppError> {
        Just(user)
            .setFailureType(to: AppError.self)
            .eraseToAnyPublisher()
    }
}
\`\`\`

### SwiftUI View Testing
\`\`\`swift
import XCTest
import SwiftUI
@testable import MyApp

class ContentViewTests: XCTestCase {

    func testLoginButtonTapped() {
        // Given
        let viewModel = AuthenticationViewModel()
        let view = ContentView()
            .environmentObject(viewModel)

        // When
        let hostingController = UIHostingController(rootView: view)
        let window = UIWindow(frame: UIScreen.main.bounds)
        window.rootViewController = hostingController
        window.makeKeyAndVisible()

        // Find and tap login button
        let loginButton = hostingController.view.findButton(withText: "Login")
        loginButton?.sendActions(for: .touchUpInside)

        // Then
        XCTAssertTrue(viewModel.isShowingLogin)
    }
}

extension UIView {
    func findButton(withText text: String) -> UIButton? {
        if let button = self as? UIButton, button.titleLabel?.text == text {
            return button
        }

        for subview in subviews {
            if let found = subview.findButton(withText: text) {
                return found
            }
        }

        return nil
    }
}
\`\`\`

## 7. Performance Optimization

### Memory Management and Performance
\`\`\`swift
// Lazy Loading for Expensive Operations
struct ExpensiveView: View {
    @State private var expensiveData: [DataModel] = []
    @State private var isLoaded = false

    var body: some View {
        ScrollView {
            LazyVStack {
                ForEach(expensiveData) { item in
                    ItemView(item: item)
                        .onAppear {
                            // Load more data when needed
                            loadMoreDataIfNeeded(item: item)
                        }
                }
            }
        }
        .onAppear {
            if !isLoaded {
                loadInitialData()
                isLoaded = true
            }
        }
    }

    private func loadInitialData() {
        // Load initial batch of data
    }

    private func loadMoreDataIfNeeded(item: DataModel) {
        // Implement pagination logic
    }
}

// Image Caching for Better Performance
class ImageCache {
    static let shared = ImageCache()
    private let cache = NSCache<NSString, UIImage>()

    private init() {
        cache.countLimit = 100
        cache.totalCostLimit = 50 * 1024 * 1024 // 50MB
    }

    func image(for url: String) -> UIImage? {
        return cache.object(forKey: NSString(string: url))
    }

    func setImage(_ image: UIImage, for url: String) {
        cache.setObject(image, forKey: NSString(string: url))
    }
}

// Async Image Loading with SwiftUI
struct AsyncImageView: View {
    let url: URL
    @State private var image: UIImage?
    @State private var isLoading = true

    var body: some View {
        Group {
            if let image = image {
                Image(uiImage: image)
                    .resizable()
                    .aspectRatio(contentMode: .fit)
            } else if isLoading {
                ProgressView()
            } else {
                Image(systemName: "photo")
                    .foregroundColor(.gray)
            }
        }
        .onAppear {
            loadImage()
        }
    }

    private func loadImage() {
        // Check cache first
        if let cachedImage = ImageCache.shared.image(for: url.absoluteString) {
            self.image = cachedImage
            self.isLoading = false
            return
        }

        // Load from network
        URLSession.shared.dataTask(with: url) { data, _, _ in
            guard let data = data, let loadedImage = UIImage(data: data) else {
                DispatchQueue.main.async {
                    self.isLoading = false
                }
                return
            }

            // Cache the image
            ImageCache.shared.setImage(loadedImage, for: url.absoluteString)

            DispatchQueue.main.async {
                self.image = loadedImage
                self.isLoading = false
            }
        }.resume()
    }
}
\`\`\`

## Checklist for Swift iOS Development

- [ ] Set up proper MVVM architecture with SwiftUI
- [ ] Implement reusable SwiftUI components and modifiers
- [ ] Create comprehensive ViewModels with Combine
- [ ] Set up Core Data stack with repository pattern
- [ ] Integrate UIKit components when needed with UIViewRepresentable
- [ ] Implement proper error handling and user feedback
- [ ] Add comprehensive unit and UI tests
- [ ] Optimize performance with lazy loading and caching
- [ ] Follow iOS design guidelines and accessibility standards
- [ ] Implement proper navigation and state management
- [ ] Add logging and analytics integration
- [ ] Configure proper networking with error handling
- [ ] Implement offline capabilities and data persistence
- [ ] Add proper app lifecycle management`,
};
