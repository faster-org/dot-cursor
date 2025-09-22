import { Rule } from "../types";

export const rule: Rule = {
	id: "django-rest",
	slug: "django-rest",
	title: "Django REST Framework",
	description: "Build powerful APIs with Django REST Framework, serializers, and views",
	content: `# Django REST Framework Best Practices

Comprehensive guide for building robust, scalable REST APIs with Django REST Framework (DRF) and advanced Django patterns.

---

## Core DRF Architecture

1. **ViewSet and Generic View Patterns**
   - Use ViewSets for standard CRUD operations
   - Implement Generic Views for custom endpoints
   - Leverage mixins for composable functionality
   - Example ViewSet implementation:
     \`\`\`python
     from rest_framework import viewsets, status
     from rest_framework.decorators import action
     from rest_framework.response import Response
     from rest_framework.permissions import IsAuthenticated
     from django.shortcuts import get_object_or_404

     class UserViewSet(viewsets.ModelViewSet):
         queryset = User.objects.all()
         serializer_class = UserSerializer
         permission_classes = [IsAuthenticated]
         filterset_fields = ['is_active', 'role']
         search_fields = ['username', 'email', 'first_name', 'last_name']
         ordering_fields = ['created_at', 'username']

         def get_serializer_class(self):
             if self.action == 'create':
                 return UserCreateSerializer
             elif self.action in ['update', 'partial_update']:
                 return UserUpdateSerializer
             return UserSerializer

         def get_queryset(self):
             queryset = super().get_queryset()
             if self.action == 'list':
                 return queryset.select_related('profile').prefetch_related('groups')
             return queryset

         @action(detail=True, methods=['post'])
         def set_password(self, request, pk=None):
             user = self.get_object()
             serializer = PasswordChangeSerializer(data=request.data)
             if serializer.is_valid():
                 user.set_password(serializer.validated_data['password'])
                 user.save()
                 return Response({'message': 'Password updated successfully'})
             return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

         @action(detail=False, methods=['get'])
         def me(self, request):
             serializer = self.get_serializer(request.user)
             return Response(serializer.data)
     \`\`\`

2. **Serializer Design Patterns**
   - Create focused serializers for different operations
   - Implement proper validation at field and object levels
   - Use nested serializers for complex relationships
   - Example serializer patterns:
     \`\`\`python
     from rest_framework import serializers
     from django.contrib.auth.password_validation import validate_password
     from django.core.exceptions import ValidationError

     class UserSerializer(serializers.ModelSerializer):
         full_name = serializers.SerializerMethodField()
         profile = ProfileSerializer(read_only=True)
         groups = GroupSerializer(many=True, read_only=True)

         class Meta:
             model = User
             fields = ['id', 'username', 'email', 'first_name', 'last_name',
                      'full_name', 'is_active', 'date_joined', 'profile', 'groups']
             read_only_fields = ['id', 'date_joined']

         def get_full_name(self, obj):
             return f"{obj.first_name} {obj.last_name}".strip()

     class UserCreateSerializer(serializers.ModelSerializer):
         password = serializers.CharField(write_only=True, validators=[validate_password])
         password_confirm = serializers.CharField(write_only=True)
         profile = ProfileCreateSerializer(required=False)

         class Meta:
             model = User
             fields = ['username', 'email', 'first_name', 'last_name',
                      'password', 'password_confirm', 'profile']

         def validate(self, attrs):
             if attrs['password'] != attrs['password_confirm']:
                 raise serializers.ValidationError("Password fields didn't match.")
             return attrs

         def create(self, validated_data):
             profile_data = validated_data.pop('profile', None)
             validated_data.pop('password_confirm')

             user = User.objects.create_user(**validated_data)

             if profile_data:
                 Profile.objects.create(user=user, **profile_data)

             return user

     class UserUpdateSerializer(serializers.ModelSerializer):
         profile = ProfileUpdateSerializer(required=False)

         class Meta:
             model = User
             fields = ['first_name', 'last_name', 'email', 'profile']

         def update(self, instance, validated_data):
             profile_data = validated_data.pop('profile', None)

             # Update user fields
             for attr, value in validated_data.items():
                 setattr(instance, attr, value)
             instance.save()

             # Update profile if provided
             if profile_data:
                 profile = instance.profile
                 for attr, value in profile_data.items():
                     setattr(profile, attr, value)
                 profile.save()

             return instance
     \`\`\`

3. **Advanced Validation Patterns**
   - Implement custom field validators
   - Create object-level validation
   - Handle conditional validation logic
   - Example validation implementations:
     \`\`\`python
     from rest_framework import serializers
     from django.core.validators import RegexValidator

     class CustomValidationSerializer(serializers.ModelSerializer):
         phone_number = serializers.CharField(
             validators=[RegexValidator(
                 regex=r'^\\+?1?\\d{9,15}$',
                 message="Phone number must be entered in the format: '+999999999'. Up to 15 digits allowed."
             )]
         )

         def validate_email(self, value):
             """Field-level validation for email"""
             if User.objects.filter(email=value).exclude(pk=self.instance.pk if self.instance else None).exists():
                 raise serializers.ValidationError("Email address must be unique.")
             return value

         def validate(self, attrs):
             """Object-level validation"""
             # Conditional validation
             if attrs.get('role') == 'admin' and not attrs.get('is_staff'):
                 raise serializers.ValidationError(
                     "Admin users must have staff privileges."
                 )

             # Cross-field validation
             start_date = attrs.get('start_date')
             end_date = attrs.get('end_date')
             if start_date and end_date and start_date >= end_date:
                 raise serializers.ValidationError(
                     "End date must be after start date."
                 )

             return attrs
     \`\`\`

---

## Authentication and Permissions

4. **Authentication Strategy Implementation**
   - Configure multiple authentication backends
   - Implement JWT authentication with refresh tokens
   - Handle authentication errors gracefully
   - Example authentication setup:
     \`\`\`python
     # settings.py
     REST_FRAMEWORK = {
         'DEFAULT_AUTHENTICATION_CLASSES': [
             'rest_framework_simplejwt.authentication.JWTAuthentication',
             'rest_framework.authentication.SessionAuthentication',
             'rest_framework.authentication.TokenAuthentication',
         ],
         'DEFAULT_PERMISSION_CLASSES': [
             'rest_framework.permissions.IsAuthenticated',
         ],
     }

     from datetime import timedelta
     SIMPLE_JWT = {
         'ACCESS_TOKEN_LIFETIME': timedelta(minutes=60),
         'REFRESH_TOKEN_LIFETIME': timedelta(days=7),
         'ROTATE_REFRESH_TOKENS': True,
         'BLACKLIST_AFTER_ROTATION': True,
         'UPDATE_LAST_LOGIN': True,
         'ALGORITHM': 'HS256',
         'SIGNING_KEY': SECRET_KEY,
         'AUTH_HEADER_TYPES': ('Bearer',),
     }

     # Custom JWT views
     from rest_framework_simplejwt.views import TokenObtainPairView
     from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

     class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
         def validate(self, attrs):
             data = super().validate(attrs)

             # Add custom data to token response
             data['user'] = {
                 'id': self.user.id,
                 'username': self.user.username,
                 'email': self.user.email,
                 'is_staff': self.user.is_staff,
             }

             return data

     class CustomTokenObtainPairView(TokenObtainPairView):
         serializer_class = CustomTokenObtainPairSerializer
     \`\`\`

5. **Custom Permission Classes**
   - Create reusable permission classes
   - Implement object-level permissions
   - Handle complex permission logic
   - Example permission implementations:
     \`\`\`python
     from rest_framework import permissions

     class IsOwnerOrReadOnly(permissions.BasePermission):
         """Custom permission to only allow owners to edit objects."""

         def has_object_permission(self, request, view, obj):
             # Read permissions for any request
             if request.method in permissions.SAFE_METHODS:
                 return True

             # Write permissions only to the owner
             return obj.owner == request.user

     class IsAdminOrReadOnly(permissions.BasePermission):
         """Custom permission for admin-only write access."""

         def has_permission(self, request, view):
             if request.method in permissions.SAFE_METHODS:
                 return True
             return request.user.is_staff

     class RoleBasedPermission(permissions.BasePermission):
         """Permission based on user roles."""

         role_permissions = {
             'admin': ['create', 'read', 'update', 'delete'],
             'manager': ['create', 'read', 'update'],
             'user': ['read'],
         }

         def has_permission(self, request, view):
             if not request.user.is_authenticated:
                 return False

             user_role = getattr(request.user, 'role', 'user')
             allowed_actions = self.role_permissions.get(user_role, [])

             action_map = {
                 'GET': 'read',
                 'POST': 'create',
                 'PUT': 'update',
                 'PATCH': 'update',
                 'DELETE': 'delete',
             }

             required_action = action_map.get(request.method)
             return required_action in allowed_actions
     \`\`\`

6. **Rate Limiting and Throttling**
   - Implement different throttle rates for different user types
   - Create custom throttle classes
   - Handle throttle exceeded scenarios
   - Example throttling configuration:
     \`\`\`python
     # settings.py
     REST_FRAMEWORK = {
         'DEFAULT_THROTTLE_CLASSES': [
             'rest_framework.throttling.AnonRateThrottle',
             'rest_framework.throttling.UserRateThrottle'
         ],
         'DEFAULT_THROTTLE_RATES': {
             'anon': '100/hour',
             'user': '1000/hour',
             'premium': '5000/hour',
             'admin': '10000/hour'
         }
     }

     # Custom throttle class
     from rest_framework.throttling import UserRateThrottle

     class PremiumUserRateThrottle(UserRateThrottle):
         scope = 'premium'

         def allow_request(self, request, view):
             if request.user.is_authenticated and hasattr(request.user, 'is_premium'):
                 if request.user.is_premium:
                     return super().allow_request(request, view)
             return True  # No throttling for non-premium users

     # Usage in views
     class APIViewWithThrottling(viewsets.ModelViewSet):
         throttle_classes = [PremiumUserRateThrottle]
         throttle_scope = 'premium'
     \`\`\`

---

## Database Optimization

7. **Query Optimization Patterns**
   - Use select_related for foreign key relationships
   - Use prefetch_related for many-to-many and reverse foreign keys
   - Implement database indexing strategies
   - Example optimization techniques:
     \`\`\`python
     from django.db import models
     from rest_framework import viewsets

     class OptimizedUserViewSet(viewsets.ModelViewSet):
         def get_queryset(self):
             queryset = User.objects.all()

             if self.action == 'list':
                 # Optimize for list view
                 queryset = queryset.select_related('profile').prefetch_related(
                     'groups__permissions',
                     'user_permissions'
                 ).only(
                     'id', 'username', 'email', 'first_name', 'last_name',
                     'profile__bio', 'profile__avatar'
                 )
             elif self.action == 'retrieve':
                 # Optimize for detail view
                 queryset = queryset.select_related('profile').prefetch_related(
                     'posts__comments__author',
                     'groups',
                     'followers',
                     'following'
                 )

             return queryset

     # Model with proper indexing
     class Post(models.Model):
         title = models.CharField(max_length=200, db_index=True)
         author = models.ForeignKey(User, on_delete=models.CASCADE, db_index=True)
         created_at = models.DateTimeField(auto_now_add=True, db_index=True)
         status = models.CharField(max_length=20, choices=STATUS_CHOICES, db_index=True)
         tags = models.ManyToManyField('Tag', through='PostTag')

         class Meta:
             indexes = [
                 models.Index(fields=['author', 'created_at']),
                 models.Index(fields=['status', 'created_at']),
                 models.Index(fields=['title'], name='post_title_idx'),
             ]
             ordering = ['-created_at']

     # Custom manager for common queries
     class PostManager(models.Manager):
         def published(self):
             return self.filter(status='published')

         def by_author(self, author):
             return self.filter(author=author)

         def with_tags(self):
             return self.prefetch_related('tags')
     \`\`\`

8. **Caching Strategies**
   - Implement view-level caching
   - Use database query caching
   - Cache expensive computations
   - Example caching implementations:
     \`\`\`python
     from django.core.cache import cache
     from django.utils.decorators import method_decorator
     from django.views.decorators.cache import cache_page
     from rest_framework.response import Response

     class CachedViewSet(viewsets.ModelViewSet):
         @method_decorator(cache_page(60 * 15))  # Cache for 15 minutes
         def list(self, request, *args, **kwargs):
             return super().list(request, *args, **kwargs)

         def retrieve(self, request, *args, **kwargs):
             instance = self.get_object()
             cache_key = f"user_{instance.id}_detail"

             cached_data = cache.get(cache_key)
             if cached_data:
                 return Response(cached_data)

             serializer = self.get_serializer(instance)
             cache.set(cache_key, serializer.data, 60 * 30)  # Cache for 30 minutes
             return Response(serializer.data)

     # Cache invalidation
     from django.db.models.signals import post_save, post_delete
     from django.dispatch import receiver

     @receiver(post_save, sender=User)
     @receiver(post_delete, sender=User)
     def invalidate_user_cache(sender, instance, **kwargs):
         cache_key = f"user_{instance.id}_detail"
         cache.delete(cache_key)
         # Invalidate related caches
         cache.delete_many([f"user_list_page_{i}" for i in range(1, 10)])
     \`\`\`

---

## API Design and Documentation

9. **Versioning Strategy**
   - Implement API versioning
   - Handle backward compatibility
   - Provide clear migration paths
   - Example versioning implementation:
     \`\`\`python
     # settings.py
     REST_FRAMEWORK = {
         'DEFAULT_VERSIONING_CLASS': 'rest_framework.versioning.NamespaceVersioning',
         'DEFAULT_VERSION': 'v1',
         'ALLOWED_VERSIONS': ['v1', 'v2'],
         'VERSION_PARAM': 'version'
     }

     # urls.py
     from django.urls import path, include

     urlpatterns = [
         path('api/v1/', include('myapp.urls', namespace='v1')),
         path('api/v2/', include('myapp.v2_urls', namespace='v2')),
     ]

     # Versioned serializers
     class UserV1Serializer(serializers.ModelSerializer):
         class Meta:
             model = User
             fields = ['id', 'username', 'email']

     class UserV2Serializer(serializers.ModelSerializer):
         full_name = serializers.SerializerMethodField()

         class Meta:
             model = User
             fields = ['id', 'username', 'email', 'full_name', 'created_at']

         def get_full_name(self, obj):
             return f"{obj.first_name} {obj.last_name}"

     # Versioned views
     class UserViewSet(viewsets.ModelViewSet):
         queryset = User.objects.all()

         def get_serializer_class(self):
             if self.request.version == 'v2':
                 return UserV2Serializer
             return UserV1Serializer
     \`\`\`

10. **API Documentation with Swagger/OpenAPI**
    - Auto-generate API documentation
    - Add detailed endpoint descriptions
    - Include example requests and responses
    - Example documentation setup:
      \`\`\`python
      # settings.py
      INSTALLED_APPS = [
          'drf_spectacular',
      ]

      REST_FRAMEWORK = {
          'DEFAULT_SCHEMA_CLASS': 'drf_spectacular.openapi.AutoSchema',
      }

      SPECTACULAR_SETTINGS = {
          'TITLE': 'Your API',
          'DESCRIPTION': 'Your project description',
          'VERSION': '1.0.0',
          'SERVE_INCLUDE_SCHEMA': False,
      }

      # Documented views
      from drf_spectacular.utils import extend_schema, OpenApiParameter, OpenApiExample
      from drf_spectacular.types import OpenApiTypes

      class DocumentedUserViewSet(viewsets.ModelViewSet):
          @extend_schema(
              summary="List all users",
              description="Retrieve a paginated list of all users in the system.",
              parameters=[
                  OpenApiParameter(
                      name='is_active',
                      type=OpenApiTypes.BOOL,
                      description='Filter by active status'
                  ),
                  OpenApiParameter(
                      name='search',
                      type=OpenApiTypes.STR,
                      description='Search in username, email, and name fields'
                  ),
              ],
              examples=[
                  OpenApiExample(
                      'Active users only',
                      value={'is_active': True},
                      request_only=True,
                  ),
              ]
          )
          def list(self, request, *args, **kwargs):
              return super().list(request, *args, **kwargs)

          @extend_schema(
              summary="Create a new user",
              description="Create a new user account with the provided information.",
              request=UserCreateSerializer,
              responses={201: UserSerializer}
          )
          def create(self, request, *args, **kwargs):
              return super().create(request, *args, **kwargs)
      \`\`\`

---

## Testing and Quality Assurance

11. **API Testing Strategies**
    - Write comprehensive test suites
    - Test serializers, views, and permissions
    - Use factories for test data generation
    - Example testing patterns:
      \`\`\`python
      from rest_framework.test import APITestCase, APIClient
      from rest_framework import status
      from django.contrib.auth import get_user_model
      from django.urls import reverse
      import factory

      User = get_user_model()

      class UserFactory(factory.django.DjangoModelFactory):
          class Meta:
              model = User

          username = factory.Sequence(lambda n: f"user{n}")
          email = factory.LazyAttribute(lambda obj: f"{obj.username}@example.com")
          first_name = factory.Faker('first_name')
          last_name = factory.Faker('last_name')

      class UserAPITestCase(APITestCase):
          def setUp(self):
              self.client = APIClient()
              self.user = UserFactory()
              self.admin_user = UserFactory(is_staff=True)

          def test_list_users_authenticated(self):
              self.client.force_authenticate(user=self.user)
              url = reverse('user-list')
              response = self.client.get(url)

              self.assertEqual(response.status_code, status.HTTP_200_OK)
              self.assertIn('results', response.data)

          def test_create_user_with_valid_data(self):
              url = reverse('user-list')
              data = {
                  'username': 'newuser',
                  'email': 'newuser@example.com',
                  'password': 'testpass123',
                  'password_confirm': 'testpass123'
              }

              response = self.client.post(url, data)

              self.assertEqual(response.status_code, status.HTTP_201_CREATED)
              self.assertTrue(User.objects.filter(username='newuser').exists())

          def test_permission_denied_for_unauthorized_access(self):
              url = reverse('user-detail', kwargs={'pk': self.user.pk})
              response = self.client.delete(url)

              self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

      # Serializer tests
      class UserSerializerTestCase(TestCase):
          def test_valid_serializer(self):
              data = {
                  'username': 'testuser',
                  'email': 'test@example.com',
                  'password': 'testpass123',
                  'password_confirm': 'testpass123'
              }

              serializer = UserCreateSerializer(data=data)
              self.assertTrue(serializer.is_valid())

              user = serializer.save()
              self.assertEqual(user.username, 'testuser')
              self.assertTrue(user.check_password('testpass123'))

          def test_password_mismatch_validation(self):
              data = {
                  'username': 'testuser',
                  'email': 'test@example.com',
                  'password': 'testpass123',
                  'password_confirm': 'differentpass'
              }

              serializer = UserCreateSerializer(data=data)
              self.assertFalse(serializer.is_valid())
              self.assertIn('non_field_errors', serializer.errors)
      \`\`\`

---

## Production Deployment

12. **Security and Production Settings**
    - Configure proper security settings
    - Implement CORS policies
    - Set up proper logging and monitoring
    - Example production configuration:
      \`\`\`python
      # settings/production.py
      import os
      from .base import *

      DEBUG = False
      ALLOWED_HOSTS = os.environ.get('ALLOWED_HOSTS', '').split(',')

      # Security settings
      SECURE_BROWSER_XSS_FILTER = True
      SECURE_CONTENT_TYPE_NOSNIFF = True
      SECURE_HSTS_SECONDS = 31536000
      SECURE_HSTS_INCLUDE_SUBDOMAINS = True
      SECURE_HSTS_PRELOAD = True
      SECURE_SSL_REDIRECT = True

      # CORS settings
      CORS_ALLOWED_ORIGINS = [
          "https://yourdomain.com",
          "https://www.yourdomain.com",
      ]

      # Logging configuration
      LOGGING = {
          'version': 1,
          'disable_existing_loggers': False,
          'formatters': {
              'verbose': {
                  'format': '{levelname} {asctime} {module} {process:d} {thread:d} {message}',
                  'style': '{',
              },
          },
          'handlers': {
              'file': {
                  'level': 'INFO',
                  'class': 'logging.FileHandler',
                  'filename': '/var/log/django/debug.log',
                  'formatter': 'verbose',
              },
          },
          'root': {
              'handlers': ['file'],
              'level': 'INFO',
          },
      }

      # Database connection pooling
      DATABASES = {
          'default': {
              'ENGINE': 'django.db.backends.postgresql',
              'NAME': os.environ.get('DB_NAME'),
              'USER': os.environ.get('DB_USER'),
              'PASSWORD': os.environ.get('DB_PASSWORD'),
              'HOST': os.environ.get('DB_HOST'),
              'PORT': os.environ.get('DB_PORT'),
              'OPTIONS': {
                  'MAX_CONNS': 20,
                  'MIN_CONNS': 5,
              }
          }
      }
      \`\`\`

---

## Summary Checklist

- [ ] Use ViewSets for standard CRUD operations
- [ ] Implement focused serializers for different operations
- [ ] Add comprehensive validation at field and object levels
- [ ] Configure JWT authentication with refresh tokens
- [ ] Create custom permission classes for complex authorization
- [ ] Implement proper database query optimization
- [ ] Use caching strategies for performance
- [ ] Add API versioning for backward compatibility
- [ ] Generate comprehensive API documentation
- [ ] Write thorough test suites for all components
- [ ] Configure security settings for production
- [ ] Implement proper error handling and logging
- [ ] Use database indexing for query optimization
- [ ] Set up rate limiting and throttling
- [ ] Follow RESTful API design principles

---

Follow these practices to build robust, scalable, and maintainable REST APIs with Django REST Framework.`,
	categories: ["python", "django", "backend", "api"],
	tags: ["rest-framework", "serializers", "viewsets"],
	author: "Community",
	createdAt: "2024-01-29T00:00:00Z",
	applicationMode: "intelligent",
	globs: "*.py,views.py,serializers.py,models.py",
};
