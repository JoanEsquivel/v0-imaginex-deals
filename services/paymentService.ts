// Types for payment processing
export type PaymentMethod = "credit-card" | "paypal" | "google-pay" | "apple-pay"

// Update the PaymentDetails interface to include user credentials
export interface PaymentDetails {
  method: PaymentMethod
  amount: number
  username?: string
  cardDetails?: {
    number: string
    name: string
    expiry: string
    cvv: string
  }
}

// Define the PaymentResult type
export interface PaymentResult {
  success: boolean
  transactionId?: string
  error?: string
}

// Modify the processPayment function to check for specific test credentials
export async function processPayment(paymentDetails: PaymentDetails): Promise<PaymentResult> {
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // Check for specific test users - test_failure should fail, test_user should succeed
  if (paymentDetails.username === "test_failure") {
    return {
      success: false,
      error: "Payment declined. This test user always fails payments.",
    }
  }

  // For testing purposes, we'll still simulate different scenarios based on the payment amount
  // This allows testers to trigger different payment outcomes regardless of user

  // Simulate a declined payment for amounts ending in .99
  if (paymentDetails.amount.toFixed(2).endsWith(".99")) {
    return {
      success: false,
      error: "Payment declined. Please try another payment method.",
    }
  }

  // Simulate a network error for amounts ending in .88
  if (paymentDetails.amount.toFixed(2).endsWith(".88")) {
    throw new Error("Network error while processing payment")
  }

  // Otherwise, simulate a successful payment
  return {
    success: true,
    transactionId: `TX-${Math.random().toString(36).substring(2, 10).toUpperCase()}`,
  }
}
