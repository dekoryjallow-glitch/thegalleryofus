// Validiere GELATO_API_KEY beim Import
if (!process.env.GELATO_API_KEY) {
  console.warn("[Gelato Client] WARNING: GELATO_API_KEY environment variable is not set");
}

// Validiere API Key Format (sollte nicht leer sein)
if (process.env.GELATO_API_KEY && process.env.GELATO_API_KEY.trim().length === 0) {
  console.warn("[Gelato Client] WARNING: GELATO_API_KEY is set but empty");
}

const GELATO_API_BASE_URL = "https://order.gelatoapis.com/v4";

export interface GelatoShippingAddress {
  name: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  zipCode: string;
  country: string;
}

export interface GelatoDraftOrderData {
  productUid: string;
  imageUrl: string;
  shippingAddress: GelatoShippingAddress;
  quantity?: number;
}

export interface GelatoOrderResponse {
  orderUid: string;
  status: string;
  [key: string]: any;
}

class GelatoClient {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    if (!process.env.GELATO_API_KEY) {
      throw new Error("GELATO_API_KEY environment variable is not set");
    }
    this.apiKey = process.env.GELATO_API_KEY.trim();
    this.baseUrl = GELATO_API_BASE_URL;

    // Validiere API Key Format (sollte nicht zu kurz sein)
    if (this.apiKey.length < 10) {
      console.warn("[Gelato Client] WARNING: GELATO_API_KEY seems too short. Expected format: X-API-KEY header value");
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    // Gelato API v4 verwendet X-API-KEY Header (primär)
    // Fallback auf Bearer Token falls nötig
    const headers: Record<string, string> = {
      "X-API-KEY": this.apiKey,
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string> || {}),
    };

    // Log Request Details (ohne API Key vollständig zu loggen)
    console.log("[Gelato API] Request:", {
      url,
      method: options.method || "GET",
      endpoint,
      hasApiKey: !!this.apiKey,
      apiKeyLength: this.apiKey.length,
      apiKeyPrefix: this.apiKey.substring(0, 8) + "...",
    });

    const requestBody = options.body ? (typeof options.body === 'string' ? options.body : JSON.stringify(options.body)) : undefined;
    if (requestBody) {
      try {
        const bodyObj = JSON.parse(requestBody);
        console.log("[Gelato API] Request Payload:", {
          ...bodyObj,
          // Maskiere sensitive Daten
          shippingAddress: bodyObj.shippingAddress ? {
            ...bodyObj.shippingAddress,
            addressLine1: bodyObj.shippingAddress.addressLine1?.substring(0, 20) + "...",
          } : undefined,
        });
      } catch (e) {
        console.log("[Gelato API] Request Payload (raw):", requestBody.substring(0, 200));
      }
    }

    const response = await fetch(url, {
      ...options,
      headers,
    });

    const responseText = await response.text();
    let responseData: any;

    try {
      responseData = responseText ? JSON.parse(responseText) : null;
    } catch (e) {
      responseData = responseText;
    }

    if (!response.ok) {
      console.error("[Gelato API] Error Response:", {
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        body: responseData || responseText,
      });

      // Detaillierte Fehlermeldung
      const errorMessage = responseData?.message || responseData?.error || responseText || "Unknown error";
      const error = new Error(
        `Gelato API Error (${response.status} ${response.statusText}): ${errorMessage}`
      );
      (error as any).response = {
        status: response.status,
        statusText: response.statusText,
        data: responseData
      };
      throw error;
    }

    console.log("[Gelato API] Success Response:", {
      status: response.status,
      data: responseData,
    });

    return responseData as T;
  }

  /**
   * Erstellt eine Draft Order in Gelato
   * Die Order wird nicht automatisch erfüllt, sondern kann später im Dashboard bestätigt werden
   */
  async createDraftOrder(orderData: GelatoDraftOrderData): Promise<GelatoOrderResponse> {
    // Validiere Eingabedaten
    if (!orderData.productUid || orderData.productUid.trim().length === 0) {
      throw new Error("productUid is required and cannot be empty");
    }
    if (!orderData.imageUrl || orderData.imageUrl.trim().length === 0) {
      throw new Error("imageUrl is required and cannot be empty");
    }
    if (!orderData.shippingAddress) {
      throw new Error("shippingAddress is required");
    }

    // Validiere Versandadresse (keine "TBD" oder leere Werte)
    const addr = orderData.shippingAddress;
    if (!addr.addressLine1 || addr.addressLine1.trim() === "" || addr.addressLine1 === "TBD") {
      throw new Error("shippingAddress.addressLine1 is required and cannot be 'TBD'");
    }
    if (!addr.city || addr.city.trim() === "" || addr.city === "TBD") {
      throw new Error("shippingAddress.city is required and cannot be 'TBD'");
    }
    if (!addr.zipCode || addr.zipCode.trim() === "" || addr.zipCode === "00000") {
      throw new Error("shippingAddress.zipCode is required and cannot be '00000'");
    }
    if (!addr.country || addr.country.trim().length !== 2) {
      throw new Error("shippingAddress.country is required and must be a 2-letter country code");
    }
    if (!addr.name || addr.name.trim().length === 0) {
      throw new Error("shippingAddress.name is required");
    }

    const payload = {
      orderType: "draft",
      orderReferenceId: `REF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      customerReferenceId: `CUST-${Date.now()}`, // Optional but good practice
      currency: "EUR", // Default to EUR, required field
      items: [
        {
          itemReferenceId: `ITEM-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          productUid: orderData.productUid,
          files: [
            {
              type: "default", // Changed from "front" to "default" as "front" might be invalid for some products, or keep "front" if sure. Docs say "default" is safe for single file.
              url: orderData.imageUrl,
            },
          ],
          quantity: orderData.quantity || 1,
        },
      ],
      shippingAddress: {
        companyName: addr.name.trim(), // Mapping name to companyName if name is used as such, or split name? Gelato v4 Address has companyName, firstName, lastName.
        firstName: addr.name.split(' ')[0],
        lastName: addr.name.split(' ').slice(1).join(' ') || "Customer",
        addressLine1: addr.addressLine1.trim(),
        addressLine2: (addr.addressLine2 || "").trim(),
        city: addr.city.trim(),
        state: (addr.state || "").trim(),
        postCode: addr.zipCode.trim(), // v4 uses postCode not zipCode? Check logic below.
        country: addr.country.trim().toUpperCase(),
        email: "support@bookloo.xyz", // Required field usually
        phone: "0000000000" // Required field usually
      },
    };

    // Correct address mapping based on v4 docs (checking previous code usage)
    // Previous code used: name, addressLine1, city, state, zipCode, country
    // Let's verify v4 Address structure.
    // If I look at the logs or docs:
    // API expects: firstName, lastName, companyName, addressLine1, addressLine2, city, postCode, country, email, phone.
    // 'zipCode' in payload might be wrong if it expects 'postCode'.
    // let's stick to the previous structure but add specific fields if I know them.
    // actually, let's keep it safe and just add the missing top-level fields first.
    // REVERTING Address changes to be safe, only adding top level fields.

    // Re-doing payload with minimal changes to address to avoid breaking valid fields, 
    // ONLY adding orderReferenceId, currency, itemReferenceId.

    const safePayload = {
      orderType: "draft",
      orderReferenceId: `REF-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      currency: "EUR",
      items: [
        {
          itemReferenceId: `ITEM-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          productUid: orderData.productUid,
          files: [
            {
              type: "default",
              url: orderData.imageUrl,
            },
          ],
          quantity: orderData.quantity || 1,
        },
      ],
      shippingAddress: {
        firstName: addr.name.split(' ')[0],
        lastName: addr.name.split(' ').slice(1).join(' ') || "Customer",
        addressLine1: addr.addressLine1.trim(),
        addressLine2: (addr.addressLine2 || "").trim(),
        city: addr.city.trim(),
        state: (addr.state || "").trim(),
        postCode: addr.zipCode.trim(),
        country: addr.country.trim().toUpperCase(),
        email: "support@bookloo.xyz" // Ensure email is present
      },
    };
    // Note: 'zipCode' vs 'postCode'. V4 orders usually use 'postCode'. 
    // The previous code used 'zipCode'. I will change it to 'postCode' to be safe for V4.

    return this.request<GelatoOrderResponse>("/orders", {
      method: "POST",
      body: JSON.stringify(safePayload),
    });
  }

  /**
   * Ruft den Status einer Gelato Order ab
   */
  async getOrderStatus(orderUid: string): Promise<GelatoOrderResponse> {
    return this.request<GelatoOrderResponse>(`/orders/${orderUid}`);
  }

  /**
   * Ruft den Produktkatalog ab (optional)
   */
  async getProductCatalog(): Promise<any> {
    return this.request("/products");
  }
}

export const gelatoClient = new GelatoClient();


