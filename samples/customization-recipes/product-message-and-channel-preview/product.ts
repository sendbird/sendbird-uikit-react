// The one typed contract shared by the message body and the channel preview.
export const PRODUCT_TYPE = 'product-card';

export interface Product {
  sku: string;
  title: string;
}

/** Message fields to send with a text or single-file message. */
export function encodeProduct(product: Product) {
  return { customType: PRODUCT_TYPE, data: JSON.stringify(product) };
}

/** Returns a product only for well-formed product messages, so every other message keeps the stock UI. */
export function decodeProduct(customType: unknown, data: unknown): Product | undefined {
  if (customType !== PRODUCT_TYPE || typeof data !== 'string' || data.length > 2_048) return;

  let value: unknown;
  try {
    value = JSON.parse(data);
  } catch {
    return;
  }
  if (!value || typeof value !== 'object' || Array.isArray(value)) return;
  const { sku, title } = value as Record<string, unknown>;
  if (typeof sku !== 'string' || typeof title !== 'string') return;

  const product = { sku: sku.trim(), title: title.trim() };
  if (!product.sku || product.sku.length > 64 || !product.title || product.title.length > 120) return;
  return product;
}
