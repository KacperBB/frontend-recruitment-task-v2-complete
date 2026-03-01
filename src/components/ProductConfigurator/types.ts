// ProductConfigurator Types
// Last updated by Marcus - "I think this covers everything we need"

export interface Product {
  id: string;
  name: string;
  description: string;
  basePrice: number;
  currency: string;
  options: ProductOption[];
  addOns: AddOn[];
  imageUrl: string;
}

export type OptionType = 'select' | 'color' | 'quantity' | 'toggle';

export interface ProductOption {
  id: string;
  name: string;
  type: OptionType;
  required: boolean;
  choices?: OptionChoice[];
  defaultValue?: string | number | boolean;
  min?: number;
  max?: number;
  dependsOn?: OptionDependency;
}

export interface OptionChoice {
  id: string;
  label: string;
  value: string;
  priceModifier: number;
  colorHex?: string;
  available: boolean;
  imageOverlay?: string;
}

export interface OptionDependency {
  optionId: string;
  requiredValue: string | boolean;
}

export interface AddOn {
  id: string;
  name: string;
  description: string;
  price: number;
  dependsOn?: OptionDependency;
}

export interface Configuration {
  id: string;
  productId: string;
  selections: Record<string, string | number | boolean>;
  addOns: string[];
  quantity: number;
  createdAt: string;
  updatedAt: string;
  name?: string;
}

export interface PriceBreakdown {
  basePrice: number;
  optionModifiers: { optionId: string; amount: number }[];
  addOnCosts: { addOnId: string; amount: number }[];
  subtotal: number;
  quantityDiscount: number;
  total: number;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
  warnings: ValidationWarning[];
}

export interface ValidationError {
  code: string;
  message: string;
  optionId?: string;
}

export interface ValidationWarning {
  code: string;
  message: string;
  optionId?: string;
}

export interface Draft {
  id: string;
  configuration: Configuration;
  savedAt: string;
  name: string;
}

// API Response types
export interface PriceResponse {
  breakdown: PriceBreakdown;
  formattedTotal: string;
  timestamp: number;
}

export interface PreviewResponse {
  imageUrl: string;
  generatedAt: number;
}

// Component Props
export interface ProductConfiguratorProps {
  product: Product;
  initialConfiguration?: Partial<Configuration>;
  onConfigurationChange?: (config: Configuration) => void;
  onAddToCart?: (config: Configuration, price: PriceBreakdown) => void;
  readOnly?: boolean;
}

// Internal state types
export interface ConfiguratorState {
  selections: Record<string, string | number | boolean>;
  addOns: string[];
  quantity: number;
  isDirty: boolean;
  lastSaved: Date | null;
}

// Error codes - Marcus: "The numbers don't mean anything specific, just legacy stuff"
export const ERROR_CODES = {
  PRICE_CALC_FAILED: 'ERR_PRICE_CALC_FAILED',
  VALIDATION_CONFLICT: 'VALIDATION_CONFLICT_47',
  NETWORK_TIMEOUT: 'ERR_NETWORK_TIMEOUT_PRICE',
  INVALID_QUANTITY: 'ERR_INVALID_QTY',
  DEPENDENCY_MISSING: 'ERR_DEP_MISSING_47',
  UNKNOWN: 'ERR_UNKNOWN',
} as const;

export type ErrorCode = typeof ERROR_CODES[keyof typeof ERROR_CODES];

/**
 * Map technical error codes to user-friendly messages with actionable steps
 */
export const ERROR_MESSAGES: Record<ErrorCode, { title: string; description: string; action: string }> = {
  [ERROR_CODES.PRICE_CALC_FAILED]: {
    title: 'Unable to calculate price',
    description: 'We\'re having trouble calculating the price for your configuration.',
    action: 'Please try adjusting your selections or refresh the page. If the problem persists, contact support.',
  },
  [ERROR_CODES.VALIDATION_CONFLICT]: {
    title: 'Configuration conflict',
    description: 'Some of your selections are not compatible together.',
    action: 'Please review your choices and try a different combination.',
  },
  [ERROR_CODES.NETWORK_TIMEOUT]: {
    title: 'Connection timeout',
    description: 'The request is taking longer than expected.',
    action: 'Please check your internet connection and try again. If the problem continues, contact support.',
  },
  [ERROR_CODES.INVALID_QUANTITY]: {
    title: 'Invalid quantity',
    description: 'The quantity you entered is not valid.',
    action: 'Please enter a quantity between the minimum and maximum allowed.',
  },
  [ERROR_CODES.DEPENDENCY_MISSING]: {
    title: 'Required option missing',
    description: 'This selection requires another option to be selected first.',
    action: 'Please select the required option and try again.',
  },
  [ERROR_CODES.UNKNOWN]: {
    title: 'Something went wrong',
    description: 'An unexpected error occurred while processing your request.',
    action: 'Please try again or contact support if the problem persists.',
  },
};

// Event types for callbacks
export interface ConfigChangeEvent {
  type: 'option' | 'addon' | 'quantity';
  optionId?: string;
  addOnId?: string;
  previousValue: any;
  newValue: any;
}
