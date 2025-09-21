import { Rule } from "../types";

export const rule: Rule = {
	id: "vue-composition",
	slug: "vue-composition",
	title: "Vue 3 Composition API",
	description: "Master Vue 3 Composition API, reactivity, and modern Vue patterns",
	content: `# Vue 3 Composition API Best Practices

Comprehensive guide for mastering Vue 3's Composition API, reactivity system, and building scalable Vue applications.

---

## Core Composition API Principles

1. **Setup Function and Script Setup**
   - Use \`<script setup>\` syntax for cleaner, more concise components
   - Leverage automatic component registration and prop inference
   - Understand the differences between setup() function and script setup
   - Example setup patterns:
     \`\`\`vue
     <!-- Preferred: Script Setup Syntax -->
     <script setup lang="ts">
     import { ref, computed, onMounted } from 'vue'
     import type { User } from '@/types'

     // Props are automatically inferred
     interface Props {
       userId: string
       initialData?: User
     }
     const props = defineProps<Props>()

     // Emits are automatically registered
     const emit = defineEmits<{
       update: [user: User]
       delete: [id: string]
     }>()

     // Reactive state
     const user = ref<User | null>(null)
     const loading = ref(false)

     // Computed values
     const displayName = computed(() =>
       user.value ? \`\${user.value.firstName} \${user.value.lastName}\` : 'Unknown'
     )

     // Lifecycle hooks
     onMounted(async () => {
       if (props.initialData) {
         user.value = props.initialData
       } else {
         await fetchUser()
       }
     })

     // Methods
     const fetchUser = async () => {
       loading.value = true
       try {
         user.value = await api.getUser(props.userId)
       } finally {
         loading.value = false
       }
     }
     </script>
     \`\`\`

2. **Reactivity Fundamentals**
   - Use \`ref()\` for primitive values and single references
   - Use \`reactive()\` for objects and arrays
   - Understand reactive vs shallow reactive patterns
   - Example reactivity patterns:
     \`\`\`ts
     import { ref, reactive, computed, toRefs } from 'vue'

     // Primitives use ref
     const count = ref(0)
     const name = ref('John')
     const isVisible = ref(true)

     // Objects use reactive
     const user = reactive({
       id: 1,
       name: 'John Doe',
       email: 'john@example.com',
       preferences: {
         theme: 'dark',
         notifications: true
       }
     })

     // Computed based on reactive data
     const userDisplayInfo = computed(() => ({
       displayName: user.name,
       contactInfo: user.email,
       isActive: user.preferences.notifications
     }))

     // When destructuring reactive objects, use toRefs
     const { name: userName, email } = toRefs(user)
     \`\`\`

3. **TypeScript Integration**
   - Use proper TypeScript types throughout Vue components
   - Leverage Vue's built-in TypeScript support
   - Create type-safe composables and components
   - Example TypeScript patterns:
     \`\`\`ts
     import { ref, computed, type Ref, type ComputedRef } from 'vue'

     interface User {
       id: number
       name: string
       email: string
       role: 'admin' | 'user' | 'guest'
     }

     interface UseUserReturn {
       user: Ref<User | null>
       loading: Ref<boolean>
       error: Ref<string | null>
       fetchUser: (id: number) => Promise<void>
       updateUser: (updates: Partial<User>) => Promise<void>
       isAdmin: ComputedRef<boolean>
     }

     function useUser(initialId?: number): UseUserReturn {
       const user = ref<User | null>(null)
       const loading = ref(false)
       const error = ref<string | null>(null)

       const isAdmin = computed(() => user.value?.role === 'admin')

       const fetchUser = async (id: number) => {
         loading.value = true
         error.value = null
         try {
           user.value = await api.getUser(id)
         } catch (err) {
           error.value = err instanceof Error ? err.message : 'Unknown error'
         } finally {
           loading.value = false
         }
       }

       const updateUser = async (updates: Partial<User>) => {
         if (!user.value) return

         try {
           const updated = await api.updateUser(user.value.id, updates)
           user.value = updated
         } catch (err) {
           error.value = err instanceof Error ? err.message : 'Update failed'
         }
       }

       return {
         user,
         loading,
         error,
         fetchUser,
         updateUser,
         isAdmin
       }
     }
     \`\`\`

---

## Advanced Reactivity Patterns

4. **Computed Properties and Watchers**
   - Use computed for derived state that depends on reactive data
   - Implement watchers for side effects and complex reactions
   - Understand when to use watch vs watchEffect
   - Example advanced reactivity:
     \`\`\`ts
     import { ref, computed, watch, watchEffect } from 'vue'

     const searchQuery = ref('')
     const searchResults = ref([])
     const selectedFilters = reactive({
       category: 'all',
       priceRange: [0, 1000],
       inStock: true
     })

     // Computed for filtered and sorted results
     const filteredResults = computed(() => {
       return searchResults.value
         .filter(item => {
           if (selectedFilters.category !== 'all' && item.category !== selectedFilters.category) {
             return false
           }
           if (item.price < selectedFilters.priceRange[0] || item.price > selectedFilters.priceRange[1]) {
             return false
           }
           if (selectedFilters.inStock && !item.inStock) {
             return false
           }
           return true
         })
         .sort((a, b) => a.name.localeCompare(b.name))
     })

     // Watch for search query changes with debouncing
     const debouncedSearch = ref('')
     let searchTimeout: number

     watch(searchQuery, (newQuery) => {
       clearTimeout(searchTimeout)
       searchTimeout = setTimeout(() => {
         debouncedSearch.value = newQuery
       }, 300)
     })

     // Watch for debounced search changes
     watch(debouncedSearch, async (query) => {
       if (query.length > 2) {
         searchResults.value = await api.search(query)
       } else {
         searchResults.value = []
       }
     })

     // WatchEffect for logging (runs immediately and on dependencies change)
     watchEffect(() => {
       console.log(\`Search: "\${searchQuery.value}" returned \${filteredResults.value.length} results\`)
     })
     \`\`\`

5. **Custom Composables Design**
   - Create reusable logic with custom composables
   - Follow naming conventions (use prefix)
   - Implement proper cleanup and lifecycle management
   - Example composable patterns:
     \`\`\`ts
     // useFetch composable for API requests
     import { ref, type Ref } from 'vue'

     interface UseFetchOptions {
       immediate?: boolean
       onSuccess?: (data: any) => void
       onError?: (error: Error) => void
     }

     function useFetch<T>(url: string, options: UseFetchOptions = {}) {
       const data = ref<T | null>(null)
       const loading = ref(false)
       const error = ref<Error | null>(null)

       const execute = async () => {
         loading.value = true
         error.value = null

         try {
           const response = await fetch(url)
           if (!response.ok) {
             throw new Error(\`HTTP error! status: \${response.status}\`)
           }
           const result = await response.json()
           data.value = result
           options.onSuccess?.(result)
         } catch (err) {
           const errorObj = err instanceof Error ? err : new Error('Unknown error')
           error.value = errorObj
           options.onError?.(errorObj)
         } finally {
           loading.value = false
         }
       }

       const refresh = () => execute()

       if (options.immediate !== false) {
         execute()
       }

       return {
         data: data as Ref<T | null>,
         loading,
         error,
         execute,
         refresh
       }
     }

     // useLocalStorage composable
     function useLocalStorage<T>(key: string, defaultValue: T) {
       const storedValue = localStorage.getItem(key)
       const initialValue = storedValue ? JSON.parse(storedValue) : defaultValue

       const value = ref<T>(initialValue)

       watch(value, (newValue) => {
         localStorage.setItem(key, JSON.stringify(newValue))
       }, { deep: true })

       return value
     }
     \`\`\`

6. **Performance Optimization Techniques**
   - Use shallow reactive when deep reactivity isn't needed
   - Implement proper component lazy loading
   - Optimize large list rendering with virtual scrolling
   - Example performance patterns:
     \`\`\`ts
     import { shallowRef, shallowReactive, defineAsyncComponent } from 'vue'

     // Use shallow for large objects that don't need deep reactivity
     const largeDataset = shallowRef([])
     const chartConfig = shallowReactive({
       type: 'line',
       options: { /* large config object */ }
     })

     // Async component loading
     const AsyncChart = defineAsyncComponent({
       loader: () => import('./components/Chart.vue'),
       loadingComponent: () => import('./components/LoadingSpinner.vue'),
       errorComponent: () => import('./components/ErrorMessage.vue'),
       delay: 200,
       timeout: 3000
     })

     // Virtual scrolling for large lists
     import { computed } from 'vue'

     function useVirtualList<T>(items: Ref<T[]>, itemHeight: number, containerHeight: number) {
       const scrollTop = ref(0)

       const visibleStart = computed(() => Math.floor(scrollTop.value / itemHeight))
       const visibleEnd = computed(() => {
         const end = visibleStart.value + Math.ceil(containerHeight / itemHeight)
         return Math.min(end, items.value.length)
       })

       const visibleItems = computed(() =>
         items.value.slice(visibleStart.value, visibleEnd.value)
       )

       const offsetY = computed(() => visibleStart.value * itemHeight)
       const totalHeight = computed(() => items.value.length * itemHeight)

       return {
         visibleItems,
         offsetY,
         totalHeight,
         scrollTop
       }
     }
     \`\`\`

---

## Component Architecture

7. **Props and Emits Best Practices**
   - Define clear prop interfaces with proper validation
   - Use TypeScript for prop type safety
   - Implement proper event emission patterns
   - Example prop and emit patterns:
     \`\`\`vue
     <script setup lang="ts">
     import { computed } from 'vue'

     // Props with validation and defaults
     interface Props {
       title: string
       items: Array<{ id: string; name: string; value: any }>
       maxItems?: number
       sortable?: boolean
       multiSelect?: boolean
     }

     const props = withDefaults(defineProps<Props>(), {
       maxItems: 100,
       sortable: true,
       multiSelect: false
     })

     // Typed events
     interface Emits {
       'item-select': [item: Props['items'][0]]
       'items-change': [items: Props['items']]
       'sort': [field: string, direction: 'asc' | 'desc']
     }

     const emit = defineEmits<Emits>()

     // Computed props
     const displayItems = computed(() =>
       props.items.slice(0, props.maxItems)
     )

     // Event handlers
     const handleItemClick = (item: Props['items'][0]) => {
       emit('item-select', item)
     }

     const handleSort = (field: string) => {
       const direction = sortDirection.value === 'asc' ? 'desc' : 'asc'
       emit('sort', field, direction)
     }
     </script>
     \`\`\`

8. **Provide/Inject for Dependency Injection**
   - Use provide/inject for component tree communication
   - Create typed injection keys for type safety
   - Implement proper fallback handling
   - Example dependency injection:
     \`\`\`ts
     // types/injection-keys.ts
     import type { InjectionKey, Ref } from 'vue'

     export interface UserService {
       currentUser: Ref<User | null>
       login: (credentials: LoginCredentials) => Promise<void>
       logout: () => void
       updateProfile: (updates: Partial<User>) => Promise<void>
     }

     export const userServiceKey: InjectionKey<UserService> = Symbol('userService')

     // App.vue or main provider component
     <script setup lang="ts">
     import { provide } from 'vue'
     import { userServiceKey } from '@/types/injection-keys'
     import { useUserService } from '@/composables/useUserService'

     const userService = useUserService()
     provide(userServiceKey, userService)
     </script>

     // Child component consuming the service
     <script setup lang="ts">
     import { inject } from 'vue'
     import { userServiceKey } from '@/types/injection-keys'

     const userService = inject(userServiceKey)
     if (!userService) {
       throw new Error('UserService not provided')
     }

     // Use the injected service
     const { currentUser, login, logout } = userService
     </script>
     \`\`\`

---

## State Management and Routing

9. **Pinia State Management**
   - Use Pinia for global state management
   - Implement proper store composition patterns
   - Handle async operations in stores
   - Example Pinia store:
     \`\`\`ts
     // stores/user.ts
     import { defineStore } from 'pinia'
     import { ref, computed } from 'vue'
     import type { User, LoginCredentials } from '@/types'

     export const useUserStore = defineStore('user', () => {
       // State
       const currentUser = ref<User | null>(null)
       const loading = ref(false)
       const error = ref<string | null>(null)

       // Getters
       const isAuthenticated = computed(() => !!currentUser.value)
       const isAdmin = computed(() => currentUser.value?.role === 'admin')
       const displayName = computed(() =>
         currentUser.value ? \`\${currentUser.value.firstName} \${currentUser.value.lastName}\` : 'Guest'
       )

       // Actions
       const login = async (credentials: LoginCredentials) => {
         loading.value = true
         error.value = null

         try {
           const response = await authApi.login(credentials)
           currentUser.value = response.user
           localStorage.setItem('token', response.token)
         } catch (err) {
           error.value = err instanceof Error ? err.message : 'Login failed'
           throw err
         } finally {
           loading.value = false
         }
       }

       const logout = () => {
         currentUser.value = null
         localStorage.removeItem('token')
       }

       const updateProfile = async (updates: Partial<User>) => {
         if (!currentUser.value) return

         try {
           const updated = await userApi.updateProfile(currentUser.value.id, updates)
           currentUser.value = { ...currentUser.value, ...updated }
         } catch (err) {
           error.value = err instanceof Error ? err.message : 'Update failed'
           throw err
         }
       }

       const initialize = async () => {
         const token = localStorage.getItem('token')
         if (token) {
           try {
             currentUser.value = await authApi.getCurrentUser()
           } catch {
             logout()
           }
         }
       }

       return {
         // State
         currentUser,
         loading,
         error,
         // Getters
         isAuthenticated,
         isAdmin,
         displayName,
         // Actions
         login,
         logout,
         updateProfile,
         initialize
       }
     })
     \`\`\`

10. **Vue Router 4 Integration**
    - Use the composition API with Vue Router
    - Implement proper route guards and navigation
    - Handle route parameters and query strings
    - Example router integration:
      \`\`\`ts
      // composables/useRouter.ts
      import { useRouter, useRoute, onBeforeRouteLeave } from 'vue-router'
      import { ref, watch } from 'vue'

      export function useNavigationGuard() {
        const router = useRouter()
        const route = useRoute()
        const hasUnsavedChanges = ref(false)

        // Navigation guard
        onBeforeRouteLeave((to, from) => {
          if (hasUnsavedChanges.value) {
            const answer = window.confirm(
              'You have unsaved changes. Are you sure you want to leave?'
            )
            if (!answer) return false
          }
        })

        // Programmatic navigation
        const navigateTo = (name: string, params?: Record<string, any>) => {
          router.push({ name, params })
        }

        // Query parameter handling
        const updateQuery = (updates: Record<string, any>) => {
          router.replace({
            query: { ...route.query, ...updates }
          })
        }

        return {
          route,
          router,
          hasUnsavedChanges,
          navigateTo,
          updateQuery
        }
      }

      // Component usage
      <script setup lang="ts">
      import { useNavigationGuard } from '@/composables/useRouter'

      const { route, hasUnsavedChanges, updateQuery } = useNavigationGuard()

      // Watch for route parameter changes
      watch(() => route.params.id, (newId) => {
        if (newId) {
          fetchUser(newId)
        }
      }, { immediate: true })

      // Update URL query when filters change
      watch(filters, (newFilters) => {
        updateQuery(newFilters)
      })
      </script>
      \`\`\`

---

## Testing and Development

11. **Component Testing Strategies**
    - Test composables independently from components
    - Use Vue Test Utils for component testing
    - Mock external dependencies properly
    - Example testing patterns:
      \`\`\`ts
      // tests/composables/useUser.test.ts
      import { describe, it, expect, vi } from 'vitest'
      import { useUser } from '@/composables/useUser'
      import * as api from '@/services/api'

      vi.mock('@/services/api')

      describe('useUser', () => {
        it('should fetch user data', async () => {
          const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com' }
          vi.mocked(api.getUser).mockResolvedValue(mockUser)

          const { user, loading, fetchUser } = useUser()

          expect(loading.value).toBe(false)
          expect(user.value).toBe(null)

          await fetchUser(1)

          expect(loading.value).toBe(false)
          expect(user.value).toEqual(mockUser)
        })

        it('should handle fetch errors', async () => {
          const errorMessage = 'User not found'
          vi.mocked(api.getUser).mockRejectedValue(new Error(errorMessage))

          const { error, fetchUser } = useUser()

          await fetchUser(999)

          expect(error.value).toBe(errorMessage)
        })
      })

      // tests/components/UserProfile.test.ts
      import { mount } from '@vue/test-utils'
      import { describe, it, expect } from 'vitest'
      import UserProfile from '@/components/UserProfile.vue'

      describe('UserProfile', () => {
        it('renders user information correctly', () => {
          const user = {
            id: 1,
            name: 'John Doe',
            email: 'john@example.com'
          }

          const wrapper = mount(UserProfile, {
            props: { user }
          })

          expect(wrapper.text()).toContain('John Doe')
          expect(wrapper.text()).toContain('john@example.com')
        })

        it('emits update event when form is submitted', async () => {
          const wrapper = mount(UserProfile, {
            props: { user: { id: 1, name: 'John', email: 'john@example.com' } }
          })

          await wrapper.find('form').trigger('submit')

          expect(wrapper.emitted('update')).toBeTruthy()
        })
      })
      \`\`\`

---

## Summary Checklist

- [ ] Use script setup syntax for cleaner component code
- [ ] Implement proper reactivity with ref() and reactive()
- [ ] Create reusable logic with custom composables
- [ ] Use TypeScript for type safety throughout
- [ ] Implement proper computed and watcher patterns
- [ ] Design clear prop and emit interfaces
- [ ] Use provide/inject for dependency injection
- [ ] Integrate Pinia for global state management
- [ ] Handle routing with Vue Router 4 composition API
- [ ] Optimize performance with shallow reactivity when appropriate
- [ ] Write comprehensive tests for composables and components
- [ ] Follow Vue 3 best practices and conventions

---

Follow these patterns to build scalable, maintainable, and performant Vue 3 applications using the Composition API effectively.`,
	categories: ["vue", "frontend", "javascript"],
	tags: ["composition-api", "reactivity", "vue3"],
	author: "Community",
	createdAt: "2024-01-28T00:00:00Z",
	applicationMode: "files",
	globs: "*.vue,*.ts,*.js",
};
