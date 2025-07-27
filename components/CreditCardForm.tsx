"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"

export default function CreditCardForm() {
  const [cardNumber, setCardNumber] = useState("")
  const [cardName, setCardName] = useState("")
  const [expiryDate, setExpiryDate] = useState("")
  const [cvv, setCvv] = useState("")
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Format card number with spaces
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return value
    }
  }

  // Format expiry date (MM/YY)
  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")

    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`
    }

    return v
  }

  // Handle card number change
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatCardNumber(e.target.value)
    setCardNumber(value)

    // Clear error when user types
    if (errors.cardNumber) {
      setErrors((prev) => ({ ...prev, cardNumber: "" }))
    }
  }

  // Handle expiry date change
  const handleExpiryDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatExpiryDate(e.target.value)
    setExpiryDate(value)

    // Clear error when user types
    if (errors.expiryDate) {
      setErrors((prev) => ({ ...prev, expiryDate: "" }))
    }
  }

  // Detect card type based on first digits
  const getCardType = () => {
    const number = cardNumber.replace(/\s+/g, "")

    if (/^4/.test(number)) return "visa"
    if (/^5[1-5]/.test(number)) return "mastercard"
    if (/^3[47]/.test(number)) return "amex"
    if (/^6(?:011|5)/.test(number)) return "discover"

    return "generic"
  }

  // Get card icon based on type
  const getCardIcon = () => {
    const type = getCardType()
    return `/placeholder.svg?height=24&width=36&query=${type} card logo`
  }

  return (
    <div className="space-y-3" data-testid="credit-card-form">
      <div>
        <label htmlFor="card-number" className="block text-sm font-medium mb-1">
          Card Number
        </label>
        <div className="relative">
          <input
            id="card-number"
            type="text"
            className="input-field pl-10 pr-10"
            placeholder="1234 5678 9012 3456"
            value={cardNumber}
            onChange={handleCardNumberChange}
            maxLength={19}
            data-testid="card-number-input"
          />
          {cardNumber && (
            <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
              <Image src={getCardIcon() || "/placeholder.svg"} alt={getCardType()} width={36} height={24} />
            </div>
          )}
          <div className="absolute left-2 top-1/2 transform -translate-y-1/2">
            <CreditCardIcon />
          </div>
        </div>
        {errors.cardNumber && <p className="text-red-500 text-xs mt-1">{errors.cardNumber}</p>}
      </div>

      <div>
        <label htmlFor="card-name" className="block text-sm font-medium mb-1">
          Name on Card
        </label>
        <input
          id="card-name"
          type="text"
          className="input-field"
          placeholder="John Doe"
          value={cardName}
          onChange={(e) => {
            setCardName(e.target.value)
            if (errors.cardName) setErrors((prev) => ({ ...prev, cardName: "" }))
          }}
          data-testid="card-name-input"
        />
        {errors.cardName && <p className="text-red-500 text-xs mt-1">{errors.cardName}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="expiry-date" className="block text-sm font-medium mb-1">
            Expiry Date (MM/YY)
          </label>
          <input
            id="expiry-date"
            type="text"
            className="input-field"
            placeholder="MM/YY"
            value={expiryDate}
            onChange={handleExpiryDateChange}
            maxLength={5}
            data-testid="expiry-date-input"
          />
          {errors.expiryDate && <p className="text-red-500 text-xs mt-1">{errors.expiryDate}</p>}
        </div>

        <div>
          <label htmlFor="cvv" className="block text-sm font-medium mb-1">
            CVV
          </label>
          <input
            id="cvv"
            type="text"
            className="input-field"
            placeholder="123"
            value={cvv}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "")
              setCvv(value)
              if (errors.cvv) setErrors((prev) => ({ ...prev, cvv: "" }))
            }}
            maxLength={4}
            data-testid="cvv-input"
          />
          {errors.cvv && <p className="text-red-500 text-xs mt-1">{errors.cvv}</p>}
        </div>
      </div>
    </div>
  )
}

// Credit card icon component
function CreditCardIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-gray-400"
    >
      <rect width="20" height="14" x="2" y="5" rx="2" />
      <line x1="2" x2="22" y1="10" y2="10" />
    </svg>
  )
}
