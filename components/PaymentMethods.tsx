"use client"
import Image from "next/image"
import { CreditCard, Check } from "lucide-react"
import CreditCardForm from "./CreditCardForm"

type PaymentMethod = "credit-card" | "paypal" | "google-pay" | "apple-pay"

interface PaymentMethodsProps {
  onPaymentMethodSelected: (method: PaymentMethod) => void
  selectedMethod: PaymentMethod
}

export default function PaymentMethods({ onPaymentMethodSelected, selectedMethod }: PaymentMethodsProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium mb-2">Payment Method</h2>

      <div className="space-y-3">
        {/* Credit Card Option */}
        <div
          className={`border rounded-sm p-3 cursor-pointer ${
            selectedMethod === "credit-card" ? "border-yellow-500 bg-yellow-50" : "border-gray-300"
          }`}
          onClick={() => onPaymentMethodSelected("credit-card")}
          data-testid="payment-method-credit-card"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-gray-600" />
              <span className="font-medium">Credit or Debit Card</span>
            </div>
            {selectedMethod === "credit-card" && <Check className="h-5 w-5 text-yellow-500" />}
          </div>

          {selectedMethod === "credit-card" && (
            <div className="mt-4">
              <CreditCardForm />
            </div>
          )}
        </div>

        {/* PayPal Option */}
        <div
          className={`border rounded-sm p-3 cursor-pointer ${
            selectedMethod === "paypal" ? "border-yellow-500 bg-yellow-50" : "border-gray-300"
          }`}
          onClick={() => onPaymentMethodSelected("paypal")}
          data-testid="payment-method-paypal"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative w-6 h-6">
                <Image src="/paypal-logo.png" alt="PayPal" width={24} height={24} />
              </div>
              <span className="font-medium">PayPal</span>
            </div>
            {selectedMethod === "paypal" && <Check className="h-5 w-5 text-yellow-500" />}
          </div>
        </div>

        {/* Google Pay Option */}
        <div
          className={`border rounded-sm p-3 cursor-pointer ${
            selectedMethod === "google-pay" ? "border-yellow-500 bg-yellow-50" : "border-gray-300"
          }`}
          onClick={() => onPaymentMethodSelected("google-pay")}
          data-testid="payment-method-google-pay"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 flex items-center justify-center">
                <GooglePayIcon />
              </div>
              <span className="font-medium">Google Pay</span>
            </div>
            {selectedMethod === "google-pay" && <Check className="h-5 w-5 text-yellow-500" />}
          </div>
        </div>

        {/* Apple Pay Option */}
        <div
          className={`border rounded-sm p-3 cursor-pointer ${
            selectedMethod === "apple-pay" ? "border-yellow-500 bg-yellow-50" : "border-gray-300"
          }`}
          onClick={() => onPaymentMethodSelected("apple-pay")}
          data-testid="payment-method-apple-pay"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="relative w-6 h-6">
                <Image src="/apple-pay-logo.png" alt="Apple Pay" width={24} height={24} />
              </div>
              <span className="font-medium">Apple Pay</span>
            </div>
            {selectedMethod === "apple-pay" && <Check className="h-5 w-5 text-yellow-500" />}
          </div>
        </div>
      </div>
    </div>
  )
}

// Google Pay icon as an inline SVG component
function GooglePayIcon() {
  return (
    <svg width="24" height="16" viewBox="0 0 41 17" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M19.526 2.635v4.083h2.518c.6 0 1.096-.202 1.488-.605.403-.402.605-.882.605-1.437 0-.544-.202-1.018-.605-1.422-.392-.413-.888-.62-1.488-.62h-2.518zm0 5.52v4.736h-1.504V1.198h3.99c1.013 0 1.873.337 2.582 1.012.72.675 1.08 1.497 1.08 2.466 0 .991-.36 1.819-1.08 2.482-.697.665-1.559.996-2.583.996h-2.485v.001zM27.194 10.442c0 .392.166.718.499.98.332.26.722.391 1.168.391.633 0 1.196-.234 1.692-.701.497-.469.744-1.019.744-1.65-.469-.37-1.123-.555-1.962-.555-.61 0-1.12.148-1.528.442-.409.294-.613.657-.613 1.093m1.946-5.815c1.112 0 1.989.297 2.633.89.642.594.964 1.408.964 2.442v4.932h-1.439v-1.11h-.065c-.622.914-1.45 1.372-2.486 1.372-.882 0-1.621-.262-2.215-.784-.594-.523-.891-1.176-.891-1.96 0-.828.313-1.486.94-1.976.626-.49 1.464-.735 2.514-.735.873 0 1.596.147 2.166.44v-.307c0-.52-.175-.95-.527-1.29-.352-.339-.82-.509-1.404-.509-.768 0-1.368.254-1.799.763l-1.324-.828c.678-.925 1.677-1.387 2.993-1.387"
        fill="#3C4043"
      ></path>
      <path
        d="M35.082 2.627h-3.654v9.637h1.501V9.616h2.153c.998 0 1.821-.3 2.471-.9.649-.6.975-1.367.975-2.301 0-.933-.325-1.705-.974-2.315-.65-.61-1.473-.914-2.472-.914m-2.153 5.579V4.009h2.389c.612 0 1.105.204 1.483.612.377.408.566.891.566 1.452 0 .559-.189 1.042-.566 1.45-.378.407-.87.61-1.483.61h-2.389v.073z"
        fill="#3C4043"
      ></path>
      <path
        d="M38.671 12.292l4.844-10.74h-1.72l-3.474 7.837h-.046L34.8 1.553h-1.721l4.892 10.74h.7z"
        fill="#3C4043"
      ></path>
      <path
        d="M6.255 8.036c0-.473-.04-.93-.117-1.366H3.2v2.588h1.725c-.074.418-.301.786-.636 1.077v.896h1.534c.898-.826 1.431-2.044 1.431-3.195"
        fill="#4285F4"
      ></path>
      <path
        d="M3.2 12.8c1.283 0 2.363-.427 3.15-1.155l-1.534-.896c-.425.283-.968.45-1.616.45-.1244 0-2.228-.83-2.593-2.247H.019v.923C.805 11.714 1.906 12.8 3.2 12.8"
        fill="#34A853"
      ></path>
      <path
        d="M.607 8.952c-.094-.281-.148-.582-.148-.892 0-.31.054-.61.148-.892v-.923H.019C-.127 6.75-.2 7.32-.2 7.909c0 .589.073 1.159.219 1.666l.588-.623z"
        fill="#FABB05"
      ></path>
      <path
        d="M3.2 4.813c.701 0 1.331.24 1.828.71l1.36-1.36C5.591 3.437 4.51 3 3.2 3 1.906 3 .805 4.086.019 5.525l.588.623C.973 4.83 2.156 4.813 3.2 4.813"
        fill="#E94235"
      ></path>
    </svg>
  )
}
