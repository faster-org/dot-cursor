import { Rule } from "../types";

export const rule: Rule = {
	id: "pytest-testing-framework",
	slug: "pytest-testing-framework",
	title: "Pytest Testing Framework for Python Applications",
	tags: ["pytest", "testing", "python", "unit-tests", "tdd"],
	languages: ["python"],
	description:
		"Comprehensive guide for testing Python applications with pytest, including fixtures, parameterization, mocking, and advanced testing patterns.",
	
	categories: ["programming", "language", "quality-assurance", "testing"],content: `# Pytest Testing Framework for Python Applications

## 1. Basic Pytest Setup and Configuration

### Project Structure and Configuration
\`\`\`python
# Directory structure
myproject/
├── src/
│   ├── __init__.py
│   ├── models/
│   │   ├── __init__.py
│   │   ├── user.py
│   │   └── product.py
│   ├── services/
│   │   ├── __init__.py
│   │   ├── user_service.py
│   │   └── email_service.py
│   └── utils/
│       ├── __init__.py
│       └── validators.py
├── tests/
│   ├── __init__.py
│   ├── conftest.py
│   ├── unit/
│   │   ├── __init__.py
│   │   ├── test_models.py
│   │   └── test_services.py
│   ├── integration/
│   │   ├── __init__.py
│   │   └── test_api.py
│   └── fixtures/
│       ├── __init__.py
│       └── data.py
├── pytest.ini
├── requirements.txt
└── requirements-dev.txt

# pytest.ini
[tool:pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts =
    --strict-markers
    --strict-config
    --verbose
    --tb=short
    --cov=src
    --cov-report=html
    --cov-report=term-missing
    --cov-fail-under=80
markers =
    slow: marks tests as slow (deselect with '-m "not slow"')
    integration: marks tests as integration tests
    unit: marks tests as unit tests
    regression: marks tests as regression tests
    smoke: marks tests as smoke tests
filterwarnings =
    ignore::UserWarning
    ignore::DeprecationWarning
\`\`\`

### Basic Test Structure
\`\`\`python
# src/models/user.py
from dataclasses import dataclass
from typing import Optional
from datetime import datetime
import re

@dataclass
class User:
    id: Optional[int] = None
    username: str = ""
    email: str = ""
    password_hash: str = ""
    is_active: bool = True
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    def __post_init__(self):
        if self.created_at is None:
            self.created_at = datetime.now()
        self.updated_at = datetime.now()

    def validate_email(self) -> bool:
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$'
        return bool(re.match(pattern, self.email))

    def validate_username(self) -> bool:
        return len(self.username) >= 3 and self.username.isalnum()

    def is_valid(self) -> bool:
        return self.validate_email() and self.validate_username()

# tests/unit/test_models.py
import pytest
from datetime import datetime
from src.models.user import User

class TestUser:
    """Test suite for User model"""

    def test_user_creation(self):
        """Test basic user creation"""
        user = User(
            username="testuser",
            email="test@example.com",
            password_hash="hashed_password"
        )

        assert user.username == "testuser"
        assert user.email == "test@example.com"
        assert user.is_active is True
        assert isinstance(user.created_at, datetime)

    def test_user_post_init_sets_timestamps(self):
        """Test that __post_init__ sets timestamps correctly"""
        user = User(username="test", email="test@example.com")

        assert user.created_at is not None
        assert user.updated_at is not None
        assert user.created_at <= user.updated_at

    @pytest.mark.parametrize("email,expected", [
        ("test@example.com", True),
        ("user.name+tag@domain.co.uk", True),
        ("invalid-email", False),
        ("@example.com", False),
        ("test@", False),
        ("", False),
    ])
    def test_email_validation(self, email, expected):
        """Test email validation with various inputs"""
        user = User(username="test", email=email)
        assert user.validate_email() == expected

    @pytest.mark.parametrize("username,expected", [
        ("validuser", True),
        ("user123", True),
        ("ab", False),  # Too short
        ("user with spaces", False),  # Contains spaces
        ("user@name", False),  # Contains special chars
        ("", False),  # Empty
    ])
    def test_username_validation(self, username, expected):
        """Test username validation with various inputs"""
        user = User(username=username, email="test@example.com")
        assert user.validate_username() == expected

    def test_user_is_valid(self):
        """Test overall user validation"""
        valid_user = User(
            username="testuser",
            email="test@example.com"
        )
        assert valid_user.is_valid() is True

        invalid_user = User(
            username="ab",  # Too short
            email="invalid-email"
        )
        assert invalid_user.is_valid() is False
\`\`\`

## 2. Fixtures and Test Data Management

### Basic and Parameterized Fixtures
\`\`\`python
# tests/conftest.py
import pytest
from datetime import datetime
from src.models.user import User
from src.services.user_service import UserService
from src.database import Database

@pytest.fixture
def sample_user():
    """Create a sample user for testing"""
    return User(
        id=1,
        username="testuser",
        email="test@example.com",
        password_hash="hashed_password",
        created_at=datetime(2023, 1, 1)
    )

@pytest.fixture
def multiple_users():
    """Create multiple users for testing"""
    return [
        User(id=1, username="user1", email="user1@example.com"),
        User(id=2, username="user2", email="user2@example.com"),
        User(id=3, username="user3", email="user3@example.com"),
    ]

@pytest.fixture(params=["sqlite", "postgresql", "mysql"])
def database_type(request):
    """Parametrized fixture for different database types"""
    return request.param

@pytest.fixture
def database(database_type):
    """Create database connection based on type"""
    if database_type == "sqlite":
        db = Database("sqlite:///:memory:")
    elif database_type == "postgresql":
        db = Database("postgresql://test:test@localhost/test")
    else:
        db = Database("mysql://test:test@localhost/test")

    db.create_tables()
    yield db
    db.drop_tables()
    db.close()

@pytest.fixture(scope="session")
def test_config():
    """Session-scoped configuration fixture"""
    return {
        "database_url": "sqlite:///:memory:",
        "redis_url": "redis://localhost:6379/1",
        "secret_key": "test-secret-key",
        "debug": True
    }

@pytest.fixture(scope="function")
def user_service(database):
    """Create UserService with database dependency"""
    return UserService(database)

# Fixture with cleanup
@pytest.fixture
def temp_file():
    """Create temporary file and clean up after test"""
    import tempfile
    import os

    fd, path = tempfile.mkstemp()
    os.close(fd)

    yield path

    # Cleanup
    if os.path.exists(path):
        os.remove(path)

# Factory fixture
@pytest.fixture
def user_factory():
    """Factory fixture for creating users with custom attributes"""
    def _create_user(**kwargs):
        defaults = {
            "username": "testuser",
            "email": "test@example.com",
            "password_hash": "hashed_password",
            "is_active": True
        }
        defaults.update(kwargs)
        return User(**defaults)

    return _create_user

# Fixture with finalizer
@pytest.fixture
def user_with_cleanup(database):
    """User fixture with cleanup using finalizer"""
    user = User(username="testuser", email="test@example.com")
    database.save(user)

    def cleanup():
        database.delete(user)

    request.addfinalizer(cleanup)
    return user
\`\`\`

### Advanced Fixture Patterns
\`\`\`python
# tests/fixtures/data.py
import pytest
from faker import Faker
from src.models.user import User
from src.models.product import Product

fake = Faker()

@pytest.fixture
def fake_user_data():
    """Generate fake user data using Faker"""
    return {
        "username": fake.user_name(),
        "email": fake.email(),
        "first_name": fake.first_name(),
        "last_name": fake.last_name(),
        "phone": fake.phone_number(),
    }

@pytest.fixture
def authenticated_user(user_service, user_factory):
    """Create and authenticate a user"""
    user_data = {
        "username": "authuser",
        "email": "auth@example.com",
        "password": "password123"
    }

    user = user_service.create_user(**user_data)
    token = user_service.authenticate(user.username, "password123")

    user.auth_token = token
    return user

# Monkeypatch fixture for mocking
@pytest.fixture
def mock_email_service(monkeypatch):
    """Mock email service to prevent actual emails"""
    class MockEmailService:
        def __init__(self):
            self.sent_emails = []

        def send_email(self, to, subject, body):
            self.sent_emails.append({
                "to": to,
                "subject": subject,
                "body": body
            })
            return True

    mock_service = MockEmailService()
    monkeypatch.setattr("src.services.email_service.EmailService",
                       lambda: mock_service)
    return mock_service

# Fixture with autouse
@pytest.fixture(autouse=True)
def reset_database(database):
    """Automatically reset database before each test"""
    database.clear_all_tables()
    yield
    database.clear_all_tables()

# Fixture composition
@pytest.fixture
def complete_user_setup(database, user_factory, mock_email_service):
    """Compose multiple fixtures for complete user setup"""
    user = user_factory(username="completeuser", email="complete@example.com")
    database.save(user)

    return {
        "user": user,
        "database": database,
        "email_service": mock_email_service
    }
\`\`\`

## 3. Mocking and Test Doubles

### Using unittest.mock and pytest-mock
\`\`\`python
# src/services/user_service.py
from typing import Optional, List
from src.models.user import User
from src.services.email_service import EmailService
from src.database import Database
import hashlib

class UserService:
    def __init__(self, database: Database, email_service: EmailService = None):
        self.database = database
        self.email_service = email_service or EmailService()

    def create_user(self, username: str, email: str, password: str) -> User:
        # Check if user exists
        if self.get_user_by_email(email):
            raise ValueError("User with this email already exists")

        # Hash password
        password_hash = self._hash_password(password)

        # Create user
        user = User(
            username=username,
            email=email,
            password_hash=password_hash
        )

        # Validate user
        if not user.is_valid():
            raise ValueError("Invalid user data")

        # Save to database
        saved_user = self.database.save(user)

        # Send welcome email
        self.email_service.send_welcome_email(user.email, user.username)

        return saved_user

    def get_user_by_email(self, email: str) -> Optional[User]:
        return self.database.find_by_email(email)

    def get_user_by_id(self, user_id: int) -> Optional[User]:
        return self.database.find_by_id(user_id)

    def update_user(self, user_id: int, **updates) -> User:
        user = self.get_user_by_id(user_id)
        if not user:
            raise ValueError("User not found")

        for key, value in updates.items():
            if hasattr(user, key):
                setattr(user, key, value)

        if not user.is_valid():
            raise ValueError("Invalid user data")

        return self.database.update(user)

    def _hash_password(self, password: str) -> str:
        return hashlib.sha256(password.encode()).hexdigest()

# tests/unit/test_services.py
import pytest
from unittest.mock import Mock, patch, call
from src.services.user_service import UserService
from src.models.user import User

class TestUserService:

    @pytest.fixture
    def mock_database(self):
        """Mock database for UserService"""
        return Mock()

    @pytest.fixture
    def mock_email_service(self):
        """Mock email service for UserService"""
        return Mock()

    @pytest.fixture
    def user_service(self, mock_database, mock_email_service):
        """UserService with mocked dependencies"""
        return UserService(mock_database, mock_email_service)

    def test_create_user_success(self, user_service, mock_database, mock_email_service):
        """Test successful user creation"""
        # Setup mocks
        mock_database.find_by_email.return_value = None  # User doesn't exist
        mock_database.save.return_value = User(
            id=1,
            username="testuser",
            email="test@example.com",
            password_hash="hashed_password"
        )

        # Execute
        result = user_service.create_user("testuser", "test@example.com", "password123")

        # Assert
        assert result.username == "testuser"
        assert result.email == "test@example.com"

        # Verify mock calls
        mock_database.find_by_email.assert_called_once_with("test@example.com")
        mock_database.save.assert_called_once()
        mock_email_service.send_welcome_email.assert_called_once_with(
            "test@example.com", "testuser"
        )

    def test_create_user_already_exists(self, user_service, mock_database):
        """Test user creation when user already exists"""
        # Setup mock to return existing user
        existing_user = User(username="existing", email="test@example.com")
        mock_database.find_by_email.return_value = existing_user

        # Execute and assert
        with pytest.raises(ValueError, match="User with this email already exists"):
            user_service.create_user("testuser", "test@example.com", "password123")

    @patch('src.services.user_service.hashlib.sha256')
    def test_password_hashing(self, mock_sha256, user_service, mock_database, mock_email_service):
        """Test password hashing using patch decorator"""
        # Setup mocks
        mock_database.find_by_email.return_value = None
        mock_database.save.return_value = User(id=1, username="test", email="test@example.com")

        mock_hash = Mock()
        mock_hash.hexdigest.return_value = "mocked_hash"
        mock_sha256.return_value = mock_hash

        # Execute
        user_service.create_user("testuser", "test@example.com", "password123")

        # Assert hashing was called correctly
        mock_sha256.assert_called_once()
        mock_hash.hexdigest.assert_called_once()

    def test_get_user_by_email(self, user_service, mock_database):
        """Test getting user by email"""
        expected_user = User(username="test", email="test@example.com")
        mock_database.find_by_email.return_value = expected_user

        result = user_service.get_user_by_email("test@example.com")

        assert result == expected_user
        mock_database.find_by_email.assert_called_once_with("test@example.com")

    @pytest.mark.parametrize("side_effect,expected_calls", [
        (None, 1),  # Success case
        (Exception("DB Error"), 1),  # Error case
    ])
    def test_database_error_handling(self, user_service, mock_database,
                                   side_effect, expected_calls):
        """Test database error handling"""
        mock_database.find_by_email.side_effect = side_effect

        if side_effect is None:
            result = user_service.get_user_by_email("test@example.com")
            assert result is None
        else:
            with pytest.raises(Exception):
                user_service.get_user_by_email("test@example.com")

        assert mock_database.find_by_email.call_count == expected_calls

    def test_update_user_success(self, user_service, mock_database):
        """Test successful user update"""
        existing_user = User(id=1, username="oldname", email="test@example.com")
        updated_user = User(id=1, username="newname", email="test@example.com")

        mock_database.find_by_id.return_value = existing_user
        mock_database.update.return_value = updated_user

        result = user_service.update_user(1, username="newname")

        assert result.username == "newname"
        mock_database.find_by_id.assert_called_once_with(1)
        mock_database.update.assert_called_once()

    def test_update_user_not_found(self, user_service, mock_database):
        """Test updating non-existent user"""
        mock_database.find_by_id.return_value = None

        with pytest.raises(ValueError, match="User not found"):
            user_service.update_user(999, username="newname")
\`\`\`

### Advanced Mocking Patterns
\`\`\`python
# tests/unit/test_advanced_mocking.py
import pytest
from unittest.mock import Mock, MagicMock, patch, PropertyMock
from contextlib import contextmanager
from src.services.user_service import UserService

class TestAdvancedMocking:

    def test_mock_with_spec(self):
        """Test mocking with spec to enforce interface"""
        from src.database import Database

        # Mock with spec ensures only valid attributes/methods can be accessed
        mock_db = Mock(spec=Database)
        user_service = UserService(mock_db)

        # This will work because find_by_email is in Database spec
        mock_db.find_by_email.return_value = None

        # This would raise AttributeError because invalid_method doesn't exist in Database
        # mock_db.invalid_method.return_value = "test"  # Would fail

    def test_mock_property(self):
        """Test mocking properties"""
        user = Mock()

        # Mock a property
        type(user).is_active = PropertyMock(return_value=True)

        assert user.is_active is True

        # Change property value
        type(user).is_active = PropertyMock(return_value=False)
        assert user.is_active is False

    def test_mock_context_manager(self):
        """Test mocking context managers"""
        mock_file = MagicMock()
        mock_file.__enter__.return_value = mock_file
        mock_file.read.return_value = "file content"

        with patch('builtins.open', return_value=mock_file):
            with open('test.txt', 'r') as f:
                content = f.read()

        assert content == "file content"
        mock_file.__enter__.assert_called_once()
        mock_file.__exit__.assert_called_once()

    def test_mock_side_effects(self):
        """Test various side effects"""
        mock_service = Mock()

        # Side effect as list - different return values for subsequent calls
        mock_service.get_data.side_effect = [
            "first call",
            "second call",
            ValueError("third call fails")
        ]

        assert mock_service.get_data() == "first call"
        assert mock_service.get_data() == "second call"

        with pytest.raises(ValueError):
            mock_service.get_data()

    def test_mock_call_assertions(self):
        """Test various call assertion methods"""
        mock_service = Mock()

        # Make some calls
        mock_service.method('arg1', 'arg2', keyword='value')
        mock_service.method('arg3')
        mock_service.other_method()

        # Assert call count
        assert mock_service.method.call_count == 2
        assert mock_service.other_method.call_count == 1

        # Assert specific calls
        mock_service.method.assert_has_calls([
            call('arg1', 'arg2', keyword='value'),
            call('arg3')
        ])

        # Assert any call
        mock_service.method.assert_any_call('arg1', 'arg2', keyword='value')

    @patch.object(UserService, '_hash_password')
    def test_patch_object(self, mock_hash_password, mock_database, mock_email_service):
        """Test patching specific object method"""
        mock_hash_password.return_value = "mocked_hash"
        mock_database.find_by_email.return_value = None
        mock_database.save.return_value = Mock(id=1)

        user_service = UserService(mock_database, mock_email_service)
        user_service.create_user("test", "test@example.com", "password")

        mock_hash_password.assert_called_once_with("password")

    def test_custom_mock_class(self):
        """Test creating custom mock classes"""
        class DatabaseMock:
            def __init__(self):
                self.users = {}
                self.call_log = []

            def save(self, user):
                self.call_log.append(('save', user))
                user.id = len(self.users) + 1
                self.users[user.id] = user
                return user

            def find_by_email(self, email):
                self.call_log.append(('find_by_email', email))
                for user in self.users.values():
                    if user.email == email:
                        return user
                return None

        db_mock = DatabaseMock()
        email_mock = Mock()

        user_service = UserService(db_mock, email_mock)
        user = user_service.create_user("test", "test@example.com", "password")

        assert user.id == 1
        assert len(db_mock.call_log) == 2  # find_by_email and save
        assert db_mock.call_log[0] == ('find_by_email', 'test@example.com')
\`\`\`

## 4. Parameterized Tests and Data-Driven Testing

### Basic Parameterization
\`\`\`python
# tests/unit/test_parameterized.py
import pytest
from src.utils.validators import validate_email, validate_phone, calculate_discount

class TestParameterizedTests:

    @pytest.mark.parametrize("email,expected", [
        ("test@example.com", True),
        ("user.name+tag@domain.co.uk", True),
        ("user@domain-with-dash.com", True),
        ("invalid.email", False),
        ("@example.com", False),
        ("test@", False),
        ("", False),
        ("test@.com", False),
        ("test..test@example.com", False),
    ])
    def test_email_validation(self, email, expected):
        """Test email validation with multiple test cases"""
        assert validate_email(email) == expected

    @pytest.mark.parametrize("phone,country,expected", [
        ("+1-555-123-4567", "US", True),
        ("555-123-4567", "US", True),
        ("(555) 123-4567", "US", True),
        ("+44 20 7946 0958", "UK", True),
        ("020 7946 0958", "UK", True),
        ("invalid-phone", "US", False),
        ("", "US", False),
    ])
    def test_phone_validation(self, phone, country, expected):
        """Test phone validation for different countries"""
        assert validate_phone(phone, country) == expected

    @pytest.mark.parametrize("price,discount_percent,max_discount,expected", [
        (100, 10, None, 90),      # 10% discount
        (100, 20, 15, 85),        # 20% discount capped at $15
        (50, 30, 20, 35),         # 30% discount capped at $20
        (100, 0, None, 100),      # No discount
        (0, 10, None, 0),         # Zero price
    ])
    def test_discount_calculation(self, price, discount_percent, max_discount, expected):
        """Test discount calculation with various parameters"""
        result = calculate_discount(price, discount_percent, max_discount)
        assert result == expected

    @pytest.mark.parametrize("input_data", [
        {"username": "valid_user", "email": "test@example.com", "age": 25},
        {"username": "another_user", "email": "another@example.com", "age": 30},
        {"username": "third_user", "email": "third@example.com", "age": 18},
    ])
    def test_user_creation_with_dict_params(self, input_data):
        """Test user creation with dictionary parameters"""
        from src.models.user import User
        user = User(**input_data)
        assert user.username == input_data["username"]
        assert user.email == input_data["email"]
        assert user.is_valid()

# Indirect parameterization
@pytest.fixture(params=["sqlite", "postgresql", "mysql"])
def database_config(request):
    """Indirect parameterization through fixture"""
    configs = {
        "sqlite": {"url": "sqlite:///:memory:", "driver": "sqlite"},
        "postgresql": {"url": "postgresql://test:test@localhost/test", "driver": "psycopg2"},
        "mysql": {"url": "mysql://test:test@localhost/test", "driver": "pymysql"}
    }
    return configs[request.param]

@pytest.mark.parametrize("database_config", ["sqlite", "postgresql"], indirect=True)
def test_database_operations(database_config):
    """Test database operations with different database types"""
    from src.database import Database
    db = Database(database_config["url"])
    # Test database operations...
    assert db.driver_name == database_config["driver"]
\`\`\`

### Advanced Parameterization Patterns
\`\`\`python
# tests/unit/test_advanced_parametrization.py
import pytest
from datetime import datetime, timedelta
from src.models.user import User
from src.services.subscription_service import SubscriptionService

class TestAdvancedParametrization:

    # Custom pytest.param with ids and marks
    @pytest.mark.parametrize("user_data,expected_valid", [
        pytest.param(
            {"username": "valid", "email": "valid@example.com"},
            True,
            id="valid_user"
        ),
        pytest.param(
            {"username": "ab", "email": "valid@example.com"},
            False,
            id="username_too_short"
        ),
        pytest.param(
            {"username": "valid", "email": "invalid-email"},
            False,
            id="invalid_email",
            marks=pytest.mark.regression
        ),
    ])
    def test_user_validation_with_custom_ids(self, user_data, expected_valid):
        """Test user validation with custom test IDs"""
        user = User(**user_data)
        assert user.is_valid() == expected_valid

    # Parametrize with computed values
    @pytest.mark.parametrize("subscription_end,days_until_expiry,should_notify", [
        (datetime.now() + timedelta(days=1), 1, True),    # Expires tomorrow
        (datetime.now() + timedelta(days=7), 7, True),    # Expires in a week
        (datetime.now() + timedelta(days=30), 30, False), # Expires in a month
        (datetime.now() - timedelta(days=1), -1, False),  # Already expired
    ])
    def test_subscription_expiry_notifications(self, subscription_end, days_until_expiry, should_notify):
        """Test subscription expiry notifications with computed dates"""
        subscription_service = SubscriptionService()
        result = subscription_service.should_send_expiry_notification(subscription_end)
        assert result == should_notify

    # Parametrize class with multiple test methods
    @pytest.mark.parametrize("user_type", ["admin", "regular", "premium"])
    class TestUserPermissions:
        def test_can_create_posts(self, user_type):
            """Test post creation permissions by user type"""
            from src.models.user import User
            user = User(username="test", email="test@example.com", user_type=user_type)

            if user_type == "admin":
                assert user.can_create_posts() is True
            elif user_type == "premium":
                assert user.can_create_posts() is True
            else:
                assert user.can_create_posts() is False

        def test_can_moderate_content(self, user_type):
            """Test content moderation permissions by user type"""
            from src.models.user import User
            user = User(username="test", email="test@example.com", user_type=user_type)

            expected = user_type == "admin"
            assert user.can_moderate_content() == expected

    # Parametrize with external data
    @pytest.fixture
    def test_cases_from_file():
        """Load test cases from external file"""
        import json
        with open('tests/data/user_test_cases.json', 'r') as f:
            return json.load(f)

    @pytest.mark.parametrize("test_case", [
        {"input": {"age": 17}, "expected_error": "Age must be 18 or older"},
        {"input": {"age": 150}, "expected_error": "Age must be less than 120"},
        {"input": {"age": 25}, "expected_error": None},
    ])
    def test_age_validation_with_error_messages(self, test_case):
        """Test age validation with specific error messages"""
        from src.utils.validators import validate_age

        if test_case["expected_error"]:
            with pytest.raises(ValueError, match=test_case["expected_error"]):
                validate_age(test_case["input"]["age"])
        else:
            # Should not raise an exception
            validate_age(test_case["input"]["age"])

    # Combining multiple parametrize decorators
    @pytest.mark.parametrize("username", ["user1", "user2", "admin"])
    @pytest.mark.parametrize("email_domain", ["example.com", "test.org"])
    @pytest.mark.parametrize("is_active", [True, False])
    def test_user_combinations(self, username, email_domain, is_active):
        """Test all combinations of user parameters"""
        email = f"{username}@{email_domain}"
        user = User(username=username, email=email, is_active=is_active)

        assert user.username == username
        assert user.email == email
        assert user.is_active == is_active

        # Only test validation for active users
        if is_active:
            assert user.is_valid()
\`\`\`

## 5. Integration and End-to-End Testing

### API Integration Tests
\`\`\`python
# tests/integration/test_api.py
import pytest
import requests
from flask import Flask
from src.app import create_app
from src.database import Database

@pytest.fixture(scope="module")
def test_app():
    """Create test application"""
    app = create_app(config_name="testing")

    with app.app_context():
        db = Database(app.config["DATABASE_URL"])
        db.create_tables()
        yield app
        db.drop_tables()

@pytest.fixture
def client(test_app):
    """Create test client"""
    return test_app.test_client()

@pytest.fixture
def auth_headers(client):
    """Create authentication headers"""
    # Create and authenticate user
    user_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "password123"
    }

    # Register user
    response = client.post("/api/register", json=user_data)
    assert response.status_code == 201

    # Login to get token
    login_data = {"email": user_data["email"], "password": user_data["password"]}
    response = client.post("/api/login", json=login_data)
    assert response.status_code == 200

    token = response.json["token"]
    return {"Authorization": f"Bearer {token}"}

class TestUserAPI:
    """Integration tests for User API endpoints"""

    def test_register_user_success(self, client):
        """Test successful user registration"""
        user_data = {
            "username": "newuser",
            "email": "newuser@example.com",
            "password": "password123"
        }

        response = client.post("/api/register", json=user_data)

        assert response.status_code == 201
        assert response.json["username"] == user_data["username"]
        assert response.json["email"] == user_data["email"]
        assert "password" not in response.json  # Password should not be returned

    def test_register_user_duplicate_email(self, client):
        """Test registration with duplicate email"""
        user_data = {
            "username": "user1",
            "email": "duplicate@example.com",
            "password": "password123"
        }

        # First registration should succeed
        response = client.post("/api/register", json=user_data)
        assert response.status_code == 201

        # Second registration with same email should fail
        user_data["username"] = "user2"
        response = client.post("/api/register", json=user_data)
        assert response.status_code == 400
        assert "already exists" in response.json["error"]

    def test_login_success(self, client):
        """Test successful login"""
        # First register a user
        user_data = {
            "username": "loginuser",
            "email": "login@example.com",
            "password": "password123"
        }
        client.post("/api/register", json=user_data)

        # Then try to login
        login_data = {"email": user_data["email"], "password": user_data["password"]}
        response = client.post("/api/login", json=login_data)

        assert response.status_code == 200
        assert "token" in response.json
        assert response.json["user"]["email"] == user_data["email"]

    def test_login_invalid_credentials(self, client):
        """Test login with invalid credentials"""
        login_data = {"email": "nonexistent@example.com", "password": "wrongpassword"}
        response = client.post("/api/login", json=login_data)

        assert response.status_code == 401
        assert "Invalid credentials" in response.json["error"]

    def test_get_user_profile_authenticated(self, client, auth_headers):
        """Test getting user profile with authentication"""
        response = client.get("/api/profile", headers=auth_headers)

        assert response.status_code == 200
        assert "username" in response.json
        assert "email" in response.json

    def test_get_user_profile_unauthenticated(self, client):
        """Test getting user profile without authentication"""
        response = client.get("/api/profile")

        assert response.status_code == 401
        assert "Authentication required" in response.json["error"]

    def test_update_user_profile(self, client, auth_headers):
        """Test updating user profile"""
        update_data = {"username": "updateduser"}
        response = client.put("/api/profile", json=update_data, headers=auth_headers)

        assert response.status_code == 200
        assert response.json["username"] == update_data["username"]

    @pytest.mark.parametrize("invalid_data,expected_error", [
        ({"username": "ab"}, "Username must be at least 3 characters"),
        ({"email": "invalid-email"}, "Invalid email format"),
        ({"username": ""}, "Username is required"),
    ])
    def test_update_profile_validation(self, client, auth_headers, invalid_data, expected_error):
        """Test profile update validation"""
        response = client.put("/api/profile", json=invalid_data, headers=auth_headers)

        assert response.status_code == 400
        assert expected_error in response.json["error"]

class TestProductAPI:
    """Integration tests for Product API"""

    def test_get_products_list(self, client):
        """Test getting products list"""
        response = client.get("/api/products")

        assert response.status_code == 200
        assert isinstance(response.json["products"], list)
        assert "total" in response.json
        assert "page" in response.json

    def test_get_products_with_pagination(self, client):
        """Test products list with pagination"""
        response = client.get("/api/products?page=1&limit=5")

        assert response.status_code == 200
        assert len(response.json["products"]) <= 5
        assert response.json["page"] == 1
        assert response.json["limit"] == 5

    def test_get_product_by_id(self, client):
        """Test getting specific product"""
        # First get list of products to get a valid ID
        products_response = client.get("/api/products")
        if products_response.json["products"]:
            product_id = products_response.json["products"][0]["id"]

            response = client.get(f"/api/products/{product_id}")

            assert response.status_code == 200
            assert response.json["id"] == product_id

    def test_get_nonexistent_product(self, client):
        """Test getting non-existent product"""
        response = client.get("/api/products/99999")

        assert response.status_code == 404
        assert "Product not found" in response.json["error"]
\`\`\`

### Database Integration Tests
\`\`\`python
# tests/integration/test_database.py
import pytest
from src.database import Database
from src.models.user import User
from src.models.product import Product

@pytest.fixture(scope="module")
def database():
    """Create test database"""
    db = Database("sqlite:///:memory:")
    db.create_tables()
    yield db
    db.close()

@pytest.fixture(autouse=True)
def clean_database(database):
    """Clean database before each test"""
    database.clear_all_tables()
    yield
    database.clear_all_tables()

class TestDatabaseOperations:

    def test_user_crud_operations(self, database):
        """Test complete CRUD operations for users"""
        # Create
        user = User(username="testuser", email="test@example.com")
        saved_user = database.save(user)

        assert saved_user.id is not None
        assert saved_user.username == "testuser"

        # Read
        retrieved_user = database.find_by_id(User, saved_user.id)
        assert retrieved_user is not None
        assert retrieved_user.username == "testuser"

        # Update
        retrieved_user.username = "updateduser"
        updated_user = database.update(retrieved_user)
        assert updated_user.username == "updateduser"

        # Delete
        database.delete(updated_user)
        deleted_user = database.find_by_id(User, saved_user.id)
        assert deleted_user is None

    def test_user_unique_constraints(self, database):
        """Test unique constraints on user fields"""
        user1 = User(username="user1", email="test@example.com")
        database.save(user1)

        # Try to create user with same email
        user2 = User(username="user2", email="test@example.com")

        with pytest.raises(Exception):  # Should raise integrity error
            database.save(user2)

    def test_user_relationships(self, database):
        """Test user relationships with other entities"""
        # Create user
        user = User(username="testuser", email="test@example.com")
        saved_user = database.save(user)

        # Create products associated with user
        product1 = Product(name="Product 1", owner_id=saved_user.id)
        product2 = Product(name="Product 2", owner_id=saved_user.id)

        database.save(product1)
        database.save(product2)

        # Retrieve user with products
        user_with_products = database.find_with_products(saved_user.id)
        assert len(user_with_products.products) == 2

    def test_transaction_rollback(self, database):
        """Test transaction rollback on error"""
        user = User(username="testuser", email="test@example.com")

        try:
            with database.transaction():
                database.save(user)
                # Simulate an error that should cause rollback
                raise Exception("Simulated error")
        except Exception:
            pass

        # User should not be saved due to rollback
        users = database.find_all(User)
        assert len(users) == 0

    def test_bulk_operations(self, database):
        """Test bulk database operations"""
        users = [
            User(username=f"user{i}", email=f"user{i}@example.com")
            for i in range(100)
        ]

        # Bulk insert
        saved_users = database.bulk_save(users)
        assert len(saved_users) == 100

        # Bulk update
        for user in saved_users:
            user.is_active = False

        database.bulk_update(saved_users)

        # Verify updates
        inactive_users = database.find_by_attribute(User, "is_active", False)
        assert len(inactive_users) == 100

    def test_complex_queries(self, database):
        """Test complex database queries"""
        # Create test data
        users = [
            User(username="admin", email="admin@example.com", role="admin"),
            User(username="user1", email="user1@example.com", role="user"),
            User(username="user2", email="user2@example.com", role="user"),
            User(username="moderator", email="mod@example.com", role="moderator"),
        ]

        for user in users:
            database.save(user)

        # Test filtering by role
        admins = database.query(User).filter(User.role == "admin").all()
        assert len(admins) == 1
        assert admins[0].username == "admin"

        # Test ordering
        ordered_users = database.query(User).order_by(User.username).all()
        assert ordered_users[0].username == "admin"
        assert ordered_users[-1].username == "user2"

        # Test limiting
        limited_users = database.query(User).limit(2).all()
        assert len(limited_users) == 2
\`\`\`

## 6. Performance Testing and Benchmarking

### Performance Testing with pytest-benchmark
\`\`\`python
# tests/performance/test_benchmarks.py
import pytest
from src.services.user_service import UserService
from src.utils.algorithms import fibonacci, quicksort, binary_search

class TestPerformanceBenchmarks:

    @pytest.mark.benchmark
    def test_user_creation_performance(self, benchmark, user_service):
        """Benchmark user creation performance"""
        def create_user():
            return user_service.create_user(
                "testuser",
                "test@example.com",
                "password123"
            )

        result = benchmark(create_user)
        assert result.username == "testuser"

    @pytest.mark.benchmark
    @pytest.mark.parametrize("n", [10, 20, 30])
    def test_fibonacci_performance(self, benchmark, n):
        """Benchmark fibonacci calculation with different inputs"""
        result = benchmark(fibonacci, n)
        assert result > 0

    @pytest.mark.benchmark
    def test_sorting_performance(self, benchmark):
        """Benchmark sorting algorithm performance"""
        import random
        data = [random.randint(1, 1000) for _ in range(1000)]

        result = benchmark(quicksort, data.copy())
        assert len(result) == len(data)
        assert result == sorted(data)

    @pytest.mark.benchmark(group="search")
    @pytest.mark.parametrize("list_size", [100, 1000, 10000])
    def test_binary_search_performance(self, benchmark, list_size):
        """Benchmark binary search with different list sizes"""
        sorted_list = list(range(list_size))
        target = list_size // 2

        result = benchmark(binary_search, sorted_list, target)
        assert result == target

    def test_performance_regression(self, benchmark):
        """Test for performance regression"""
        def expensive_operation():
            # Simulate an expensive operation
            total = 0
            for i in range(10000):
                total += i ** 2
            return total

        result = benchmark(expensive_operation)

        # Assert the benchmark completes within reasonable time
        # This will fail if the operation becomes significantly slower
        assert benchmark.stats["mean"] < 0.1  # Should complete in < 100ms

    @pytest.mark.benchmark
    def test_database_query_performance(self, benchmark, database):
        """Benchmark database query performance"""
        # Setup test data
        from src.models.user import User
        users = [
            User(username=f"user{i}", email=f"user{i}@example.com")
            for i in range(100)
        ]
        database.bulk_save(users)

        def query_users():
            return database.query(User).filter(User.is_active == True).all()

        result = benchmark(query_users)
        assert len(result) == 100

# Custom benchmark comparisons
@pytest.mark.benchmark(group="algorithms")
class TestAlgorithmComparisons:

    def test_list_comprehension_vs_loop(self, benchmark):
        """Compare list comprehension vs traditional loop"""
        def list_comprehension():
            return [x ** 2 for x in range(1000)]

        def traditional_loop():
            result = []
            for x in range(1000):
                result.append(x ** 2)
            return result

        # Benchmark both approaches
        lc_result = benchmark.pedantic(list_comprehension, rounds=100)
        loop_result = benchmark.pedantic(traditional_loop, rounds=100)

        assert lc_result == loop_result

    @pytest.mark.parametrize("data_structure", ["list", "set", "dict"])
    def test_membership_testing(self, benchmark, data_structure):
        """Compare membership testing across data structures"""
        size = 10000

        if data_structure == "list":
            container = list(range(size))
            target = size - 1
        elif data_structure == "set":
            container = set(range(size))
            target = size - 1
        else:  # dict
            container = {i: i for i in range(size)}
            target = size - 1

        def membership_test():
            return target in container

        result = benchmark(membership_test)
        assert result is True
\`\`\`

## 7. Test Organization and Best Practices

### Advanced Test Configuration
\`\`\`python
# tests/conftest.py - Advanced configuration
import pytest
import logging
from unittest.mock import Mock
from src.app import create_app
from src.database import Database

# Configure logging for tests
logging.basicConfig(level=logging.DEBUG)

def pytest_configure(config):
    """Configure pytest with custom settings"""
    # Add custom markers
    config.addinivalue_line(
        "markers", "slow: marks tests as slow (deselect with '-m "not slow"')"
    )
    config.addinivalue_line(
        "markers", "integration: marks tests as integration tests"
    )
    config.addinivalue_line(
        "markers", "unit: marks tests as unit tests"
    )

def pytest_collection_modifyitems(config, items):
    """Modify test collection to add markers automatically"""
    for item in items:
        # Auto-mark integration tests
        if "integration" in str(item.fspath):
            item.add_marker(pytest.mark.integration)

        # Auto-mark unit tests
        if "unit" in str(item.fspath):
            item.add_marker(pytest.mark.unit)

        # Auto-mark slow tests based on name patterns
        if "performance" in item.name or "benchmark" in item.name:
            item.add_marker(pytest.mark.slow)

def pytest_runtest_setup(item):
    """Setup before each test"""
    # Skip integration tests if --unit-only flag is used
    if item.config.getoption("--unit-only") and "integration" in item.keywords:
        pytest.skip("Skipping integration test in unit-only mode")

def pytest_addoption(parser):
    """Add custom command line options"""
    parser.addoption(
        "--unit-only",
        action="store_true",
        default=False,
        help="Run only unit tests"
    )
    parser.addoption(
        "--integration-only",
        action="store_true",
        default=False,
        help="Run only integration tests"
    )

@pytest.fixture(scope="session")
def test_config():
    """Session-wide test configuration"""
    return {
        "DATABASE_URL": "sqlite:///:memory:",
        "REDIS_URL": "redis://localhost:6379/1",
        "SECRET_KEY": "test-secret-key",
        "TESTING": True,
        "DEBUG": True
    }

# Test data factories
@pytest.fixture
def user_factory():
    """Factory for creating test users"""
    class UserFactory:
        def __init__(self):
            self.counter = 0

        def create(self, **kwargs):
            self.counter += 1
            defaults = {
                "username": f"user{self.counter}",
                "email": f"user{self.counter}@example.com",
                "password_hash": "hashed_password",
                "is_active": True
            }
            defaults.update(kwargs)
            return User(**defaults)

        def create_batch(self, count, **kwargs):
            return [self.create(**kwargs) for _ in range(count)]

    return UserFactory()

# Conditional fixtures
@pytest.fixture
def email_service(request):
    """Conditional email service - real or mock based on marker"""
    if request.node.get_closest_marker("mock_email"):
        mock_service = Mock()
        mock_service.send_email.return_value = True
        return mock_service
    else:
        from src.services.email_service import EmailService
        return EmailService()

# Resource management fixtures
@pytest.fixture
def temp_directory():
    """Create and cleanup temporary directory"""
    import tempfile
    import shutil

    temp_dir = tempfile.mkdtemp()
    yield temp_dir
    shutil.rmtree(temp_dir)

@pytest.fixture
def isolated_filesystem():
    """Provide isolated filesystem for tests"""
    import os
    import tempfile
    import shutil

    original_cwd = os.getcwd()
    temp_dir = tempfile.mkdtemp()

    try:
        os.chdir(temp_dir)
        yield temp_dir
    finally:
        os.chdir(original_cwd)
        shutil.rmtree(temp_dir)
\`\`\`

### Test Utilities and Helpers
\`\`\`python
# tests/utils/helpers.py
import pytest
from contextlib import contextmanager
from unittest.mock import patch
import json
import time

class TestHelpers:
    """Collection of test helper methods"""

    @staticmethod
    def assert_dict_subset(subset, superset):
        """Assert that subset is contained in superset"""
        for key, value in subset.items():
            assert key in superset, f"Key '{key}' not found in superset"
            assert superset[key] == value, f"Value mismatch for key '{key}'"

    @staticmethod
    def assert_response_structure(response, expected_keys):
        """Assert response has expected structure"""
        assert isinstance(response, dict), "Response should be a dictionary"
        for key in expected_keys:
            assert key in response, f"Expected key '{key}' not found in response"

    @staticmethod
    def load_test_data(filename):
        """Load test data from JSON file"""
        import os
        test_data_path = os.path.join(os.path.dirname(__file__), '..', 'data', filename)
        with open(test_data_path, 'r') as f:
            return json.load(f)

    @staticmethod
    @contextmanager
    def mock_time(mock_timestamp):
        """Context manager to mock time.time()"""
        with patch('time.time', return_value=mock_timestamp):
            yield

    @staticmethod
    def wait_for_condition(condition_func, timeout=5, interval=0.1):
        """Wait for a condition to become true"""
        start_time = time.time()
        while time.time() - start_time < timeout:
            if condition_func():
                return True
            time.sleep(interval)
        return False

    @staticmethod
    def create_test_file(content, filename, temp_dir):
        """Create a test file with given content"""
        import os
        file_path = os.path.join(temp_dir, filename)
        with open(file_path, 'w') as f:
            f.write(content)
        return file_path

# Custom assertions
def assert_user_equal(user1, user2, ignore_fields=None):
    """Custom assertion for comparing users"""
    ignore_fields = ignore_fields or ['id', 'created_at', 'updated_at']

    for field in ['username', 'email', 'is_active']:
        if field not in ignore_fields:
            assert getattr(user1, field) == getattr(user2, field), \\
                   f"Field '{field}' does not match"

def assert_api_error(response, status_code, error_message):
    """Assert API error response"""
    assert response.status_code == status_code
    assert 'error' in response.json
    assert error_message in response.json['error']

# Test decorators
def retry_on_failure(max_retries=3, delay=1):
    """Decorator to retry test on failure"""
    def decorator(test_func):
        def wrapper(*args, **kwargs):
            for attempt in range(max_retries):
                try:
                    return test_func(*args, **kwargs)
                except AssertionError:
                    if attempt == max_retries - 1:
                        raise
                    time.sleep(delay)
        return wrapper
    return decorator

def skip_if_no_network():
    """Skip test if no network connection"""
    import socket
    try:
        socket.create_connection(("8.8.8.8", 53), timeout=3)
        return lambda func: func
    except OSError:
        return pytest.mark.skip(reason="No network connection")

# Usage examples in tests
class TestWithHelpers:

    def test_user_creation_with_helpers(self, user_factory):
        """Test using helper methods"""
        user = user_factory.create()

        # Use custom assertion
        expected_user = user_factory.create(
            username=user.username,
            email=user.email
        )
        assert_user_equal(user, expected_user, ignore_fields=['id'])

    @retry_on_failure(max_retries=3)
    def test_flaky_operation(self):
        """Test that might be flaky"""
        import random
        # Simulate flaky test that passes 70% of the time
        assert random.random() > 0.3

    @skip_if_no_network()
    def test_external_api(self):
        """Test that requires network connection"""
        import requests
        response = requests.get("https://api.github.com")
        assert response.status_code == 200

    def test_with_mock_time(self):
        """Test using time mocking"""
        with TestHelpers.mock_time(1609459200):  # 2021-01-01 00:00:00
            import time
            assert time.time() == 1609459200

    def test_with_test_data(self):
        """Test using external test data"""
        test_data = TestHelpers.load_test_data('user_scenarios.json')

        for scenario in test_data['scenarios']:
            user = User(**scenario['input'])
            assert user.is_valid() == scenario['expected_valid']
\`\`\`

## Implementation Checklist

- [ ] Set up pytest with proper configuration and markers
- [ ] Create comprehensive fixture hierarchy
- [ ] Implement parameterized tests for data-driven testing
- [ ] Set up mocking for external dependencies
- [ ] Write unit tests for models and services
- [ ] Create integration tests for APIs and database
- [ ] Add performance benchmarks for critical paths
- [ ] Implement test helpers and utilities
- [ ] Set up test data management
- [ ] Configure test coverage reporting
- [ ] Add custom assertions and decorators
- [ ] Organize tests by type (unit/integration/e2e)
- [ ] Set up CI/CD pipeline integration
- [ ] Document testing guidelines and conventions

This comprehensive guide provides the foundation for building robust test suites with pytest, covering everything from basic setup to advanced patterns like fixtures, mocking, parameterization, and performance testing.`,	applicationMode: "intelligent",

}