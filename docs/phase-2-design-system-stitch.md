# Phase 2: Design System via Stitch MCP

## Task 5: Generate Design Tokens for YTanalytics

To maintain a highly consistent "iOS Liquid Glass" aesthetic, we define the following semantic design tokens. These tokens should be fed to Stitch MCP when generating screens to keep components uniform.

**Colors**
- `surfaceBg`: Deep black/dark gray for dark mode (`#000000`), Light gray for light mode (`#F2F2F7`).
- `surfaceGlassPrimary`: Base color for heavy glass (e.g., `#1C1C1E` at 75% opacity).
- `surfaceGlassSecondary`: Base color for lighter glass cards (`#2C2C2E` at 65% opacity).
- `accentPrimary`: Vibrant YouTube Red (`#FF0000`) or a modern accessible red (`#FF3B30`).
- `accentSecondary`: Soft blue/indigo for interactive elements (`#0A84FF`).
- `textPrimary`: White (`#FFFFFF`) / Black (`#000000`).
- `textMuted`: Subtle gray (`#8E8E93`).
- `borderSubtle`: Almost transparent white/gray for glass edges (`rgba(255, 255, 255, 0.15)`).
- `success`, `warning`, `error`: Standard iOS semantic colors (`#34C759`, `#FF9500`, `#FF3B30`).

**Typography Scale (iOS HIG)**
- `H1`: 34px, Bold (700)
- `H2`: 28px, Semibold (600)
- `H3`: 22px, Semibold (600)
- `H4`: 20px, Semibold (600)
- `subtitle`: 17px, Medium (500)
- `body`: 17px, Regular (400)
- `caption`: 13px, Regular (400)

**Spacing & Layout**
- Based on a 4pt/8pt grid system.
- Spacing steps: 4, 8, 12, 16, 24, 32, 48, 64px.

**Radii**
- `xs`: 4px
- `sm`: 8px
- `md`: 12px
- `lg`: 16px
- `xl`: 24px
- `pill`: 9999px

---

## Task 6: Liquid Glass Surface Taxonomy

To standardize liquid glass appearances via Expo `BlurView` or similar APIs:

1. **PrimaryGlass**
   - **Usage**: Persistent main navigation (Bottom Tab Bar, Top Screen Headers).
   - **Properties**: High blur radius (e.g., 20px), `dark` or `systemThickMaterialDark` tint, high background opacity. Maximum unreadability of background content.

2. **SecondaryGlass**
   - **Usage**: Prominent content cards (e.g., Video detail overlays, Stat panels).
   - **Properties**: Medium blur radius (12-15px), `regular` tint. Designed to sit comfortably on top of video thumbnails while maintaining text readability.

3. **TertiaryGlass**
   - **Usage**: Small, transient UI elements (Chips, floating action buttons, stat pills).
   - **Properties**: Low blur radius (8-10px), `prominent` or `light` tint. Adds subtle elevation to small elements without overwhelming performance.

---

## Task 7: Token Export Format

Tokens should be formatted in a JSON-like structure that seamlessly plugs into the project's Tailwind/NativeWind config and a TypeScript constants file.

```json
{
  "theme": {
    "colors": {
      "surface-bg": "#000000",
      "glass-primary": "rgba(28,28,30,0.75)",
      "glass-secondary": "rgba(44,44,46,0.65)",
      "accent-primary": "#FF3B30",
      "text-primary": "#FFFFFF",
      "text-muted": "#8E8E93",
      "border-subtle": "rgba(255,255,255,0.15)"
    },
    "fontSize": {
      "xs": ["13px", "18px"],
      "sm": ["15px", "20px"],
      "base": ["17px", "22px"],
      "lg": ["20px", "25px"],
      "xl": ["22px", "28px"],
      "2xl": ["28px", "34px"],
      "3xl": ["34px", "41px"]
    },
    "spacing": {
      "1": "4px",
      "2": "8px",
      "3": "12px",
      "4": "16px",
      "6": "24px",
      "8": "32px",
      "12": "48px"
    },
    "borderRadius": {
      "sm": "8px",
      "md": "12px",
      "lg": "16px",
      "xl": "24px",
      "pill": "9999px"
    },
    "glassEffect": {
      "primary": { "intensity": 100, "tint": "dark" },
      "secondary": { "intensity": 80, "tint": "dark" },
      "tertiary": { "intensity": 50, "tint": "default" }
    }
  }
}
```
*Note: The `glassEffect` node is not standard Tailwind; it's read by custom React components wrapping `Expo.BlurView`.*
