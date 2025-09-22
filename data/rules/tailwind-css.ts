import { Rule } from "../types";

export const rule: Rule = {
	id: "tailwind-css",
	slug: "tailwind-css",
	title: "Tailwind CSS Best Practices",
	description: "Expert in Tailwind CSS, responsive design, and utility-first CSS architecture",
	content: `# Tailwind CSS Best Practices

Complete guide for building responsive, accessible, and maintainable user interfaces with Tailwind CSS utility-first framework.

---

## Core Principles

1. **Utility-First Methodology**
   - Use utility classes exclusively for styling instead of custom CSS
   - Compose complex designs from small, reusable utility classes
   - Avoid premature abstraction into component classes
   - Example:
     \`\`\`html
     <div class="bg-white shadow-lg rounded-lg p-6 max-w-sm mx-auto">
       <h2 class="text-xl font-bold text-gray-900 mb-2">Card Title</h2>
       <p class="text-gray-600 text-base">Card description content.</p>
     </div>
     \`\`\`

2. **Mobile-First Responsive Design**
   - Start with mobile layout (no prefix), then enhance for larger screens
   - Use responsive prefixes: \`sm:\`, \`md:\`, \`lg:\`, \`xl:\`, \`2xl:\`
   - Design for the smallest screen first, then progressively enhance
   - Example:
     \`\`\`html
     <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
       <!-- Content adapts from 1 column on mobile to 3 on large screens -->
     </div>
     \`\`\`

3. **Design System Consistency**
   - Use Tailwind's built-in spacing scale (0, 1, 2, 4, 8, 12, 16, etc.)
   - Leverage the color palette for consistent theming
   - Follow typography scale for harmonious text sizing
   - Stick to the design tokens to maintain visual consistency

---

## Spacing and Layout

4. **Spacing Scale Mastery**
   - Use consistent spacing units: \`space-y-4\`, \`p-6\`, \`m-8\`, \`gap-3\`
   - Understand the scale: \`1 = 0.25rem\`, \`4 = 1rem\`, \`8 = 2rem\`
   - Use logical properties: \`ps-4\` (padding-inline-start), \`ms-2\` (margin-inline-start)
   - Example spacing patterns:
     \`\`\`html
     <!-- Card with consistent spacing -->
     <div class="p-6 space-y-4">
       <h2 class="text-lg font-semibold">Title</h2>
       <p class="text-gray-600">Content with consistent vertical spacing</p>
       <button class="px-4 py-2 bg-blue-500 text-white rounded">Action</button>
     </div>
     \`\`\`

5. **Layout Patterns**
   - Use Flexbox utilities for one-dimensional layouts
   - Use Grid utilities for two-dimensional layouts
   - Implement common patterns: navbar, sidebar, card grids
   - Example layout structures:
     \`\`\`html
     <!-- Centered layout with max width -->
     <div class="min-h-screen bg-gray-50">
       <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
         <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
           <!-- Content -->
         </div>
       </div>
     </div>
     \`\`\`

6. **Container and Breakpoint Strategy**
   - Use \`container\` class for responsive max-widths
   - Implement proper padding: \`container mx-auto px-4\`
   - Understand breakpoint values: sm (640px), md (768px), lg (1024px), xl (1280px)

---

## Typography and Colors

7. **Typography Hierarchy**
   - Establish clear heading hierarchy with size and weight
   - Use appropriate line heights for readability
   - Implement responsive typography for different screen sizes
   - Example typography system:
     \`\`\`html
     <h1 class="text-4xl lg:text-6xl font-bold text-gray-900 leading-tight">
       Main Heading
     </h1>
     <h2 class="text-2xl lg:text-3xl font-semibold text-gray-800 mt-8 mb-4">
       Section Heading
     </h2>
     <p class="text-base lg:text-lg text-gray-600 leading-relaxed">
       Body text with proper line height for readability.
     </p>
     \`\`\`

8. **Color System and Theming**
   - Use semantic color naming: primary, secondary, accent, neutral
   - Implement consistent color usage across components
   - Leverage color opacity utilities: \`bg-blue-500/75\`
   - Example color patterns:
     \`\`\`html
     <!-- Primary action button -->
     <button class="bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2 rounded-lg transition-colors">
       Primary Action
     </button>

     <!-- Secondary button -->
     <button class="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-6 py-2 rounded-lg transition-colors">
       Secondary Action
     </button>
     \`\`\`

9. **Dark Mode Implementation**
   - Use \`dark:\` variant for dark mode styles
   - Plan color schemes for both light and dark themes
   - Test contrast ratios for accessibility
   - Example dark mode patterns:
     \`\`\`html
     <div class="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
       <h2 class="text-gray-800 dark:text-gray-200">Heading</h2>
       <p class="text-gray-600 dark:text-gray-400">Description text</p>
     </div>
     \`\`\`

---

## Component Patterns

10. **Button Components**
    - Create consistent button styles with variants
    - Include hover, focus, and disabled states
    - Implement proper accessibility attributes
    - Example button patterns:
      \`\`\`html
      <!-- Primary Button -->
      <button class="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
        <svg class="w-4 h-4 mr-2" fill="currentColor">...</svg>
        Button Text
      </button>
      \`\`\`

11. **Form Elements**
    - Style inputs, selects, and textareas consistently
    - Include focus states and validation styling
    - Implement proper spacing and alignment
    - Example form patterns:
      \`\`\`html
      <div class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Enter your email"
          />
        </div>
      </div>
      \`\`\`

12. **Card Components**
    - Design flexible card layouts for different content types
    - Include proper shadows, borders, and spacing
    - Make cards responsive and accessible
    - Example card patterns:
      \`\`\`html
      <div class="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
        <img src="image.jpg" alt="Card image" class="w-full h-48 object-cover" />
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-2">Card Title</h3>
          <p class="text-gray-600 mb-4">Card description content.</p>
          <button class="text-blue-600 hover:text-blue-700 font-medium">
            Read More →
          </button>
        </div>
      </div>
      \`\`\`

---

## Advanced Techniques

13. **Custom Property Integration**
    - Use CSS custom properties with Tailwind utilities
    - Create dynamic themes with CSS variables
    - Implement component-specific styling
    - Example custom property usage:
      \`\`\`css
      .theme-card {
        --card-bg: theme('colors.white');
        --card-shadow: theme('boxShadow.lg');
        background-color: var(--card-bg);
        box-shadow: var(--card-shadow);
      }
      \`\`\`

14. **Animation and Transitions**
    - Use transition utilities for smooth interactions
    - Implement hover and focus effects consistently
    - Create engaging micro-interactions
    - Example animation patterns:
      \`\`\`html
      <div class="transform hover:scale-105 transition-transform duration-300">
        <div class="group relative overflow-hidden rounded-lg">
          <img class="group-hover:scale-110 transition-transform duration-500" />
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300">
          </div>
        </div>
      </div>
      \`\`\`

15. **State Variants**
    - Use state variants: \`hover:\`, \`focus:\`, \`active:\`, \`disabled:\`
    - Implement group and peer variants for parent-child interactions
    - Create interactive components with proper feedback
    - Example state management:
      \`\`\`html
      <div class="group">
        <button class="peer bg-blue-500 text-white px-4 py-2 rounded">
          Toggle
        </button>
        <div class="hidden peer-checked:block mt-2 p-4 bg-gray-100 rounded">
          Content shown when button is active
        </div>
      </div>
      \`\`\`

---

## Performance Optimization

16. **Production Build Optimization**
    - Configure PurgeCSS to remove unused styles
    - Use JIT mode for optimal bundle size
    - Monitor CSS bundle size in production
    - Example Tailwind config:
      \`\`\`js
      module.exports = {
        content: ['./src/**/*.{html,js,jsx,ts,tsx}'],
        theme: {
          extend: {}
        },
        plugins: []
      }
      \`\`\`

17. **Component Extraction Strategy**
    - Extract repeating patterns into components (React, Vue, etc.)
    - Use \`@apply\` sparingly for truly reusable component classes
    - Keep utility-first approach even within components
    - Example component extraction:
      \`\`\`jsx
      // Button component with consistent Tailwind classes
      function Button({ variant = 'primary', children, ...props }) {
        const baseClasses = 'px-4 py-2 font-medium rounded-lg transition-colors duration-200';
        const variantClasses = {
          primary: 'bg-blue-600 hover:bg-blue-700 text-white',
          secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800'
        };

        return (
          <button className={\`\${baseClasses} \${variantClasses[variant]}\`} {...props}>
            {children}
          </button>
        );
      }
      \`\`\`

---

## Accessibility and Best Practices

18. **Accessibility Considerations**
    - Ensure sufficient color contrast ratios
    - Use semantic HTML with proper ARIA attributes
    - Implement keyboard navigation support
    - Test with screen readers and assistive technologies
    - Example accessible patterns:
      \`\`\`html
      <button
        class="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded"
        aria-label="Skip to main content"
      >
        Skip to main content
      </button>
      \`\`\`

19. **Code Organization**
    - Group related utilities logically in HTML
    - Use consistent ordering: layout, spacing, typography, colors, effects
    - Comment complex utility combinations
    - Example organized classes:
      \`\`\`html
      <div class="
        /* Layout */
        flex items-center justify-between
        /* Spacing */
        p-6 mb-4
        /* Typography */
        text-lg font-semibold
        /* Colors */
        bg-white text-gray-900
        /* Effects */
        rounded-lg shadow-md hover:shadow-lg
        transition-shadow duration-300
      ">
      \`\`\`

20. **Maintenance and Scaling**
    - Document component patterns and design decisions
    - Create style guides for consistent implementation
    - Regular audit of unused utilities and patterns
    - Establish naming conventions for custom utilities

---

## Advanced Patterns

21. **Grid and Layout Systems**
    - Master CSS Grid utilities for complex layouts
    - Implement responsive grid patterns
    - Use subgrid when browser support allows
    - Example advanced grid:
      \`\`\`html
      <div class="grid grid-cols-12 gap-6">
        <aside class="col-span-12 md:col-span-3 lg:col-span-2">
          Sidebar
        </aside>
        <main class="col-span-12 md:col-span-9 lg:col-span-8">
          Main content
        </main>
        <div class="col-span-12 lg:col-span-2">
          Secondary content
        </div>
      </div>
      \`\`\`

22. **Custom Plugin Development**
    - Create custom plugins for project-specific utilities
    - Extend Tailwind's functionality when needed
    - Maintain consistency with Tailwind's naming conventions
    - Example custom plugin:
      \`\`\`js
      const plugin = require('tailwindcss/plugin');

      module.exports = {
        plugins: [
          plugin(function({ addUtilities }) {
            addUtilities({
              '.scrollbar-hide': {
                '-ms-overflow-style': 'none',
                'scrollbar-width': 'none',
                '&::-webkit-scrollbar': {
                  display: 'none'
                }
              }
            });
          })
        ]
      };
      \`\`\`

---

## Summary Checklist

- [ ] Use utility-first approach consistently
- [ ] Implement mobile-first responsive design
- [ ] Maintain consistent spacing and typography scales
- [ ] Create accessible and semantic HTML structures
- [ ] Optimize for production with proper purging
- [ ] Extract common patterns into reusable components
- [ ] Test across different devices and screen sizes
- [ ] Ensure proper color contrast and accessibility
- [ ] Document component patterns and style guides
- [ ] Monitor CSS bundle size and performance
- [ ] Use state variants for interactive elements
- [ ] Implement dark mode support when needed

---

Follow these practices to build beautiful, responsive, and maintainable user interfaces with Tailwind CSS.`,
	categories: ["css", "design", "frontend"],
	tags: ["tailwind", "responsive", "utility-first"],
	author: "Community",
	createdAt: "2024-01-20T00:00:00Z",
	applicationMode: "intelligent",
	globs: "*.css,*.scss,*.tsx,*.jsx",
};
