/**
 * Single Vendor Configuration
 * 
 * This module provides utilities for working with the default seller
 * in single-vendor mode. All products and operations use a single seller.
 */

/**
 * Get the default seller ID from environment variables
 * Falls back to 'default_seller' if not configured
 */
export const getDefaultSellerId = (): string => {
  return import.meta.env.SUPABASE_SINGLE_SELLER_ID || 'default_seller';
};

/**
 * Get the default seller name from environment variables
 * Falls back to 'Dezemu Shop' if not configured
 */
export const getDefaultSellerName = (): string => {
  return import.meta.env.DEFAULT_SELLER_NAME || 'Dezemu Shop';
};

/**
 * Get the default seller logo URL from environment variables
 * Returns null if not configured
 */
export const getDefaultSellerLogoUrl = (): string | null => {
  return import.meta.env.DEFAULT_SELLER_LOGO_URL || null;
};

/**
 * Single vendor configuration object
 */
export const singleVendorConfig = {
  sellerId: getDefaultSellerId(),
  sellerName: getDefaultSellerName(),
  sellerLogoUrl: getDefaultSellerLogoUrl(),
} as const;
