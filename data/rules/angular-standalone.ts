import { Rule } from "../types";

export const rule: Rule = {
	id: "angular-standalone",
	slug: "angular-standalone",
	title: "Angular Standalone Components",
	description:
		"Modern Angular development with standalone components, signals, and latest patterns",
	content: `# Angular Standalone Components Best Practices

Comprehensive guide for building modern Angular applications with standalone components, signals, and the latest Angular patterns.

---

## Core Standalone Component Principles

1. **Standalone Component Architecture**
   - Use standalone components to eliminate NgModule boilerplate
   - Import dependencies directly in component metadata
   - Create tree-shakable and modular applications
   - Example standalone component:
     \`\`\`typescript
     import { Component, inject, signal } from '@angular/core';
     import { CommonModule } from '@angular/common';
     import { ReactiveFormsModule } from '@angular/forms';
     import { Router } from '@angular/router';
     import { HttpClient } from '@angular/common/http';

     @Component({
       selector: 'app-user-profile',
       standalone: true,
       imports: [CommonModule, ReactiveFormsModule],
       template: \`
         <div class="user-profile">
           <h2>{{ user().name }}</h2>
           <p>{{ user().email }}</p>
           @if (loading()) {
             <div class="loading">Loading...</div>
           }
           @for (post of posts(); track post.id) {
             <div class="post">{{ post.title }}</div>
           }
         </div>
       \`,
       styles: [\`
         .user-profile {
           padding: 1rem;
           border-radius: 8px;
           box-shadow: 0 2px 4px rgba(0,0,0,0.1);
         }
         .loading {
           text-align: center;
           color: #666;
         }
       \`]
     })
     export class UserProfileComponent {
       private http = inject(HttpClient);
       private router = inject(Router);

       // Signals for reactive state
       user = signal<User | null>(null);
       posts = signal<Post[]>([]);
       loading = signal(false);

       async ngOnInit() {
         await this.loadUserData();
       }

       private async loadUserData() {
         this.loading.set(true);
         try {
           const userData = await this.http.get<User>('/api/user').toPromise();
           const userPosts = await this.http.get<Post[]>('/api/posts').toPromise();

           this.user.set(userData);
           this.posts.set(userPosts);
         } finally {
           this.loading.set(false);
         }
       }
     }
     \`\`\`

2. **Dependency Injection with inject()**
   - Use the new inject() function instead of constructor injection
   - Leverage functional dependency injection patterns
   - Create injectable services with providedIn: 'root'
   - Example service injection:
     \`\`\`typescript
     import { Injectable, inject, signal } from '@angular/core';
     import { HttpClient } from '@angular/common/http';

     @Injectable({
       providedIn: 'root'
     })
     export class UserService {
       private http = inject(HttpClient);

       users = signal<User[]>([]);
       loading = signal(false);

       async loadUsers() {
         this.loading.set(true);
         try {
           const users = await this.http.get<User[]>('/api/users').toPromise();
           this.users.set(users);
         } finally {
           this.loading.set(false);
         }
       }
     }

     // Component usage
     @Component({
       selector: 'app-users',
       standalone: true,
       template: \`
         @for (user of userService.users(); track user.id) {
           <div>{{ user.name }}</div>
         }
       \`
     })
     export class UsersComponent {
       userService = inject(UserService);

       ngOnInit() {
         this.userService.loadUsers();
       }
     }
     \`\`\`

3. **Signals for State Management**
   - Replace BehaviorSubject and observables with signals where appropriate
   - Use computed signals for derived state
   - Implement effect() for side effects
   - Example signal patterns:
     \`\`\`typescript
     import { Component, signal, computed, effect } from '@angular/core';

     @Component({
       selector: 'app-counter',
       standalone: true,
       template: \`
         <div>
           <p>Count: {{ count() }}</p>
           <p>Double: {{ doubleCount() }}</p>
           <p>Is Even: {{ isEven() }}</p>
           <button (click)="increment()">+</button>
           <button (click)="decrement()">-</button>
           <button (click)="reset()">Reset</button>
         </div>
       \`
     })
     export class CounterComponent {
       count = signal(0);

       // Computed signals automatically update when dependencies change
       doubleCount = computed(() => this.count() * 2);
       isEven = computed(() => this.count() % 2 === 0);

       constructor() {
         // Effects run when signal dependencies change
         effect(() => {
           console.log(\`Count changed to: \${this.count()}\`);
           localStorage.setItem('count', this.count().toString());
         });
       }

       increment() {
         this.count.update(current => current + 1);
       }

       decrement() {
         this.count.update(current => current - 1);
       }

       reset() {
         this.count.set(0);
       }
     }
     \`\`\`

---

## Modern Template Syntax

4. **Control Flow with @if, @for, @switch**
   - Use new control flow syntax instead of structural directives
   - Implement proper track functions for @for loops
   - Handle empty states and loading conditions
   - Example control flow patterns:
     \`\`\`typescript
     @Component({
       selector: 'app-product-list',
       standalone: true,
       imports: [CommonModule],
       template: \`
         <div class="product-list">
           @if (loading()) {
             <div class="loading-spinner">Loading products...</div>
           } @else if (error()) {
             <div class="error-message">{{ error() }}</div>
           } @else {
             @if (products().length > 0) {
               @for (product of products(); track product.id) {
                 <div class="product-card">
                   <h3>{{ product.name }}</h3>
                   <p>{{ product.description }}</p>
                   <span class="price">\\\${{ product.price }}</span>

                   @switch (product.category) {
                     @case ('electronics') {
                       <span class="category tech">Tech</span>
                     }
                     @case ('clothing') {
                       <span class="category fashion">Fashion</span>
                     }
                     @default {
                       <span class="category other">Other</span>
                     }
                   }
                 </div>
               }
             } @else {
               <div class="empty-state">
                 <p>No products found</p>
                 <button (click)="loadProducts()">Retry</button>
               </div>
             }
           }
         </div>
       \`
     })
     export class ProductListComponent {
       products = signal<Product[]>([]);
       loading = signal(false);
       error = signal<string | null>(null);

       async loadProducts() {
         this.loading.set(true);
         this.error.set(null);

         try {
           const products = await this.productService.getProducts();
           this.products.set(products);
         } catch (err) {
           this.error.set('Failed to load products');
         } finally {
           this.loading.set(false);
         }
       }
     }
     \`\`\`

5. **Reactive Forms with Signals**
   - Integrate reactive forms with signal-based state
   - Implement form validation with signals
   - Handle form submission and errors
   - Example form integration:
     \`\`\`typescript
     import { Component, signal } from '@angular/core';
     import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
     import { CommonModule } from '@angular/common';

     @Component({
       selector: 'app-user-form',
       standalone: true,
       imports: [CommonModule, ReactiveFormsModule],
       template: \`
         <form [formGroup]="userForm" (ngSubmit)="onSubmit()">
           <div class="form-group">
             <label for="name">Name</label>
             <input
               id="name"
               type="text"
               formControlName="name"
               [class.error]="userForm.get('name')?.invalid && userForm.get('name')?.touched"
             >
             @if (userForm.get('name')?.invalid && userForm.get('name')?.touched) {
               <div class="error-message">Name is required</div>
             }
           </div>

           <div class="form-group">
             <label for="email">Email</label>
             <input
               id="email"
               type="email"
               formControlName="email"
               [class.error]="userForm.get('email')?.invalid && userForm.get('email')?.touched"
             >
             @if (userForm.get('email')?.invalid && userForm.get('email')?.touched) {
               <div class="error-message">Valid email is required</div>
             }
           </div>

           @if (submitError()) {
             <div class="error-message">{{ submitError() }}</div>
           }

           <button
             type="submit"
             [disabled]="userForm.invalid || submitting()"
           >
             @if (submitting()) {
               Saving...
             } @else {
               Save User
             }
           </button>
         </form>
       \`
     })
     export class UserFormComponent {
       private fb = inject(FormBuilder);
       private userService = inject(UserService);

       submitting = signal(false);
       submitError = signal<string | null>(null);

       userForm = this.fb.group({
         name: ['', [Validators.required, Validators.minLength(2)]],
         email: ['', [Validators.required, Validators.email]]
       });

       async onSubmit() {
         if (this.userForm.valid) {
           this.submitting.set(true);
           this.submitError.set(null);

           try {
             await this.userService.createUser(this.userForm.value);
             this.userForm.reset();
           } catch (error) {
             this.submitError.set('Failed to save user');
           } finally {
             this.submitting.set(false);
           }
         }
       }
     }
     \`\`\`

---

## Component Communication

6. **Input and Output with Signals**
   - Use signal inputs for reactive component properties
   - Implement type-safe outputs with functions
   - Handle optional inputs with default values
   - Example component communication:
     \`\`\`typescript
     // Child component
     @Component({
       selector: 'app-user-card',
       standalone: true,
       imports: [CommonModule],
       template: \`
         <div class="user-card" [class.selected]="selected()">
           <img [src]="user().avatar" [alt]="user().name">
           <h3>{{ user().name }}</h3>
           <p>{{ user().email }}</p>
           <button (click)="onSelect()">
             {{ selected() ? 'Deselect' : 'Select' }}
           </button>
           <button (click)="onEdit()" class="edit-btn">Edit</button>
         </div>
       \`
     })
     export class UserCardComponent {
       // Signal inputs
       user = input.required<User>();
       selected = input(false);

       // Function outputs
       userSelected = output<User>();
       userEdit = output<User>();

       onSelect() {
         this.userSelected.emit(this.user());
       }

       onEdit() {
         this.userEdit.emit(this.user());
       }
     }

     // Parent component
     @Component({
       selector: 'app-user-list',
       standalone: true,
       imports: [CommonModule, UserCardComponent],
       template: \`
         <div class="user-list">
           @for (user of users(); track user.id) {
             <app-user-card
               [user]="user"
               [selected]="selectedUsers().has(user.id)"
               (userSelected)="toggleUserSelection($event)"
               (userEdit)="editUser($event)"
             />
           }
         </div>
       \`
     })
     export class UserListComponent {
       users = signal<User[]>([]);
       selectedUsers = signal<Set<string>>(new Set());

       toggleUserSelection(user: User) {
         this.selectedUsers.update(selected => {
           const newSet = new Set(selected);
           if (newSet.has(user.id)) {
             newSet.delete(user.id);
           } else {
             newSet.add(user.id);
           }
           return newSet;
         });
       }

       editUser(user: User) {
         this.router.navigate(['/users', user.id, 'edit']);
       }
     }
     \`\`\`

7. **Service Communication with Signals**
   - Create reactive services using signals
   - Implement global state management
   - Handle cross-component communication
   - Example service-based communication:
     \`\`\`typescript
     @Injectable({
       providedIn: 'root'
     })
     export class NotificationService {
       private notificationsSignal = signal<Notification[]>([]);

       notifications = this.notificationsSignal.asReadonly();

       add(notification: Omit<Notification, 'id' | 'timestamp'>) {
         const newNotification: Notification = {
           ...notification,
           id: Date.now().toString(),
           timestamp: new Date()
         };

         this.notificationsSignal.update(notifications =>
           [...notifications, newNotification]
         );

         // Auto-remove after delay
         setTimeout(() => {
           this.remove(newNotification.id);
         }, notification.duration || 5000);
       }

       remove(id: string) {
         this.notificationsSignal.update(notifications =>
           notifications.filter(n => n.id !== id)
         );
       }

       clear() {
         this.notificationsSignal.set([]);
       }
     }

     // Usage in components
     @Component({
       selector: 'app-notification-list',
       standalone: true,
       template: \`
         <div class="notifications">
           @for (notification of notificationService.notifications(); track notification.id) {
             <div
               class="notification"
               [class]="notification.type"
             >
               <span>{{ notification.message }}</span>
               <button (click)="notificationService.remove(notification.id)">×</button>
             </div>
           }
         </div>
       \`
     })
     export class NotificationListComponent {
       notificationService = inject(NotificationService);
     }
     \`\`\`

---

## Routing and Navigation

8. **Functional Route Guards**
   - Use functional guards instead of class-based guards
   - Implement route protection with signals
   - Handle navigation state reactively
   - Example functional guards:
     \`\`\`typescript
     import { inject } from '@angular/core';
     import { Router, type CanActivateFn } from '@angular/router';

     export const authGuard: CanActivateFn = (route, state) => {
       const authService = inject(AuthService);
       const router = inject(Router);

       if (authService.isAuthenticated()) {
         return true;
       }

       // Redirect to login with return URL
       router.navigate(['/login'], {
         queryParams: { returnUrl: state.url }
       });
       return false;
     };

     export const adminGuard: CanActivateFn = (route, state) => {
       const authService = inject(AuthService);
       const router = inject(Router);

       if (authService.isAuthenticated() && authService.isAdmin()) {
         return true;
       }

       router.navigate(['/unauthorized']);
       return false;
     };

     // Route configuration
     export const routes: Routes = [
       {
         path: 'dashboard',
         loadComponent: () => import('./dashboard/dashboard.component').then(m => m.DashboardComponent),
         canActivate: [authGuard]
       },
       {
         path: 'admin',
         loadChildren: () => import('./admin/admin.routes').then(m => m.adminRoutes),
         canActivate: [authGuard, adminGuard]
       },
       {
         path: 'profile/:id',
         loadComponent: () => import('./profile/profile.component').then(m => m.ProfileComponent),
         resolve: {
           user: userResolver
         }
       }
     ];

     // Functional resolver
     export const userResolver: ResolveFn<User> = (route, state) => {
       const userService = inject(UserService);
       const userId = route.paramMap.get('id')!;
       return userService.getUser(userId);
     };
     \`\`\`

9. **Lazy Loading with Standalone Components**
   - Implement route-level code splitting
   - Load components and features on demand
   - Optimize bundle size with lazy loading
   - Example lazy loading setup:
     \`\`\`typescript
     // app.routes.ts
     import { Routes } from '@angular/router';

     export const routes: Routes = [
       {
         path: '',
         redirectTo: '/dashboard',
         pathMatch: 'full'
       },
       {
         path: 'dashboard',
         loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
       },
       {
         path: 'products',
         loadChildren: () => import('./features/products/products.routes').then(m => m.productRoutes)
       },
       {
         path: 'users',
         loadChildren: () => import('./features/users/users.routes').then(m => m.userRoutes)
       }
     ];

     // features/products/products.routes.ts
     export const productRoutes: Routes = [
       {
         path: '',
         loadComponent: () => import('./product-list/product-list.component').then(m => m.ProductListComponent)
       },
       {
         path: 'create',
         loadComponent: () => import('./product-form/product-form.component').then(m => m.ProductFormComponent)
       },
       {
         path: ':id',
         loadComponent: () => import('./product-detail/product-detail.component').then(m => m.ProductDetailComponent)
       },
       {
         path: ':id/edit',
         loadComponent: () => import('./product-form/product-form.component').then(m => m.ProductFormComponent)
       }
     ];
     \`\`\`

---

## Testing Standalone Components

10. **Component Testing Strategies**
    - Test standalone components in isolation
    - Mock dependencies and services
    - Test signal interactions and computed values
    - Example testing patterns:
      \`\`\`typescript
      import { ComponentFixture, TestBed } from '@angular/core/testing';
      import { signal } from '@angular/core';
      import { UserProfileComponent } from './user-profile.component';
      import { UserService } from './user.service';

      describe('UserProfileComponent', () => {
        let component: UserProfileComponent;
        let fixture: ComponentFixture<UserProfileComponent>;
        let mockUserService: jasmine.SpyObj<UserService>;

        beforeEach(async () => {
          const userServiceSpy = jasmine.createSpyObj('UserService', ['getUser', 'updateUser']);

          await TestBed.configureTestingModule({
            imports: [UserProfileComponent],
            providers: [
              { provide: UserService, useValue: userServiceSpy }
            ]
          }).compileComponents();

          mockUserService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
          fixture = TestBed.createComponent(UserProfileComponent);
          component = fixture.componentInstance;
        });

        it('should create', () => {
          expect(component).toBeTruthy();
        });

        it('should load user data on init', async () => {
          const mockUser = { id: '1', name: 'John Doe', email: 'john@example.com' };
          mockUserService.getUser.and.returnValue(Promise.resolve(mockUser));

          await component.ngOnInit();

          expect(component.user()).toEqual(mockUser);
          expect(component.loading()).toBe(false);
        });

        it('should handle loading state', () => {
          component.loading.set(true);
          fixture.detectChanges();

          const loadingElement = fixture.debugElement.nativeElement.querySelector('.loading');
          expect(loadingElement).toBeTruthy();
          expect(loadingElement.textContent).toContain('Loading');
        });

        it('should update computed values when user changes', () => {
          const user = { id: '1', name: 'John', email: 'john@example.com' };
          component.user.set(user);

          expect(component.displayName()).toBe('John');

          component.user.update(u => ({ ...u!, name: 'Jane' }));

          expect(component.displayName()).toBe('Jane');
        });
      });

      // Service testing
      describe('UserService', () => {
        let service: UserService;
        let httpMock: jasmine.SpyObj<HttpClient>;

        beforeEach(() => {
          const httpSpy = jasmine.createSpyObj('HttpClient', ['get', 'post', 'put', 'delete']);

          TestBed.configureTestingModule({
            providers: [
              UserService,
              { provide: HttpClient, useValue: httpSpy }
            ]
          });

          service = TestBed.inject(UserService);
          httpMock = TestBed.inject(HttpClient) as jasmine.SpyObj<HttpClient>;
        });

        it('should load users and update signal', async () => {
          const mockUsers = [
            { id: '1', name: 'John' },
            { id: '2', name: 'Jane' }
          ];
          httpMock.get.and.returnValue(Promise.resolve(mockUsers));

          await service.loadUsers();

          expect(service.users()).toEqual(mockUsers);
          expect(service.loading()).toBe(false);
        });
      });
      \`\`\`

---

## Summary Checklist

- [ ] Use standalone components to eliminate NgModule boilerplate
- [ ] Leverage inject() function for dependency injection
- [ ] Implement signals for reactive state management
- [ ] Use new control flow syntax (@if, @for, @switch)
- [ ] Create computed signals for derived state
- [ ] Implement functional route guards and resolvers
- [ ] Use lazy loading for optimal bundle size
- [ ] Write comprehensive tests for components and services
- [ ] Handle form state with reactive forms and signals
- [ ] Implement proper error handling and loading states
- [ ] Use signal inputs and function outputs for component communication
- [ ] Create reactive services with signal-based state

---

Follow these patterns to build modern, performant Angular applications using standalone components and the latest Angular features.`,
	categories: ["angular", "frontend", "typescript"],
	tags: ["standalone", "signals", "modern-angular"],
	author: "Community",
	createdAt: "2024-01-15T00:00:00Z",
	applicationMode: "intelligent",
	globs: "*.ts,*.html,*.scss",
};
