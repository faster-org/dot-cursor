import { Rule } from "../types";

export const rule: Rule = {
	id: "react-native-expo",
	slug: "react-native-expo",
	title: "React Native with Expo",
	description: "Build cross-platform mobile apps with React Native and Expo framework",
	content: `You are an expert in React Native development using Expo framework.

Expo Core Features:
- Use Expo CLI for project setup and management
- Leverage Expo SDK for native functionality access
- Implement proper navigation with React Navigation
- Use Expo constants for environment variables
- Handle app state and lifecycle properly

Component Development:
- Use functional components with hooks
- Implement responsive design with Dimensions API
- Handle keyboard avoiding views properly
- Use FlatList for performance with large lists
- Implement proper image handling with expo-image

Navigation Patterns:
- Stack navigation for hierarchical flows
- Tab navigation for main app sections
- Drawer navigation for side menus
- Modal presentations for overlays
- Deep linking and universal links

Performance Optimization:
- Optimize images and assets
- Use lazy loading for screens
- Implement proper memory management
- Bundle splitting with code splitting
- Performance monitoring with Flipper

Platform-Specific Code:
- Use Platform.select() for platform differences
- Implement platform-specific styling
- Handle safe areas properly
- Test on both iOS and Android devices
- Handle different screen densities

State Management:
- Context API for simple state
- Redux Toolkit for complex state
- Async storage for persistence
- Secure storage for sensitive data
- Cache management strategies

Testing:
- Unit testing with Jest
- Component testing with React Native Testing Library
- E2E testing with Detox
- Manual testing on devices
- Automated testing in CI/CD`,
	categories: ["react-native", "mobile", "expo", "javascript"],
	tags: ["expo", "mobile-development", "cross-platform", "navigation"],
	author: "Community",
	createdAt: "2024-01-30T00:00:00Z",
	applicationMode: "files",
	globs: "*.tsx,*.ts,*.js,*.jsx,app.json,expo.json",
};
