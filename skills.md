# Engineering Standards and Skills (YTanalytics)

This document defines the operational expertise and engineering standards for this project. As a senior Expo / React Native architect, all contributions must adhere to these guidelines to ensure a production-grade, highly performant, and beautifully designed mobile application.

## Global Engineering Principles

- **SOLID architecture**: Code must be predictable, modular, and adhere strictly to SOLID object-oriented design principles.
- **DRY (Don't Repeat Yourself)**: Avoid duplicated logic by continually extracting common functionalities into reusable utilities or hooks.
- **KISS (Keep It Simple, Stupid)**: Keep code understandable and avoid over-engineering solutions.
- **YAGNI (You Aren't Gonna Need It)**: Prevent unnecessary abstraction and implement only the features immediately required.
- **Typed, predictable code**: Strict TypeScript typing across the entire codebase. Minimal use of `any` or `ts-ignore`.
- **Small reusable UI components**: Break down complex UI screens into isolated, highly reusable pieces.
- **Separation of UI, state, and services**: UI components remain declarative. State management and data fetching workflows are abstracted into hooks and services.

---

## Core Engineering Skills

- **Advanced Expo development**: Leveraging the latest Expo SDK features, config plugins, continuous native generation, and OTA updates.
- **React Native architecture**: Understanding the new architecture (Fabric/TurboModules), React concurrent features, and performance implications of the JS/Native bridge.
- **Expo Router navigation patterns**: Mastering file-based routing, deep linking, authentication flow guards, and nested layout management.
- **Custom CSS and Tailwind styling system**: Implementing scalable, type-safe styling using NativeWind or equivalent modern styling solutions tailored for React Native.
- **Scalable mobile architecture**: Designing predictable state flows, dependency injection frameworks, and cleanly modularized feature boundaries.
- **Production mobile build pipelines**: Extensive experience with EAS Build, EAS Submit, certificate management, environment variable securely, and CI/CD workflows.
- **Performance optimization for RN apps**: Aggressive memoization, avoiding unnecessary re-renders, optimizing long lists (FlashList), and minimizing JS thread blocking.

---

## UI / Design Skills

- **iOS glass / liquid glass design systems**: Creating premium, visually stunning interfaces utilizing depth, translucency, blurs, and vibrant materials.
- **Expo Glass Effect usage**: Utilizing `expo-blur` and native visual effect views for high-performance frosted glass effects.
- **Apple Human Interface Guidelines**: Adhering strictly to Apple platform norms for hit area scaling, navigation paradigms, standard typography hierarchies, and native feeling feedback.
- **Modern mobile UX patterns**: Fluid bottom sheets, smooth skeleton loaders, contextual swipe actions, and haptic-integrated menus.
- **Dark mode friendly UI**: Designing with dynamic color tokens that predictably and seamlessly transition between light and dark themes without flashing.
- **Accessible typography and spacing systems**: Ensuring text scales appropriately with native accessibility settings and maintaining a rigid, mathematically sound grid system (4pt/8pt).

---

## Styling Stack

- **Custom CSS and Tailwind patterns for RN**: Utilizing NativeWind or custom StyleSheet architectures for utility-first styling while maintaining C++ native performance. Avoiding computationally expensive inline dynamic styles.
- **Design tokens**: Defining a single, un-mutable source of truth for colors, typography, spacing, and border radii to ensure perfect application consistency.
- **Reusable style primitives**: Architecting completely isolated foundational components (e.g., `Box`, `Text`, `Surface`, `Button`) that safely consume design tokens and compose to build complex layouts.

---

## Animation Expertise

- **Reanimated**: The foundational library for all complex, high-performance, 60-120fps animations running natively on the UI thread. Exclusively used for layout transitions and shared element transitions.
- **Expo animations**: Leveraging built-in, un-opinionated Expo APIs for standard transitions where Reanimated would be overkill.
- **Gesture-driven interactions**: Pairing `react-native-gesture-handler` directly with Reanimated Worklets for fluid swipeable items, robust draggable bottom sheets, and highly interactive touch elements.
- **Micro-interactions**: Implementing sub-300ms feedback elements (button scaling, icon morphing, smooth state transitions) specifically designed to make the app feel alive and responsive.

---

## Scalable App Structure

- `app/`: Expo Router file-based routing components and layout boundaries. Contains only routing logic and screen orchestration.
- `components/`: Global, context-agnostic, and completely reusable "dumb" UI components (buttons, inputs, cards, lists).
- `features/`: Domain-specific modules encapsulating their own bounded UI, state, and logic contexts (e.g., `features/auth`, `features/video-player`).
- `hooks/`: Custom React hooks isolating shared client-side logic, UI state toggles, and reactive side-effects.
- `services/`: Low-level API clients, database queries, third-party native integrations, and isolated networking side-effects.
- `utils/`: Pure JavaScript/TypeScript helper functions, global constants, regex, and formatters mapping inputs to predictable outputs.
- `assets/`: Static pre-compiled files such as application images, static fonts, and Lottie JSONs.

---

## MCP Server Integration

This project actively leverages the **Stitch MCP server** for accelerated, modern design workflows:
- **Design tokens**: Syncing and generating consistent color palettes, semantic themes, and typography scales orchestrated directly from Stitch integrations.
- **Scalable UI primitives**: Rapidly generating beautifully formatted foundational UI components leveraging Stitch capabilities.
- **Component generation**: Using Stitch to scaffold complex, beautifully styled, responsive UI components based on text prompts and precise design requirements without writing boilerplate.
- **Cross-platform styling**: Ensuring that Stitch-generated stylistic components are perfectly responsive and optimized simultaneously for both iOS and Android rendering engines.

---

## Code Quality Rules

- **Component size limits**: React component files should rigidly not exceed 150-200 lines. Extract sub-components, helper functions, and styling cleanly out of the main file.
- **Naming conventions**:
  - `PascalCase` for React components and interface/type definitions.
  - `camelCase` for variables, instance functions, hooks, and simple object properties.
  - `UPPER_SNAKE_CASE` for strictly immutable global constants.
- **Error handling**: Implement comprehensive try-catch wrappers around asynchronous workflows, implement localized React error boundaries to prevent app crashes, and deliver user-friendly, localized error messages.
- **Async handling**: Definitively utilize `async/await`. Avoid chaining raw promises. Proactively map `.catch` states or wrap inside robust query handlers. Always handle and display `loading`, `error`, and `success` states predictably on the UI layer.
- **API interaction**: Centralize API endpoints securely within `services/`. Define extremely strict `Request` and `Response` validation interfaces using TypeScript schemas. Exclusively use enterprise-grade tools like TanStack Query for intelligent caching, background refetching, and remote state hydration.
- **Logging**: Avoid all rogue `console.log` statements. Structure logging through a centralized Logger utility. Ensure all sensitive information is stripped and completely disable or minimize diagnostic logging in tightly optimized production environments.
