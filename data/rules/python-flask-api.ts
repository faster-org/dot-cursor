import { Rule } from "../types";

export const rule: Rule = {
	id: "python-flask-api",
	slug: "python-flask-api",
	title: "Python Flask API Development",
	tags: ["python", "flask", "api", "backend", "rest"],
	languages: ["python"],
	description: "Best practices for building secure and scalable REST APIs with Python Flask",
	
	categories: ["programming", "language", "api", "backend"],content: `# Python Flask API Development

## 1. Project Structure and Organization

### Recommended Flask Project Structure
\`\`\`
project/
├── app/
│   ├── __init__.py          # Application factory
│   ├── models/              # Database models
│   ├── api/                 # API blueprints
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   └── users.py
│   ├── core/                # Core functionality
│   │   ├── config.py
│   │   ├── database.py
│   │   └── exceptions.py
│   └── utils/               # Utility functions
├── migrations/              # Database migrations
├── tests/                   # Test files
├── requirements.txt
└── run.py                   # Application entry point
\`\`\`

### Application Factory Pattern
\`\`\`python
# app/__init__.py
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app(config_name='development'):
    app = Flask(__name__)
    app.config.from_object(f'app.core.config.{config_name.title()}Config')

    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)

    # Register blueprints
    from app.api import auth_bp, users_bp
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(users_bp, url_prefix='/api/users')

    return app
\`\`\`

## 2. Configuration Management

### Environment-Based Configuration
\`\`\`python
# app/core/config.py
import os
from datetime import timedelta

class BaseConfig:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'dev-secret-key'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)

class DevelopmentConfig(BaseConfig):
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = os.environ.get('DEV_DATABASE_URL') or \
        'sqlite:///dev.db'

class ProductionConfig(BaseConfig):
    DEBUG = False
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')

class TestingConfig(BaseConfig):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
\`\`\`

## 3. Database Models and Relationships

### SQLAlchemy Model Best Practices
\`\`\`python
# app/models/user.py
from app import db
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    posts = db.relationship('Post', backref='author', lazy='dynamic', cascade='all, delete-orphan')

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)

    def to_dict(self, include_email=False):
        data = {
            'id': self.id,
            'username': self.username,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
        if include_email:
            data['email'] = self.email
        return data
\`\`\`

## 4. API Blueprint Structure

### RESTful API Blueprint
\`\`\`python
# app/api/users.py
from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.exc import IntegrityError
from app import db
from app.models.user import User
from app.core.exceptions import ValidationError, NotFoundError

users_bp = Blueprint('users', __name__)

@users_bp.route('', methods=['GET'])
@jwt_required()
def get_users():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    per_page = min(per_page, 100)  # Limit max per_page

    users = User.query.filter_by(is_active=True).paginate(
        page=page, per_page=per_page, error_out=False
    )

    return jsonify({
        'users': [user.to_dict() for user in users.items],
        'pagination': {
            'page': page,
            'per_page': per_page,
            'total': users.total,
            'pages': users.pages
        }
    })

@users_bp.route('/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    user = User.query.get_or_404(user_id)
    current_user_id = get_jwt_identity()
    include_email = (current_user_id == user_id)

    return jsonify(user.to_dict(include_email=include_email))

@users_bp.route('', methods=['POST'])
def create_user():
    data = request.get_json()

    # Validation
    required_fields = ['email', 'username', 'password']
    for field in required_fields:
        if not data.get(field):
            raise ValidationError(f'{field} is required')

    try:
        user = User(
            email=data['email'],
            username=data['username']
        )
        user.set_password(data['password'])

        db.session.add(user)
        db.session.commit()

        return jsonify(user.to_dict()), 201

    except IntegrityError:
        db.session.rollback()
        raise ValidationError('Email or username already exists')
\`\`\`

## 5. Authentication and Authorization

### JWT Authentication
\`\`\`python
# app/api/auth.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from app.models.user import User
from app.core.exceptions import AuthenticationError

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')

    if not email or not password:
        raise AuthenticationError('Email and password are required')

    user = User.query.filter_by(email=email, is_active=True).first()

    if user and user.check_password(password):
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)

        return jsonify({
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': user.to_dict()
        })

    raise AuthenticationError('Invalid credentials')

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    current_user_id = get_jwt_identity()
    access_token = create_access_token(identity=current_user_id)

    return jsonify({'access_token': access_token})
\`\`\`

## 6. Error Handling

### Custom Exception Classes
\`\`\`python
# app/core/exceptions.py
class APIException(Exception):
    status_code = 500
    message = 'Internal server error'

    def __init__(self, message=None, status_code=None):
        if message:
            self.message = message
        if status_code:
            self.status_code = status_code

class ValidationError(APIException):
    status_code = 400
    message = 'Validation error'

class NotFoundError(APIException):
    status_code = 404
    message = 'Resource not found'

class AuthenticationError(APIException):
    status_code = 401
    message = 'Authentication failed'
\`\`\`

### Global Error Handler
\`\`\`python
# app/__init__.py (add to create_app function)
@app.errorhandler(APIException)
def handle_api_exception(error):
    return jsonify({
        'error': error.message,
        'status_code': error.status_code
    }), error.status_code

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': 'Resource not found'}), 404

@app.errorhandler(500)
def internal_error(error):
    db.session.rollback()
    return jsonify({'error': 'Internal server error'}), 500
\`\`\`

## 7. Input Validation and Serialization

### Request Validation with Marshmallow
\`\`\`python
# requirements.txt addition
marshmallow==3.19.0

# app/schemas/user.py
from marshmallow import Schema, fields, validate, ValidationError

class UserCreateSchema(Schema):
    email = fields.Email(required=True)
    username = fields.Str(required=True, validate=validate.Length(min=3, max=80))
    password = fields.Str(required=True, validate=validate.Length(min=8))

class UserUpdateSchema(Schema):
    email = fields.Email()
    username = fields.Str(validate=validate.Length(min=3, max=80))

# Usage in route
@users_bp.route('', methods=['POST'])
def create_user():
    schema = UserCreateSchema()
    try:
        data = schema.load(request.get_json())
    except ValidationError as err:
        return jsonify({'errors': err.messages}), 400

    # Continue with user creation...
\`\`\`

## 8. Testing

### Unit Tests with pytest
\`\`\`python
# tests/conftest.py
import pytest
from app import create_app, db
from app.models.user import User

@pytest.fixture
def app():
    app = create_app('testing')
    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def sample_user(app):
    user = User(email='test@example.com', username='testuser')
    user.set_password('password123')
    db.session.add(user)
    db.session.commit()
    return user

# tests/test_auth.py
def test_login_success(client, sample_user):
    response = client.post('/api/auth/login', json={
        'email': 'test@example.com',
        'password': 'password123'
    })

    assert response.status_code == 200
    data = response.get_json()
    assert 'access_token' in data
    assert data['user']['username'] == 'testuser'

def test_login_invalid_credentials(client):
    response = client.post('/api/auth/login', json={
        'email': 'wrong@example.com',
        'password': 'wrongpassword'
    })

    assert response.status_code == 401
\`\`\`

## 9. Security Best Practices

### Security Headers and CORS
\`\`\`python
# requirements.txt additions
flask-cors==4.0.0
flask-limiter==3.3.1

# app/__init__.py
from flask_cors import CORS
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address

def create_app(config_name='development'):
    app = Flask(__name__)
    # ... existing code ...

    # CORS configuration
    CORS(app, origins=['http://localhost:3000', 'https://yourdomain.com'])

    # Rate limiting
    limiter = Limiter(
        app,
        key_func=get_remote_address,
        default_limits=["1000 per hour"]
    )

    # Security headers
    @app.after_request
    def after_request(response):
        response.headers['X-Content-Type-Options'] = 'nosniff'
        response.headers['X-Frame-Options'] = 'DENY'
        response.headers['X-XSS-Protection'] = '1; mode=block'
        return response

    return app
\`\`\`

## 10. Performance Optimization

### Database Query Optimization
\`\`\`python
# Use eager loading to prevent N+1 queries
@users_bp.route('/<int:user_id>/posts', methods=['GET'])
@jwt_required()
def get_user_posts(user_id):
    user = User.query.options(
        db.joinedload(User.posts)
    ).get_or_404(user_id)

    return jsonify([post.to_dict() for post in user.posts])

# Use database indexes
class User(db.Model):
    # Add indexes for frequently queried fields
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, index=True)
\`\`\`

## Checklist for Flask API Development

- [ ] Set up application factory pattern
- [ ] Configure environment-based settings
- [ ] Implement proper database models with relationships
- [ ] Create RESTful API blueprints
- [ ] Add JWT authentication and authorization
- [ ] Implement comprehensive error handling
- [ ] Add input validation and serialization
- [ ] Write unit and integration tests
- [ ] Configure security headers and CORS
- [ ] Implement rate limiting
- [ ] Optimize database queries
- [ ] Set up logging and monitoring
- [ ] Configure production deployment
- [ ] Document API endpoints`,	applicationMode: "intelligent",

}