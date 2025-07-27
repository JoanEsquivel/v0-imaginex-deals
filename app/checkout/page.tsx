"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import PaymentMethods from "@/components/PaymentMethods"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useCart } from "@/context/CartContext"
import { processPayment, type PaymentMethod } from "@/services/paymentService"
import { Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { useAuth } from "@/context/AuthContext"

// Define checkout steps
type CheckoutStep = "shipping" | "payment" | "confirmation"

export default function CheckoutPage() {
  // State for multi-step checkout
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping")

  // Shipping information
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [address, setAddress] = useState("")

  // Payment information
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("credit-card")
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [paymentError, setPaymentError] = useState<string | null>(null)
  const [transactionId, setTransactionId] = useState<string | null>(null)
  const [orderTotal, setOrderTotal] = useState(0)

  const { getCartTotal, clearCart, addOrder, items } = useCart()
  const router = useRouter()

  // Add useAuth hook
  const { username } = useAuth()

  // Handle shipping form submission
  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setCurrentStep("payment")
  }

  // Handle payment submission
  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessingPayment(true)
    setPaymentError(null)

    try {
      // Process payment
      const result = await processPayment({
        method: paymentMethod,
        amount: getCartTotal(),
        username: username,
        // We would include card details here in a real app
      })

      if (result.success) {
        // Save transaction ID
        setTransactionId(result.transactionId || null)

        // Save order
        addOrder({
          name,
          email,
          address,
        })

        setOrderTotal(getCartTotal())

        // Move to confirmation
        setCurrentStep("confirmation")

        // Clear cart
        clearCart()
      } else {
        setPaymentError(result.error || "Payment failed. Please try again.")
      }
    } catch (error) {
      setPaymentError("An error occurred while processing your payment. Please try again.")
      console.error("Payment error:", error)
    } finally {
      setIsProcessingPayment(false)
    }
  }

  const handleContinueShopping = () => {
    router.push("/products")
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#EAEDED] flex flex-col">
        <Header />

        <main className="max-w-4xl mx-auto py-4 px-4 flex-grow">
          <div className="bg-white p-4 mb-4 rounded-sm">
            {/* Checkout Progress */}
            <div className="border-b pb-4 mb-6">
              <div className="flex items-center justify-between max-w-md mx-auto">
                <div
                  className={`flex flex-col items-center ${
                    currentStep === "shipping" || currentStep === "payment" || currentStep === "confirmation"
                      ? "text-yellow-600"
                      : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                      currentStep === "shipping" || currentStep === "payment" || currentStep === "confirmation"
                        ? "bg-yellow-100 border-2 border-yellow-500"
                        : "bg-gray-100 border border-gray-300"
                    }`}
                  >
                    1
                  </div>
                  <span className="text-xs">Shipping</span>
                </div>

                <div
                  className={`flex-1 h-1 mx-2 ${
                    currentStep === "payment" || currentStep === "confirmation" ? "bg-yellow-500" : "bg-gray-200"
                  }`}
                ></div>

                <div
                  className={`flex flex-col items-center ${
                    currentStep === "payment" || currentStep === "confirmation" ? "text-yellow-600" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                      currentStep === "payment" || currentStep === "confirmation"
                        ? "bg-yellow-100 border-2 border-yellow-500"
                        : "bg-gray-100 border border-gray-300"
                    }`}
                  >
                    2
                  </div>
                  <span className="text-xs">Payment</span>
                </div>

                <div
                  className={`flex-1 h-1 mx-2 ${currentStep === "confirmation" ? "bg-yellow-500" : "bg-gray-200"}`}
                ></div>

                <div
                  className={`flex flex-col items-center ${
                    currentStep === "confirmation" ? "text-yellow-600" : "text-gray-400"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 ${
                      currentStep === "confirmation"
                        ? "bg-yellow-100 border-2 border-yellow-500"
                        : "bg-gray-100 border border-gray-300"
                    }`}
                  >
                    3
                  </div>
                  <span className="text-xs">Confirmation</span>
                </div>
              </div>
            </div>

            {/* Shipping Step */}
            {currentStep === "shipping" && (
              <div className="grid gap-6 lg:grid-cols-5">
                <div className="lg:col-span-3">
                  <h1 className="text-2xl font-medium mb-4">Shipping Information</h1>
                  <form onSubmit={handleShippingSubmit} data-testid="shipping-form">
                    <div className="space-y-4 mb-6">
                      <div>
                        <label htmlFor="name" className="block mb-1 font-medium">
                          Full Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          className="input-field"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                          data-testid="shipping-name"
                        />
                      </div>

                      <div>
                        <label htmlFor="email" className="block mb-1 font-medium">
                          Email Address
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="input-field"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          required
                          data-testid="shipping-email"
                        />
                      </div>

                      <div>
                        <label htmlFor="address" className="block mb-1 font-medium">
                          Shipping Address
                        </label>
                        <textarea
                          id="address"
                          rows={3}
                          className="input-field"
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          required
                          data-testid="shipping-address"
                        />
                      </div>
                    </div>

                    <button type="submit" className="btn-primary w-full" data-testid="continue-to-payment-button">
                      Continue to Payment
                    </button>
                  </form>
                </div>

                <div className="lg:col-span-2">
                  <OrderSummary total={getCartTotal()} />
                </div>
              </div>
            )}

            {/* Payment Step */}
            {currentStep === "payment" && (
              <div className="grid gap-6 lg:grid-cols-5">
                <div className="lg:col-span-3">
                  <div className="flex items-center justify-between mb-4">
                    <h1 className="text-2xl font-medium">Payment Method</h1>
                    <button
                      onClick={() => setCurrentStep("shipping")}
                      className="text-sm text-blue-600 hover:underline"
                      data-testid="back-to-shipping"
                    >
                      Back to shipping
                    </button>
                  </div>

                  <form onSubmit={handlePaymentSubmit} data-testid="payment-form">
                    <PaymentMethods selectedMethod={paymentMethod} onPaymentMethodSelected={setPaymentMethod} />

                    {paymentError && (
                      <div
                        className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md flex items-start"
                        data-testid="payment-error"
                      >
                        <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-2 flex-shrink-0" />
                        <p className="text-sm text-red-700">{paymentError}</p>
                      </div>
                    )}

                    <div className="mt-6">
                      <button
                        type="submit"
                        className="btn-primary w-full flex items-center justify-center"
                        disabled={isProcessingPayment}
                        data-testid="place-order-button"
                      >
                        {isProcessingPayment ? (
                          <>
                            <Loader2 className="animate-spin h-4 w-4 mr-2" />
                            Processing Payment...
                          </>
                        ) : (
                          "Place Order"
                        )}
                      </button>
                    </div>

                    <div className="mt-4 text-xs text-gray-500 text-center">
                      <p>This is a test environment. No actual payments will be processed.</p>
                      <p className="mt-1">For testing different payment scenarios:</p>
                      <ul className="mt-1">
                        <li>• Use any total ending in .99 to simulate a declined payment</li>
                        <li>• Use any total ending in .88 to simulate a network error</li>
                      </ul>
                    </div>
                  </form>
                </div>

                <div className="lg:col-span-2">
                  <OrderSummary total={getCartTotal()} />
                </div>
              </div>
            )}

            {/* Confirmation Step */}
            {currentStep === "confirmation" && (
              <div className="p-6 text-center" data-testid="order-confirmation">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-medium text-green-600 mb-4">Order placed successfully!</h2>
                <p className="text-gray-600 mb-2">Thank you for your order. We've received your purchase request.</p>

                {transactionId && (
                  <p className="text-gray-600 mb-6" data-testid="transaction-id">
                    Transaction ID: <span className="font-medium">{transactionId}</span>
                  </p>
                )}

                <div className="max-w-md mx-auto bg-gray-50 p-4 rounded-md mb-6 text-left">
                  <h3 className="font-medium mb-2">Order Summary</h3>
                  <div className="text-sm">
                    <p>
                      <span className="font-medium">Name:</span> {name}
                    </p>
                    <p>
                      <span className="font-medium">Email:</span> {email}
                    </p>
                    <p>
                      <span className="font-medium">Address:</span> {address}
                    </p>
                    <p className="mt-2">
                      <span className="font-medium">Payment Method:</span> {getPaymentMethodName(paymentMethod)}
                    </p>
                    <p>
                      <span className="font-medium">Total:</span> ${orderTotal.toFixed(2)}
                    </p>
                  </div>
                </div>

                <button onClick={handleContinueShopping} className="btn-primary">
                  Continue Shopping
                </button>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  )
}

// Helper component for order summary
function OrderSummary({ total }: { total: number }) {
  return (
    <div className="bg-[#f3f3f3] p-4 rounded-sm">
      <h2 className="text-lg font-medium mb-4">Order Summary</h2>

      <div className="border-t border-b py-4 mb-4">
        <div className="flex justify-between mb-2">
          <span>Items:</span>
          <span>${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-2">
          <span>Shipping & handling:</span>
          <span>$0.00</span>
        </div>
        <div className="flex justify-between">
          <span>Estimated tax:</span>
          <span>$0.00</span>
        </div>
      </div>

      <div className="flex justify-between font-bold text-lg">
        <span>Order total:</span>
        <span>${total.toFixed(2)}</span>
      </div>
    </div>
  )
}

// Helper function to get payment method display name
function getPaymentMethodName(method: PaymentMethod): string {
  switch (method) {
    case "credit-card":
      return "Credit Card"
    case "paypal":
      return "PayPal"
    case "google-pay":
      return "Google Pay"
    case "apple-pay":
      return "Apple Pay"
    default:
      return "Unknown"
  }
}
