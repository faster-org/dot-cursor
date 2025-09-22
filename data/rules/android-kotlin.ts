import { Rule } from "../types";

export const rule: Rule = {
	id: "android-kotlin",
	slug: "android-kotlin",
	title: "Android Kotlin Development",
	description: "Best practices for Android app development with Kotlin",
	
	categories: ["android", "kotlin", "mobile"],tags: ["android", "kotlin", "mobile", "jetpack-compose", "mvvm"],
	votes: { up: 0, down: 0 },
	featured: false,
	createdAt: "2024-01-01",
	
	applicationMode: "intelligent",content: `# Android Kotlin Development Best Practices

## 1. Project Structure & Architecture

Implement clean architecture with proper separation of concerns.

\`\`\`kotlin
// Domain Layer - Entity
data class User(
    val id: String,
    val name: String,
    val email: String,
    val avatarUrl: String? = null
)

// Domain Layer - Repository Interface
interface UserRepository {
    suspend fun getUsers(): Result<List<User>>
    suspend fun getUserById(id: String): Result<User>
    suspend fun createUser(user: User): Result<User>
}

// Domain Layer - Use Case
class GetUsersUseCase(
    private val userRepository: UserRepository
) {
    suspend operator fun invoke(): Result<List<User>> {
        return userRepository.getUsers()
    }
}

// Data Layer - Repository Implementation
class UserRepositoryImpl(
    private val apiService: UserApiService,
    private val userDao: UserDao
) : UserRepository {

    override suspend fun getUsers(): Result<List<User>> {
        return try {
            val users = apiService.getUsers()
            userDao.insertUsers(users.map { it.toEntity() })
            Result.success(users)
        } catch (e: Exception) {
            // Fallback to cached data
            val cachedUsers = userDao.getUsers().map { it.toDomain() }
            if (cachedUsers.isNotEmpty()) {
                Result.success(cachedUsers)
            } else {
                Result.failure(e)
            }
        }
    }

    override suspend fun getUserById(id: String): Result<User> {
        return try {
            val user = apiService.getUserById(id)
            userDao.insertUser(user.toEntity())
            Result.success(user)
        } catch (e: Exception) {
            val cachedUser = userDao.getUserById(id)?.toDomain()
            if (cachedUser != null) {
                Result.success(cachedUser)
            } else {
                Result.failure(e)
            }
        }
    }

    override suspend fun createUser(user: User): Result<User> {
        return try {
            val createdUser = apiService.createUser(user)
            userDao.insertUser(createdUser.toEntity())
            Result.success(createdUser)
        } catch (e: Exception) {
            Result.failure(e)
        }
    }
}
\`\`\`

## 2. Jetpack Compose UI Development

Build modern Android UIs with Jetpack Compose.

\`\`\`kotlin
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp

@Composable
fun UserListScreen(
    viewModel: UserListViewModel = hiltViewModel()
) {
    val uiState by viewModel.uiState.collectAsState()

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp)
    ) {
        SearchBar(
            query = uiState.searchQuery,
            onQueryChange = viewModel::updateSearchQuery,
            onSearch = viewModel::searchUsers,
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(16.dp))

        when {
            uiState.isLoading -> {
                LoadingIndicator()
            }
            uiState.error != null -> {
                ErrorMessage(
                    error = uiState.error,
                    onRetry = viewModel::loadUsers
                )
            }
            else -> {
                UserList(
                    users = uiState.users,
                    onUserClick = viewModel::onUserSelected
                )
            }
        }
    }
}

@Composable
fun UserList(
    users: List<User>,
    onUserClick: (User) -> Unit,
    modifier: Modifier = Modifier
) {
    LazyColumn(
        modifier = modifier,
        verticalArrangement = Arrangement.spacedBy(8.dp)
    ) {
        items(users) { user ->
            UserItem(
                user = user,
                onClick = { onUserClick(user) }
            )
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun UserItem(
    user: User,
    onClick: () -> Unit,
    modifier: Modifier = Modifier
) {
    Card(
        onClick = onClick,
        modifier = modifier.fillMaxWidth()
    ) {
        Row(
            modifier = Modifier
                .padding(16.dp)
                .fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(16.dp),
            verticalAlignment = Alignment.CenterVertically
        ) {
            AsyncImage(
                model = user.avatarUrl,
                contentDescription = "User avatar",
                modifier = Modifier.size(48.dp),
                placeholder = painterResource(R.drawable.ic_person),
                error = painterResource(R.drawable.ic_person)
            )

            Column {
                Text(
                    text = user.name,
                    style = MaterialTheme.typography.titleMedium
                )
                Text(
                    text = user.email,
                    style = MaterialTheme.typography.bodyMedium,
                    color = MaterialTheme.colorScheme.onSurfaceVariant
                )
            }
        }
    }
}

@Composable
fun LoadingIndicator(
    modifier: Modifier = Modifier
) {
    Box(
        modifier = modifier.fillMaxSize(),
        contentAlignment = Alignment.Center
    ) {
        CircularProgressIndicator()
    }
}

@Composable
fun ErrorMessage(
    error: String,
    onRetry: () -> Unit,
    modifier: Modifier = Modifier
) {
    Column(
        modifier = modifier.fillMaxSize(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        Text(
            text = error,
            style = MaterialTheme.typography.bodyLarge,
            color = MaterialTheme.colorScheme.error
        )
        Spacer(modifier = Modifier.height(16.dp))
        Button(onClick = onRetry) {
            Text("Retry")
        }
    }
}
\`\`\`

## 3. ViewModel & State Management

Implement proper state management with ViewModel and StateFlow.

\`\`\`kotlin
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import dagger.hilt.android.lifecycle.HiltViewModel
import kotlinx.coroutines.flow.*
import kotlinx.coroutines.launch
import javax.inject.Inject

data class UserListUiState(
    val users: List<User> = emptyList(),
    val isLoading: Boolean = false,
    val error: String? = null,
    val searchQuery: String = ""
)

@HiltViewModel
class UserListViewModel @Inject constructor(
    private val getUsersUseCase: GetUsersUseCase,
    private val searchUsersUseCase: SearchUsersUseCase
) : ViewModel() {

    private val _uiState = MutableStateFlow(UserListUiState())
    val uiState: StateFlow<UserListUiState> = _uiState.asStateFlow()

    private val _navigationEvents = MutableSharedFlow<NavigationEvent>()
    val navigationEvents: SharedFlow<NavigationEvent> = _navigationEvents.asSharedFlow()

    init {
        loadUsers()
    }

    fun loadUsers() {
        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }

            getUsersUseCase()
                .onSuccess { users ->
                    _uiState.update {
                        it.copy(
                            users = users,
                            isLoading = false,
                            error = null
                        )
                    }
                }
                .onFailure { exception ->
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            error = exception.message ?: "Unknown error occurred"
                        )
                    }
                }
        }
    }

    fun updateSearchQuery(query: String) {
        _uiState.update { it.copy(searchQuery = query) }
    }

    fun searchUsers() {
        val query = _uiState.value.searchQuery
        if (query.isBlank()) {
            loadUsers()
            return
        }

        viewModelScope.launch {
            _uiState.update { it.copy(isLoading = true, error = null) }

            searchUsersUseCase(query)
                .onSuccess { users ->
                    _uiState.update {
                        it.copy(
                            users = users,
                            isLoading = false,
                            error = null
                        )
                    }
                }
                .onFailure { exception ->
                    _uiState.update {
                        it.copy(
                            isLoading = false,
                            error = exception.message ?: "Search failed"
                        )
                    }
                }
        }
    }

    fun onUserSelected(user: User) {
        viewModelScope.launch {
            _navigationEvents.emit(NavigationEvent.NavigateToUserDetail(user.id))
        }
    }
}

sealed class NavigationEvent {
    data class NavigateToUserDetail(val userId: String) : NavigationEvent()
}
\`\`\`

## 4. Network & Data Management

Implement robust networking with Retrofit and Room database.

\`\`\`kotlin
// Network - API Service
import retrofit2.http.*

interface UserApiService {
    @GET("users")
    suspend fun getUsers(): List<UserDto>

    @GET("users/{id}")
    suspend fun getUserById(@Path("id") id: String): UserDto

    @POST("users")
    suspend fun createUser(@Body user: CreateUserRequest): UserDto

    @PUT("users/{id}")
    suspend fun updateUser(
        @Path("id") id: String,
        @Body user: UpdateUserRequest
    ): UserDto

    @DELETE("users/{id}")
    suspend fun deleteUser(@Path("id") id: String)
}

// Network - DTOs
data class UserDto(
    val id: String,
    val name: String,
    val email: String,
    val avatar_url: String?
)

fun UserDto.toDomain(): User = User(
    id = id,
    name = name,
    email = email,
    avatarUrl = avatar_url
)

// Database - Entity
import androidx.room.*

@Entity(tableName = "users")
data class UserEntity(
    @PrimaryKey val id: String,
    val name: String,
    val email: String,
    val avatarUrl: String?
)

fun UserEntity.toDomain(): User = User(
    id = id,
    name = name,
    email = email,
    avatarUrl = avatarUrl
)

fun User.toEntity(): UserEntity = UserEntity(
    id = id,
    name = name,
    email = email,
    avatarUrl = avatarUrl
)

// Database - DAO
@Dao
interface UserDao {
    @Query("SELECT * FROM users")
    suspend fun getUsers(): List<UserEntity>

    @Query("SELECT * FROM users WHERE id = :id")
    suspend fun getUserById(id: String): UserEntity?

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertUser(user: UserEntity)

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertUsers(users: List<UserEntity>)

    @Delete
    suspend fun deleteUser(user: UserEntity)

    @Query("DELETE FROM users WHERE id = :id")
    suspend fun deleteUserById(id: String)
}

// Database - Room Database
@Database(
    entities = [UserEntity::class],
    version = 1,
    exportSchema = false
)
@TypeConverters(Converters::class)
abstract class AppDatabase : RoomDatabase() {
    abstract fun userDao(): UserDao
}

// Network Module - Hilt
@Module
@InstallIn(SingletonComponent::class)
object NetworkModule {

    @Provides
    @Singleton
    fun provideOkHttpClient(): OkHttpClient {
        return OkHttpClient.Builder()
            .addInterceptor(HttpLoggingInterceptor().apply {
                level = if (BuildConfig.DEBUG) {
                    HttpLoggingInterceptor.Level.BODY
                } else {
                    HttpLoggingInterceptor.Level.NONE
                }
            })
            .connectTimeout(30, TimeUnit.SECONDS)
            .readTimeout(30, TimeUnit.SECONDS)
            .build()
    }

    @Provides
    @Singleton
    fun provideRetrofit(okHttpClient: OkHttpClient): Retrofit {
        return Retrofit.Builder()
            .baseUrl(BuildConfig.API_BASE_URL)
            .client(okHttpClient)
            .addConverterFactory(GsonConverterFactory.create())
            .build()
    }

    @Provides
    @Singleton
    fun provideUserApiService(retrofit: Retrofit): UserApiService {
        return retrofit.create(UserApiService::class.java)
    }
}
\`\`\`

## 5. Dependency Injection with Hilt

Configure dependency injection for scalable architecture.

\`\`\`kotlin
// Application Class
@HiltAndroidApp
class MyApplication : Application() {
    override fun onCreate() {
        super.onCreate()

        if (BuildConfig.DEBUG) {
            Timber.plant(Timber.DebugTree())
        }
    }
}

// Database Module
@Module
@InstallIn(SingletonComponent::class)
object DatabaseModule {

    @Provides
    @Singleton
    fun provideAppDatabase(@ApplicationContext context: Context): AppDatabase {
        return Room.databaseBuilder(
            context,
            AppDatabase::class.java,
            "app_database"
        ).build()
    }

    @Provides
    fun provideUserDao(database: AppDatabase): UserDao {
        return database.userDao()
    }
}

// Repository Module
@Module
@InstallIn(SingletonComponent::class)
abstract class RepositoryModule {

    @Binds
    abstract fun bindUserRepository(
        userRepositoryImpl: UserRepositoryImpl
    ): UserRepository
}

// Use Case Module
@Module
@InstallIn(ViewModelComponent::class)
object UseCaseModule {

    @Provides
    fun provideGetUsersUseCase(
        userRepository: UserRepository
    ): GetUsersUseCase {
        return GetUsersUseCase(userRepository)
    }
}
\`\`\`

## 6. Testing Strategies

Implement comprehensive testing with unit tests and UI tests.

\`\`\`kotlin
// Unit Test - ViewModel
@ExtendWith(MockitoExtension::class)
class UserListViewModelTest {

    @Mock
    private lateinit var getUsersUseCase: GetUsersUseCase

    @Mock
    private lateinit var searchUsersUseCase: SearchUsersUseCase

    private lateinit var viewModel: UserListViewModel

    @Before
    fun setup() {
        viewModel = UserListViewModel(getUsersUseCase, searchUsersUseCase)
    }

    @Test
    fun \`loadUsers success updates uiState correctly\`() = runTest {
        // Given
        val expectedUsers = listOf(
            User("1", "John Doe", "john@example.com"),
            User("2", "Jane Smith", "jane@example.com")
        )
        whenever(getUsersUseCase()).thenReturn(Result.success(expectedUsers))

        // When
        viewModel.loadUsers()

        // Then
        val uiState = viewModel.uiState.value
        assertEquals(expectedUsers, uiState.users)
        assertEquals(false, uiState.isLoading)
        assertEquals(null, uiState.error)
    }

    @Test
    fun \`loadUsers failure updates error state\`() = runTest {
        // Given
        val exception = Exception("Network error")
        whenever(getUsersUseCase()).thenReturn(Result.failure(exception))

        // When
        viewModel.loadUsers()

        // Then
        val uiState = viewModel.uiState.value
        assertEquals(emptyList<User>(), uiState.users)
        assertEquals(false, uiState.isLoading)
        assertEquals("Network error", uiState.error)
    }
}

// UI Test - Compose
@RunWith(AndroidJUnit4::class)
class UserListScreenTest {

    @get:Rule
    val composeTestRule = createComposeRule()

    @Test
    fun userListDisplaysUsers() {
        val users = listOf(
            User("1", "John Doe", "john@example.com"),
            User("2", "Jane Smith", "jane@example.com")
        )

        composeTestRule.setContent {
            UserList(
                users = users,
                onUserClick = {}
            )
        }

        composeTestRule.onNodeWithText("John Doe").assertIsDisplayed()
        composeTestRule.onNodeWithText("john@example.com").assertIsDisplayed()
        composeTestRule.onNodeWithText("Jane Smith").assertIsDisplayed()
        composeTestRule.onNodeWithText("jane@example.com").assertIsDisplayed()
    }

    @Test
    fun userItemClickTriggersCallback() {
        val users = listOf(User("1", "John Doe", "john@example.com"))
        var clickedUser: User? = null

        composeTestRule.setContent {
            UserList(
                users = users,
                onUserClick = { clickedUser = it }
            )
        }

        composeTestRule.onNodeWithText("John Doe").performClick()

        assertEquals(users[0], clickedUser)
    }
}

// Repository Test
@RunWith(AndroidJUnit4::class)
class UserRepositoryImplTest {

    @Mock
    private lateinit var apiService: UserApiService

    @Mock
    private lateinit var userDao: UserDao

    private lateinit var repository: UserRepositoryImpl

    @Before
    fun setup() {
        MockitoAnnotations.openMocks(this)
        repository = UserRepositoryImpl(apiService, userDao)
    }

    @Test
    fun \`getUsers returns cached data when network fails\`() = runTest {
        // Given
        whenever(apiService.getUsers()).thenThrow(IOException("Network error"))
        val cachedUsers = listOf(UserEntity("1", "John", "john@example.com", null))
        whenever(userDao.getUsers()).thenReturn(cachedUsers)

        // When
        val result = repository.getUsers()

        // Then
        assertTrue(result.isSuccess)
        assertEquals(1, result.getOrNull()?.size)
        assertEquals("John", result.getOrNull()?.first()?.name)
    }
}
\`\`\`

## 7. Security & Permissions

Implement security best practices and handle permissions properly.

\`\`\`kotlin
// Permissions
class PermissionManager(private val activity: Activity) {

    companion object {
        private const val CAMERA_PERMISSION_REQUEST_CODE = 100
        private const val STORAGE_PERMISSION_REQUEST_CODE = 101
    }

    fun requestCameraPermission(onGranted: () -> Unit, onDenied: () -> Unit) {
        when {
            ContextCompat.checkSelfPermission(
                activity,
                Manifest.permission.CAMERA
            ) == PackageManager.PERMISSION_GRANTED -> {
                onGranted()
            }
            ActivityCompat.shouldShowRequestPermissionRationale(
                activity,
                Manifest.permission.CAMERA
            ) -> {
                showPermissionRationale(
                    "Camera access is needed to take photos",
                    onGranted,
                    onDenied
                )
            }
            else -> {
                ActivityCompat.requestPermissions(
                    activity,
                    arrayOf(Manifest.permission.CAMERA),
                    CAMERA_PERMISSION_REQUEST_CODE
                )
            }
        }
    }

    private fun showPermissionRationale(
        message: String,
        onGranted: () -> Unit,
        onDenied: () -> Unit
    ) {
        AlertDialog.Builder(activity)
            .setTitle("Permission Required")
            .setMessage(message)
            .setPositiveButton("Grant") { _, _ -> onGranted() }
            .setNegativeButton("Deny") { _, _ -> onDenied() }
            .show()
    }
}

// Secure Storage
class SecurePreferences(context: Context) {
    private val sharedPreferences = EncryptedSharedPreferences.create(
        "secure_prefs",
        MasterKeys.getOrCreate(MasterKeys.AES256_GCM_SPEC),
        context,
        EncryptedSharedPreferences.PrefKeyEncryptionScheme.AES256_SIV,
        EncryptedSharedPreferences.PrefValueEncryptionScheme.AES256_GCM
    )

    fun saveToken(token: String) {
        sharedPreferences.edit()
            .putString("auth_token", token)
            .apply()
    }

    fun getToken(): String? {
        return sharedPreferences.getString("auth_token", null)
    }

    fun clearToken() {
        sharedPreferences.edit()
            .remove("auth_token")
            .apply()
    }
}

// Biometric Authentication
class BiometricAuthManager(private val activity: FragmentActivity) {

    fun authenticate(
        onSuccess: () -> Unit,
        onError: (String) -> Unit,
        onFailed: () -> Unit
    ) {
        val biometricManager = BiometricManager.from(activity)

        when (biometricManager.canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_WEAK)) {
            BiometricManager.BIOMETRIC_SUCCESS -> {
                showBiometricPrompt(onSuccess, onError, onFailed)
            }
            BiometricManager.BIOMETRIC_ERROR_NO_HARDWARE -> {
                onError("No biometric hardware available")
            }
            BiometricManager.BIOMETRIC_ERROR_HW_UNAVAILABLE -> {
                onError("Biometric hardware unavailable")
            }
            BiometricManager.BIOMETRIC_ERROR_NONE_ENROLLED -> {
                onError("No biometric credentials enrolled")
            }
        }
    }

    private fun showBiometricPrompt(
        onSuccess: () -> Unit,
        onError: (String) -> Unit,
        onFailed: () -> Unit
    ) {
        val promptInfo = BiometricPrompt.PromptInfo.Builder()
            .setTitle("Biometric Authentication")
            .setSubtitle("Use your biometric credential to authenticate")
            .setNegativeButtonText("Cancel")
            .build()

        val biometricPrompt = BiometricPrompt(activity, ContextCompat.getMainExecutor(activity),
            object : BiometricPrompt.AuthenticationCallback() {
                override fun onAuthenticationError(errorCode: Int, errString: CharSequence) {
                    super.onAuthenticationError(errorCode, errString)
                    onError(errString.toString())
                }

                override fun onAuthenticationSucceeded(result: BiometricPrompt.AuthenticationResult) {
                    super.onAuthenticationSucceeded(result)
                    onSuccess()
                }

                override fun onAuthenticationFailed() {
                    super.onAuthenticationFailed()
                    onFailed()
                }
            })

        biometricPrompt.authenticate(promptInfo)
    }
}
\`\`\`

## 8. Performance Optimization

Optimize app performance and memory usage.

\`\`\`kotlin
// Image Loading with Coil
@Composable
fun OptimizedAsyncImage(
    imageUrl: String?,
    contentDescription: String?,
    modifier: Modifier = Modifier
) {
    AsyncImage(
        model = ImageRequest.Builder(LocalContext.current)
            .data(imageUrl)
            .crossfade(true)
            .memoryCachePolicy(CachePolicy.ENABLED)
            .diskCachePolicy(CachePolicy.ENABLED)
            .build(),
        contentDescription = contentDescription,
        modifier = modifier,
        placeholder = painterResource(R.drawable.ic_placeholder),
        error = painterResource(R.drawable.ic_error)
    )
}

// LazyColumn Optimization
@Composable
fun OptimizedUserList(
    users: List<User>,
    onUserClick: (User) -> Unit,
    modifier: Modifier = Modifier
) {
    LazyColumn(
        modifier = modifier,
        verticalArrangement = Arrangement.spacedBy(8.dp),
        contentPadding = PaddingValues(16.dp)
    ) {
        items(
            items = users,
            key = { user -> user.id }
        ) { user ->
            UserItem(
                user = user,
                onClick = { onUserClick(user) }
            )
        }
    }
}

// Memory Management
class ImageCache private constructor() {
    companion object {
        @Volatile
        private var INSTANCE: ImageCache? = null

        fun getInstance(): ImageCache {
            return INSTANCE ?: synchronized(this) {
                INSTANCE ?: ImageCache().also { INSTANCE = it }
            }
        }
    }

    private val memoryCache: LruCache<String, Bitmap> = object : LruCache<String, Bitmap>(
        (Runtime.getRuntime().maxMemory() / 8).toInt()
    ) {
        override fun sizeOf(key: String, bitmap: Bitmap): Int {
            return bitmap.byteCount
        }
    }

    fun getBitmap(key: String): Bitmap? = memoryCache.get(key)

    fun putBitmap(key: String, bitmap: Bitmap) {
        memoryCache.put(key, bitmap)
    }
}

// Background Processing
class BackgroundTaskManager {

    fun schedulePeriodicWork(context: Context) {
        val constraints = Constraints.Builder()
            .setRequiredNetworkType(NetworkType.CONNECTED)
            .setRequiresBatteryNotLow(true)
            .build()

        val periodicWork = PeriodicWorkRequestBuilder<SyncWorker>(15, TimeUnit.MINUTES)
            .setConstraints(constraints)
            .build()

        WorkManager.getInstance(context).enqueueUniquePeriodicWork(
            "sync_work",
            ExistingPeriodicWorkPolicy.KEEP,
            periodicWork
        )
    }
}

class SyncWorker(
    context: Context,
    params: WorkerParameters
) : CoroutineWorker(context, params) {

    override suspend fun doWork(): Result {
        return try {
            // Perform background sync
            syncData()
            Result.success()
        } catch (e: Exception) {
            Result.retry()
        }
    }

    private suspend fun syncData() {
        // Implement data synchronization
    }
}
\`\`\`

## 9. Navigation & Deep Linking

Implement navigation with Navigation Component and handle deep links.

\`\`\`kotlin
// Navigation Graph
@Composable
fun AppNavigation(
    navController: NavHostController = rememberNavController()
) {
    NavHost(
        navController = navController,
        startDestination = "user_list"
    ) {
        composable("user_list") {
            UserListScreen(
                onUserClick = { userId ->
                    navController.navigate("user_detail/$userId")
                }
            )
        }

        composable(
            "user_detail/{userId}",
            arguments = listOf(navArgument("userId") { type = NavType.StringType })
        ) { backStackEntry ->
            val userId = backStackEntry.arguments?.getString("userId") ?: ""
            UserDetailScreen(
                userId = userId,
                onBackClick = { navController.popBackStack() }
            )
        }

        composable("settings") {
            SettingsScreen(
                onBackClick = { navController.popBackStack() }
            )
        }
    }
}

// Deep Link Handling in Activity
class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)

        setContent {
            MyAppTheme {
                AppNavigation()
            }
        }

        handleDeepLink(intent)
    }

    override fun onNewIntent(intent: Intent?) {
        super.onNewIntent(intent)
        intent?.let { handleDeepLink(it) }
    }

    private fun handleDeepLink(intent: Intent) {
        val uri = intent.data
        if (uri != null && uri.scheme == "myapp") {
            when (uri.host) {
                "user" -> {
                    val userId = uri.getQueryParameter("id")
                    if (userId != null) {
                        // Navigate to user detail
                    }
                }
            }
        }
    }
}

// Manifest Deep Link Declaration
/*
<activity
    android:name=".MainActivity"
    android:exported="true">

    <intent-filter android:autoVerify="true">
        <action android:name="android.intent.action.VIEW" />
        <category android:name="android.intent.category.DEFAULT" />
        <category android:name="android.intent.category.BROWSABLE" />
        <data android:scheme="myapp" />
    </intent-filter>

</activity>
*/
\`\`\`

## 10. App Distribution & Monitoring

Prepare your app for distribution and implement monitoring.

\`\`\`kotlin
// Build Configuration
// build.gradle (app module)
android {
    compileSdk 34

    defaultConfig {
        applicationId "com.example.myapp"
        minSdk 24
        targetSdk 34
        versionCode 1
        versionName "1.0.0"

        buildConfigField "String", "API_BASE_URL", "\\"https://api.example.com/\\""
    }

    buildTypes {
        debug {
            isDebuggable = true
            buildConfigField "String", "API_BASE_URL", "\\"https://api-dev.example.com/\\""
        }

        release {
            isMinifyEnabled = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
            buildConfigField "String", "API_BASE_URL", "\\"https://api.example.com/\\""
        }
    }

    signingConfigs {
        create("release") {
            keyAlias = keystoreProperties["keyAlias"] as String
            keyPassword = keystoreProperties["keyPassword"] as String
            storeFile = file(keystoreProperties["storeFile"] as String)
            storePassword = keystoreProperties["storePassword"] as String
        }
    }
}

// Crash Reporting
class CrashReportingTree : Timber.Tree() {
    override fun log(priority: Int, tag: String?, message: String, t: Throwable?) {
        if (priority == Log.ERROR && t != null) {
            // Send crash report to your crash reporting service
            // FirebaseCrashlytics.getInstance().recordException(t)
        }
    }
}

// Analytics
class AnalyticsManager @Inject constructor() {

    fun trackEvent(eventName: String, parameters: Map<String, Any> = emptyMap()) {
        // Track analytics events
        // FirebaseAnalytics.getInstance().logEvent(eventName, parameters.toBundle())
    }

    fun setUserProperty(name: String, value: String) {
        // Set user properties
        // FirebaseAnalytics.getInstance().setUserProperty(name, value)
    }
}

// App Updates
class InAppUpdateManager(private val activity: Activity) {
    private val appUpdateManager = AppUpdateManagerFactory.create(activity)

    fun checkForUpdates() {
        val appUpdateInfoTask = appUpdateManager.appUpdateInfo

        appUpdateInfoTask.addOnSuccessListener { appUpdateInfo ->
            if (appUpdateInfo.updateAvailability() == UpdateAvailability.UPDATE_AVAILABLE
                && appUpdateInfo.isUpdateTypeAllowed(AppUpdateType.FLEXIBLE)
            ) {
                requestUpdate(appUpdateInfo)
            }
        }
    }

    private fun requestUpdate(appUpdateInfo: AppUpdateInfo) {
        appUpdateManager.startUpdateFlowForResult(
            appUpdateInfo,
            AppUpdateType.FLEXIBLE,
            activity,
            REQUEST_CODE_UPDATE
        )
    }

    companion object {
        private const val REQUEST_CODE_UPDATE = 100
    }
}
\`\`\`

## Checklist

- [ ] Implement clean architecture with proper separation of concerns
- [ ] Use Jetpack Compose for modern UI development
- [ ] Configure proper dependency injection with Hilt
- [ ] Implement robust networking with Retrofit and caching with Room
- [ ] Use ViewModels and StateFlow for state management
- [ ] Write comprehensive unit tests and UI tests
- [ ] Handle permissions and implement security best practices
- [ ] Optimize performance with proper image loading and background processing
- [ ] Set up navigation and deep link handling
- [ ] Configure build variants and signing for different environments
- [ ] Implement crash reporting and analytics
- [ ] Follow Material Design guidelines and accessibility best practices
- [ ] Handle different screen sizes and orientations
- [ ] Use WorkManager for background tasks
- [ ] Implement proper error handling and user feedback`,
};
