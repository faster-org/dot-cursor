import { Rule } from "../types";

export const rule: Rule = {
	id: "vue-composition-api",
	slug: "vue-composition-api",
	title: "Vue 3 Composition API Best Practices",
	tags: ["vue", "javascript", "typescript", "composition-api", "frontend"],
	languages: ["vue", "javascript", "typescript"],
	description: "Master Vue 3 Composition API for building reactive and maintainable components",
	
	categories: ["frontend", "javascript"],content: `# Vue 3 Composition API Best Practices

## 1. Setup Function and Script Setup

### Basic Composition API Setup
\`\`\`vue
<template>
  <div>
    <h1>{{ title }}</h1>
    <button @click="increment">Count: {{ count }}</button>
    <input v-model="searchTerm" placeholder="Search..." />
  </div>
</template>

<script>
import { ref, computed, watch, onMounted } from 'vue'

export default {
  name: 'MyComponent',
  setup() {
    // Reactive state
    const count = ref(0)
    const searchTerm = ref('')

    // Computed properties
    const title = computed(() => \`Current count: \${count.value}\`)

    // Methods
    const increment = () => {
      count.value++
    }

    // Watchers
    watch(searchTerm, (newTerm) => {
      console.log('Search term changed:', newTerm)
    })

    // Lifecycle hooks
    onMounted(() => {
      console.log('Component mounted')
    })

    // Return everything that template needs
    return {
      count,
      searchTerm,
      title,
      increment
    }
  }
}
</script>
\`\`\`

### Script Setup Syntax (Recommended)
\`\`\`vue
<template>
  <div>
    <h1>{{ title }}</h1>
    <button @click="increment">Count: {{ count }}</button>
    <input v-model="searchTerm" placeholder="Search..." />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

// Reactive state - automatically exposed to template
const count = ref(0)
const searchTerm = ref('')

// Computed properties
const title = computed(() => \`Current count: \${count.value}\`)

// Methods
const increment = () => {
  count.value++
}

// Watchers
watch(searchTerm, (newTerm) => {
  console.log('Search term changed:', newTerm)
})

// Lifecycle hooks
onMounted(() => {
  console.log('Component mounted')
})
</script>
\`\`\`

## 2. Reactive State Management

### Ref vs Reactive
\`\`\`vue
<script setup>
import { ref, reactive, toRefs } from 'vue'

// Use ref for primitive values
const count = ref(0)
const isLoading = ref(false)
const message = ref('Hello')

// Use reactive for objects
const user = reactive({
  id: 1,
  name: 'John Doe',
  email: 'john@example.com',
  preferences: {
    theme: 'dark',
    notifications: true
  }
})

// Convert reactive object to refs for destructuring
const { name, email } = toRefs(user)

// Accessing values
console.log(count.value) // Need .value for ref
console.log(user.name)   // Direct access for reactive

// Updating values
count.value++
user.name = 'Jane Doe'
</script>
\`\`\`

### Reactive Arrays and Objects
\`\`\`vue
<script setup>
import { ref, reactive, computed } from 'vue'

// Reactive array
const todos = ref([
  { id: 1, text: 'Learn Vue 3', completed: false },
  { id: 2, text: 'Build an app', completed: false }
])

// Reactive form object
const form = reactive({
  title: '',
  description: '',
  priority: 'medium',
  tags: []
})

// Computed based on reactive state
const completedTodos = computed(() =>
  todos.value.filter(todo => todo.completed)
)

const incompleteTodos = computed(() =>
  todos.value.filter(todo => !todo.completed)
)

// Methods to manipulate state
const addTodo = (text) => {
  todos.value.push({
    id: Date.now(),
    text,
    completed: false
  })
}

const toggleTodo = (id) => {
  const todo = todos.value.find(t => t.id === id)
  if (todo) {
    todo.completed = !todo.completed
  }
}

const removeTodo = (id) => {
  const index = todos.value.findIndex(t => t.id === id)
  if (index > -1) {
    todos.value.splice(index, 1)
  }
}
</script>
\`\`\`

## 3. Composables for Logic Reuse

### Creating Custom Composables
\`\`\`javascript
// composables/useCounter.js
import { ref, computed } from 'vue'

export function useCounter(initialValue = 0) {
  const count = ref(initialValue)

  const increment = () => count.value++
  const decrement = () => count.value--
  const reset = () => count.value = initialValue

  const isEven = computed(() => count.value % 2 === 0)
  const isPositive = computed(() => count.value > 0)

  return {
    count,
    increment,
    decrement,
    reset,
    isEven,
    isPositive
  }
}
\`\`\`

### Fetch Data Composable
\`\`\`javascript
// composables/useFetch.js
import { ref, watchEffect } from 'vue'

export function useFetch(url) {
  const data = ref(null)
  const error = ref(null)
  const isLoading = ref(false)

  const fetchData = async () => {
    isLoading.value = true
    error.value = null

    try {
      const response = await fetch(url.value || url)
      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`)
      }
      data.value = await response.json()
    } catch (err) {
      error.value = err.message
    } finally {
      isLoading.value = false
    }
  }

  // Watch for URL changes
  watchEffect(() => {
    if (url.value || url) {
      fetchData()
    }
  })

  const refetch = () => fetchData()

  return {
    data,
    error,
    isLoading,
    refetch
  }
}
\`\`\`

### Local Storage Composable
\`\`\`javascript
// composables/useLocalStorage.js
import { ref, watch } from 'vue'

export function useLocalStorage(key, defaultValue) {
  const storedValue = localStorage.getItem(key)
  const initialValue = storedValue ? JSON.parse(storedValue) : defaultValue

  const value = ref(initialValue)

  // Watch for changes and sync to localStorage
  watch(
    value,
    (newValue) => {
      localStorage.setItem(key, JSON.stringify(newValue))
    },
    { deep: true }
  )

  return value
}
\`\`\`

### Using Composables in Components
\`\`\`vue
<template>
  <div>
    <div>
      <h2>Counter: {{ count }}</h2>
      <p>Is Even: {{ isEven }}</p>
      <button @click="increment">+</button>
      <button @click="decrement">-</button>
      <button @click="reset">Reset</button>
    </div>

    <div>
      <h2>User Data</h2>
      <div v-if="isLoading">Loading...</div>
      <div v-else-if="error">Error: {{ error }}</div>
      <div v-else-if="data">
        <p>Name: {{ data.name }}</p>
        <p>Email: {{ data.email }}</p>
      </div>
      <button @click="refetch">Refresh</button>
    </div>

    <div>
      <h2>Settings</h2>
      <label>
        <input v-model="theme" type="radio" value="light"> Light
      </label>
      <label>
        <input v-model="theme" type="radio" value="dark"> Dark
      </label>
      <p>Current theme: {{ theme }}</p>
    </div>
  </div>
</template>

<script setup>
import { useCounter } from '@/composables/useCounter'
import { useFetch } from '@/composables/useFetch'
import { useLocalStorage } from '@/composables/useLocalStorage'

// Use composables
const { count, increment, decrement, reset, isEven } = useCounter(0)
const { data, error, isLoading, refetch } = useFetch('https://jsonplaceholder.typicode.com/users/1')
const theme = useLocalStorage('theme', 'light')
</script>
\`\`\`

## 4. Advanced Reactive Patterns

### Watch and WatchEffect
\`\`\`vue
<script setup>
import { ref, watch, watchEffect, computed } from 'vue'

const searchTerm = ref('')
const sortBy = ref('name')
const users = ref([])

// Simple watcher
watch(searchTerm, (newTerm, oldTerm) => {
  console.log(\`Search changed from "\${oldTerm}" to "\${newTerm}"\`)
})

// Deep watcher for objects
const filters = ref({
  category: '',
  minPrice: 0,
  maxPrice: 1000
})

watch(
  filters,
  (newFilters) => {
    console.log('Filters changed:', newFilters)
    // Refetch data with new filters
  },
  { deep: true }
)

// Watch multiple sources
watch(
  [searchTerm, sortBy],
  ([newTerm, newSort], [oldTerm, oldSort]) => {
    console.log('Search or sort changed')
    // Refetch and sort data
  }
)

// WatchEffect for automatic dependency tracking
watchEffect(() => {
  // This will run whenever searchTerm or sortBy changes
  console.log(\`Searching for "\${searchTerm.value}" sorted by \${sortBy.value}\`)
  // Automatically tracks dependencies
})

// Computed with complex logic
const filteredUsers = computed(() => {
  return users.value
    .filter(user =>
      user.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy.value === 'name') {
        return a.name.localeCompare(b.name)
      }
      if (sortBy.value === 'age') {
        return a.age - b.age
      }
      return 0
    })
})
</script>
\`\`\`

### Provide/Inject for State Management
\`\`\`vue
<!-- Parent Component -->
<template>
  <div>
    <ThemeToggle />
    <UserProfile />
    <ProductList />
  </div>
</template>

<script setup>
import { provide, reactive } from 'vue'
import ThemeToggle from './ThemeToggle.vue'
import UserProfile from './UserProfile.vue'
import ProductList from './ProductList.vue'

// Global app state
const appState = reactive({
  theme: 'light',
  user: {
    id: 1,
    name: 'John Doe',
    preferences: {}
  },
  notifications: []
})

// Methods to update state
const updateTheme = (theme) => {
  appState.theme = theme
}

const addNotification = (message, type = 'info') => {
  appState.notifications.push({
    id: Date.now(),
    message,
    type,
    timestamp: new Date()
  })
}

// Provide state and methods to children
provide('appState', appState)
provide('updateTheme', updateTheme)
provide('addNotification', addNotification)
</script>
\`\`\`

\`\`\`vue
<!-- Child Component -->
<template>
  <div :class="themeClass">
    <button @click="toggleTheme">
      Switch to {{ appState.theme === 'light' ? 'dark' : 'light' }} theme
    </button>
  </div>
</template>

<script setup>
import { inject, computed } from 'vue'

// Inject provided state and methods
const appState = inject('appState')
const updateTheme = inject('updateTheme')
const addNotification = inject('addNotification')

const themeClass = computed(() => \`theme-\${appState.theme}\`)

const toggleTheme = () => {
  const newTheme = appState.theme === 'light' ? 'dark' : 'light'
  updateTheme(newTheme)
  addNotification(\`Switched to \${newTheme} theme\`, 'success')
}
</script>
\`\`\`

## 5. TypeScript Integration

### Typed Composables
\`\`\`typescript
// composables/useApi.ts
import { ref, computed, type Ref } from 'vue'

interface User {
  id: number
  name: string
  email: string
  avatar?: string
}

interface ApiResponse<T> {
  data: T
  message: string
  success: boolean
}

export function useApi<T>(endpoint: string) {
  const data = ref<T | null>(null)
  const error = ref<string | null>(null)
  const isLoading = ref(false)

  const fetchData = async (): Promise<void> => {
    isLoading.value = true
    error.value = null

    try {
      const response = await fetch(endpoint)
      if (!response.ok) {
        throw new Error(\`HTTP error! status: \${response.status}\`)
      }

      const result: ApiResponse<T> = await response.json()
      data.value = result.data
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Unknown error'
    } finally {
      isLoading.value = false
    }
  }

  const hasData = computed(() => data.value !== null)
  const hasError = computed(() => error.value !== null)

  return {
    data: data as Ref<T | null>,
    error,
    isLoading,
    hasData,
    hasError,
    fetchData,
    refetch: fetchData
  }
}
\`\`\`

### Typed Component Props
\`\`\`vue
<template>
  <div class="user-card">
    <img :src="user.avatar" :alt="user.name" />
    <h3>{{ user.name }}</h3>
    <p>{{ user.email }}</p>
    <button @click="handleEdit" :disabled="!editable">
      Edit User
    </button>
  </div>
</template>

<script setup lang="ts">
interface User {
  id: number
  name: string
  email: string
  avatar?: string
}

interface Props {
  user: User
  editable?: boolean
  size?: 'small' | 'medium' | 'large'
}

interface Emits {
  edit: [user: User]
  delete: [userId: number]
}

// Define props with defaults
const props = withDefaults(defineProps<Props>(), {
  editable: true,
  size: 'medium'
})

// Define emits
const emit = defineEmits<Emits>()

// Type-safe methods
const handleEdit = () => {
  emit('edit', props.user)
}

const handleDelete = () => {
  emit('delete', props.user.id)
}
</script>
\`\`\`

## 6. Performance Optimization

### Reactive Performance Tips
\`\`\`vue
<script setup>
import { ref, reactive, shallowRef, shallowReactive, readonly } from 'vue'

// Use shallowRef for large objects that don't need deep reactivity
const largeDataSet = shallowRef({
  items: new Array(10000).fill(null).map((_, i) => ({ id: i, data: \`Item \${i}\` }))
})

// Use shallowReactive for objects with deep nesting you don't need to watch
const config = shallowReactive({
  api: {
    baseUrl: 'https://api.example.com',
    timeout: 5000,
    retries: 3
  },
  features: {
    analytics: true,
    notifications: false
  }
})

// Use readonly for state that shouldn't be modified
const appConstants = readonly({
  MAX_FILE_SIZE: 10 * 1024 * 1024, // 10MB
  SUPPORTED_FORMATS: ['.jpg', '.png', '.gif'],
  API_VERSION: 'v1'
})

// Avoid creating reactive objects in computed
const processedData = computed(() => {
  // ❌ Don't do this - creates new reactive object on every computation
  // return reactive({ processed: largeDataSet.value.items.slice(0, 100) })

  // ✅ Do this - return plain object
  return { processed: largeDataSet.value.items.slice(0, 100) }
})
</script>
\`\`\`

### Optimized List Rendering
\`\`\`vue
<template>
  <div>
    <!-- Use key for efficient updates -->
    <div
      v-for="item in visibleItems"
      :key="item.id"
      class="item"
    >
      <ItemComponent :item="item" />
    </div>

    <!-- Virtual scrolling for large lists -->
    <VirtualList
      :items="allItems"
      :item-height="60"
      :visible-items="10"
    >
      <template #item="{ item }">
        <ItemComponent :item="item" />
      </template>
    </VirtualList>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import ItemComponent from './ItemComponent.vue'
import VirtualList from './VirtualList.vue'

const allItems = ref([]) // Large array
const currentPage = ref(1)
const itemsPerPage = ref(20)

// Paginate instead of showing all items
const visibleItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return allItems.value.slice(start, end)
})
</script>
\`\`\`

## 7. Testing Composition API

### Unit Testing Composables
\`\`\`javascript
// __tests__/useCounter.test.js
import { describe, it, expect } from 'vitest'
import { useCounter } from '@/composables/useCounter'

describe('useCounter', () => {
  it('should initialize with default value', () => {
    const { count } = useCounter()
    expect(count.value).toBe(0)
  })

  it('should initialize with custom value', () => {
    const { count } = useCounter(5)
    expect(count.value).toBe(5)
  })

  it('should increment count', () => {
    const { count, increment } = useCounter(0)
    increment()
    expect(count.value).toBe(1)
  })

  it('should compute isEven correctly', () => {
    const { count, increment, isEven } = useCounter(0)
    expect(isEven.value).toBe(true)

    increment()
    expect(isEven.value).toBe(false)
  })
})
\`\`\`

### Testing Components with Composition API
\`\`\`javascript
// __tests__/UserProfile.test.js
import { mount } from '@vue/test-utils'
import { describe, it, expect, vi } from 'vitest'
import UserProfile from '@/components/UserProfile.vue'

describe('UserProfile', () => {
  it('should render user information', () => {
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

  it('should emit edit event when button clicked', async () => {
    const user = { id: 1, name: 'John', email: 'john@example.com' }

    const wrapper = mount(UserProfile, {
      props: { user, editable: true }
    })

    await wrapper.find('button').trigger('click')

    expect(wrapper.emitted('edit')).toBeTruthy()
    expect(wrapper.emitted('edit')[0]).toEqual([user])
  })
})
\`\`\`

## Checklist for Vue 3 Composition API

- [ ] Use script setup syntax for cleaner code
- [ ] Choose ref vs reactive appropriately
- [ ] Create reusable composables for common logic
- [ ] Implement proper TypeScript types
- [ ] Use provide/inject for cross-component state
- [ ] Optimize performance with shallow reactivity when needed
- [ ] Write comprehensive tests for composables
- [ ] Follow naming conventions (use* prefix for composables)
- [ ] Handle cleanup in composables (onUnmounted)
- [ ] Document complex composables with JSDoc
- [ ] Use computed properties for derived state
- [ ] Implement proper error handling in async composables`,	applicationMode: "intelligent",

}