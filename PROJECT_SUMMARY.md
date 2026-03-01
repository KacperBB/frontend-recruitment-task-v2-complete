# ConfigureFlow - Complete Project Summary

## 📋 Project Overview

**ConfigureFlow** is a B2B SaaS product configuration widget designed for e-commerce platforms. It's an embeddable React component that allows customers to customize products with various options and see real-time price updates. The widget is used by enterprise customers like TechStyle, CustomPrint Co, FurnishNow, and GiftBox Pro.

### Key Use Cases
- Customers configure products by selecting options (size, color, material)
- Real-time price calculations with quantity-based discounts
- Save configurations as drafts for later editing
- Share configurations via URL encoding
- Validate configurations for conflicts and dependencies

---

## 🏗️ Project Architecture

### Technology Stack
- **Framework:** React 19.2.0 with TypeScript
- **Build Tool:** Vite
- **Styling:** CSS with CSS variables
- **State Management:** React hooks (useState, useEffect, useCallback, useRef, useMemo)
- **Development:** Node.js 18+ with pnpm

### Project Structure
```
src/
├── components/ProductConfigurator/
│   ├── ProductConfigurator.tsx      # Main component (~1000 lines)
│   ├── types.ts                     # TypeScript interfaces
│   └── styles.css                   # Component styling
├── hooks/
│   └── usePriceCalculation.ts       # Custom hook for async price fetching
├── services/
│   └── api.ts                       # Mock API layer (production-ready interface)
├── utils/
│   └── pricing.ts                   # Price calculation utilities
└── data/
    └── mockProduct.ts              # Sample product data for demo
```

---

## 🎯 Core Features

### 1. **Product Option Selection**
   - **Single Select:** Dropdown menus for product options
   - **Color Picker:** Visual color swatches with responsive grid
   - **Quantity Control:** Numeric input with increment/decrement buttons
   - **Toggle Options:** Boolean flags for yes/no selections

### 2. **Pricing System**
   - **Base Price:** Starting price for the product
   - **Option Modifiers:** Each option selection can add/subtract from price
   - **Quantity Discounts:**
     - 1-9 items: No discount
     - 10-49 items: 5% off
     - 50+ items: 10% off
   - **Add-on Costs:** Fixed costs for additional features
   - **Real-time Calculation:** Updates instantly as selections change

### 3. **Draft System**
   - Save incomplete configurations as drafts
   - Auto-persisted to localStorage
   - Load/delete saved drafts
   - Custom naming for drafts
   - Last saved timestamp tracking

### 4. **Share Functionality**
   - Generate shareable URLs containing encoded configuration
   - Copy-to-clipboard functionality
   - Configurations can be loaded from URL parameters

### 5. **Validation & Dependencies**
   - Configuration validation for conflicts
   - Option dependencies (some options require others)
   - Add-on dependencies (e.g., "Gift Wrap" requires "Include Packaging")
   - Real-time validation with error/warning feedback

### 6. **Preview Generation**
   - Dynamic preview images based on selections
   - Simulated image composition logic
   - Cache-busting to show latest previews

### 7. **Responsive Design**
   - Mobile-friendly color picker with dynamic grid
   - Resize listener for responsive layouts
   - Mobile-optimized touch interactions

---

## 🔧 Important Functions & Hooks

### Main Component: `ProductConfigurator`

#### State Management
```typescript
- selections: Record<string, string | number | boolean> // User's option selections
- selectedAddOns: string[] // Array of selected add-on IDs
- quantity: number // Order quantity
- isDirty: boolean // Track unsaved changes
- lastSaved: Date | null // Timestamp of last draft save
- validation: ValidationResult // Current validation state
- previewUrl: string // Current preview image URL
- error: string | null // Error messages
```

#### Key Event Handlers
| Handler | Purpose |
|---------|---------|
| `handleOptionChange()` | Update option selections, handle dependencies |
| `handleAddOnToggle()` | Toggle add-on selection with availability checks |
| `handleQuantityChange()` | Update quantity with min/max constraints |
| `handleSaveDraft()` | Persist current configuration to localStorage |
| `handleLoadDraft()` | Load saved draft back into editor |
| `handleDeleteDraft()` | Remove a saved draft |
| `handleAddToCart()` | Submit configuration with validation |
| `handleQuickAdd()` | Quick add-to-cart button (shortcut) |
| `handleCopyShareUrl()` | Copy share URL to clipboard |

#### Render Functions
| Function | Purpose |
|----------|---------|
| `renderSelectOption()` | Render dropdown menus |
| `renderColorOption()` | Render color swatches with grid |
| `renderQuantityOption()` | Render quantity control with discount hints |
| `renderToggleOption()` | Render boolean toggles |
| `renderAddOn()` | Render add-on checkboxes with pricing |
| `renderPriceBreakdown()` | Display detailed price breakdown |
| `renderDraftModal()` | Display draft management modal |
| `renderShareModal()` | Display share URL modal |

### Custom Hook: `usePriceCalculation`

```typescript
// Returns: { price, formattedTotal, isLoading, error, refetch }
```
- Async price fetching with request deduplication
- Handles race conditions from rapid option changes
- Tracks latest request timestamp to prevent stale updates
- Error handling for failed calculations

### Utility Functions

#### `pricing.ts`
- `calculatePriceBreakdown()` - Full price calculation logic
- `formatPrice()` - Format numbers as currency
- `getAppliedDiscountPercentage()` - Calculate current discount %
- `getNextDiscountTier()` - Calculate items needed for next discount

#### `api.ts` (Mock API)
- `calculatePrice(config, product)` - Async price calculation with delay
- `validateConfiguration(config, product)` - Validate for conflicts
- `generatePreview(config, product)` - Generate preview image URL
- `saveDraft(config, name)` - Save to localStorage
- `loadDraft(draftId)` - Retrieve from localStorage
- `deleteDraft(draftId)` - Remove draft
- `getAllDrafts()` - List all saved drafts
- `encodeConfigurationToUrl(config)` - Convert to URL-safe string
- `decodeConfigurationFromUrl(encoded)` - Parse URL parameter

---

## 📊 Key Data Types

### Configuration
```typescript
{
  id: string                              // Unique config ID
  productId: string
  selections: Record<string, any>         // Selected option values
  addOns: string[]                        // Selected add-on IDs
  quantity: number
  createdAt: string                       // ISO timestamp
  updatedAt: string                       // ISO timestamp
  name?: string                           // Optional draft name
}
```

### Product
```typescript
{
  id: string
  name: string
  description: string
  basePrice: number
  currency: string
  options: ProductOption[]
  addOns: AddOn[]
  imageUrl: string
}
```

### ProductOption
```typescript
{
  id: string
  name: string
  type: 'select' | 'color' | 'quantity' | 'toggle'
  required: boolean
  choices?: OptionChoice[]                // For select/color types
  defaultValue?: string | number | boolean
  min?: number                            // For quantity type
  max?: number                            // For quantity type
  dependsOn?: OptionDependency            // Required for this option
}
```

### AddOn
```typescript
{
  id: string
  name: string
  description: string
  price: number
  dependsOn?: OptionDependency           // Required for this add-on
}
```

### PriceBreakdown
```typescript
{
  basePrice: number
  optionModifiers: Array<{optionId: string, amount: number}>
  addOnCosts: Array<{addOnId: string, amount: number}>
  subtotal: number                        // Before discounts
  quantityDiscount: number                // Discount amount
  total: number                           // Final price
}
```

---

## 🐛 Known Issues & Technical Debt

### Critical Issues (from TICKETS.md)
1. **CFG-142:** Price shows wrong value after rapid option changes
   - Race condition in async price calculation
   - User makes quick selections, price doesn't update correctly

2. **CFG-143:** App becomes sluggish after extended use
   - Memory leak suspected in resize handler
   - Possible preview generation memory issues

3. **CFG-148:** Crash when deselecting "Include Packaging"
   - React error: "Cannot read properties of undefined"
   - Dependency logic doesn't handle unsetting required option

### High Priority Issues
4. **CFG-146:** Timestamp shows wrong time for non-UTC users
5. **CFG-147:** Share link broken for some configurations
6. **CFG-150:** Color picker misaligned on mobile

### Medium Priority
7. **CFG-149:** No loading indicator during price calculation
8. **CFG-151:** Error messages too technical
9. **CFG-152:** Accessibility issues (keyboard navigation)
10. **CFG-156:** Missing React keys in list renders

### Feature Conflicts
- **CFG-144:** Remove "Quick Add" feature
- **CFG-145:** Add keyboard shortcut for "Quick Add"
  - These are contradictory; CFG-144 takes priority

### Nice-to-Have Features
- **CFG-153:** Compare configurations feature (2-3 week estimate)
- **CFG-155:** Dark mode support
- **CFG-157:** Unsaved changes confirmation

---

## 🎨 UI/UX Components

### Main Sections
1. **Header** - Product name, description, action buttons (Drafts, Share)
2. **Error Banner** - Display errors and technical details
3. **Validation Warnings** - Show conflicts and issues
4. **Options Panel** - All product options and add-ons
5. **Preview Panel** - Product image, price, and actions
6. **Modals** - Draft manager and share URL dialogs

### CSS Variables Used
- Color system (primary, secondary, danger, success)
- Card and modal styling
- Button variants
- Price display styling
- Grid layout with CSS variables for responsive colors

---

## 🚀 Development Workflow

### Available Commands
```bash
pnpm dev         # Start dev server (http://localhost:5173)
pnpm build       # Type-check & build for production
pnpm lint        # Run ESLint
pnpm preview     # Preview production build
```

### Dependencies
- react: ^19.2.0
- react-dom: ^19.2.0

### Dev Tools
- TypeScript 5.9.3
- Vite 7.2.4
- ESLint 9.39.1
- Vitest (testing)

---

## 📝 Code Quality Notes

### Marcus's Comments (Previous Developer)
> "The price calculation hook is a bit janky. I meant to refactor it but never got around to it. There might be some timing issues if users click fast."

> "The option validation logic is complicated because of all the dependencies. I added a bunch of defensive null checks."

> "The Quick Add feature was a rush job for a customer demo. It works but the code is rough."

> "Resize handler might have a leak"

### Current State
- **Large monolithic component**: ~1000 lines, should be split into smaller components
- **No external state management**: Uses only React hooks, acceptable for widget use
- **Production-ready API interface**: Mock API designed to match real backend structure
- **Good TypeScript coverage**: Comprehensive type definitions
- **Technical debt**: Memory leaks, race conditions, missing keys in lists

---

## 🎯 Next Steps for Priority Issues

### Critical (Block Demo)
1. Fix race condition in price calculation (CFG-142)
2. Fix crash when deselecting required option (CFG-148)
3. Fix memory leak in resize handler (CFG-143)

### High (Before Launch)
4. Fix timestamp timezone issue (CFG-146)
5. Fix share URL encoding (CFG-147)
6. Add loading indicator for price calculation (CFG-149)
7. Improve error messages (CFG-151)

### Medium (Polish)
8. Fix color picker alignment (CFG-150)
9. Add keyboard navigation (CFG-152)
10. Add React keys to lists (CFG-156)

### Feature Decisions
11. Decide on Quick Add feature (CFG-144 vs CFG-145)

### Nice-to-Have
12. Dark mode support
13. Unsaved changes confirmation
14. Compare configurations feature

---

## 📚 Business Context

### Target Customers
- **TechStyle**: Consumer electronics with custom configs
- **CustomPrint Co**: Personalized merchandise
- **FurnishNow**: Configurable furniture
- **GiftBox Pro**: Corporate gift packages

### Demo Timeline
- Major client demo with TechStyle in 2 weeks
- Key feature: Handles high-volume order configurations
- Requires stability and performance

### Product Considerations
- Embedded via iframe - must be self-contained
- Multi-currency support
- B2B focused - enterprise features
- Accessibility important for compliance requirements

---

## 🔐 Security & Performance

### Current Approach
- All calculations client-side for demo
- localStorage for draft persistence
- URL encoding for configuration sharing
- No authentication (mock environment)

### Production Considerations
- API would hit real backend for pricing
- Validation would be server-side
- Draft storage on backend database
- Configuration encryption for shared URLs
- CORS handling for embedding

---

This project is a well-structured but technically complex React application that requires careful handling of async operations, state management, and user interactions. The main challenges are race conditions, memory management, and the monolithic component structure, but the core functionality is solid and production-ready with some targeted fixes.
