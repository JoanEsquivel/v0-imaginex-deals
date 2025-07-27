"use client"

import type React from "react"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { useCart } from "@/context/CartContext"
import { ShoppingCart, Search, Menu } from "lucide-react"
import { useState } from "react"

export default function Header() {
  const { isAuthenticated, logout, username } = useAuth()
  const { getCartCount } = useCart()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")

  const handleLogout = () => {
    logout()
    router.push("/login")
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // In a real app, this would search products
    // For now, just redirect to products page
    router.push("/products")
  }

  if (!isAuthenticated) return null

  // Display a friendly username or default to "Guest" if username is null
  const displayName = username || "Guest"

  return (
    <header className="amazon-header">
      <div className="bg-gray-900 py-2 px-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <Link href="/products" className="text-white font-bold text-xl mr-4 whitespace-nowrap">
            ImagineX <span className="text-yellow-400">Deals</span>
          </Link>

          <form onSubmit={handleSearch} className="flex-grow flex max-w-4xl">
            <input
              type="text"
              placeholder="Search products..."
              className="input-field rounded-l-sm rounded-r-none border-r-0 py-1 flex-grow"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="amazon-search px-3 rounded-r-sm">
              <Search className="h-5 w-5" />
            </button>
          </form>

          <div className="flex items-center gap-6 text-white">
            <div className="hidden md:flex flex-col text-xs">
              <span>Hello, {displayName}</span>
              <div className="flex items-center gap-1">
                <button onClick={handleLogout} className="font-bold">
                  Sign Out
                </button>
              </div>
            </div>

            <Link href="/orders" className="hidden md:flex flex-col text-xs">
              <span>Returns</span>
              <span className="font-bold">& Orders</span>
            </Link>

            <Link href="/cart" className="relative flex items-center">
              <ShoppingCart className="h-6 w-6" />
              <span
                className="absolute -top-2 -right-2 bg-yellow-400 text-black text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
                data-testid="cart-count"
              >
                {getCartCount()}
              </span>
              <span className="hidden md:inline ml-1 font-bold">Cart</span>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-gray-800 py-1 px-4">
        <div className="max-w-7xl mx-auto flex items-center text-sm">
          <button className="flex items-center gap-1 px-2 py-1 hover:border border-white">
            <Menu className="h-4 w-4" />
            <span>All</span>
          </button>

          <nav className="flex items-center gap-4 ml-4 overflow-x-auto">
            <Link href="/products" className="px-2 py-1 hover:border border-white whitespace-nowrap">
              Today's Deals
            </Link>
            <Link href="/products" className="px-2 py-1 hover:border border-white whitespace-nowrap">
              Customer Service
            </Link>
            <Link href="/products" className="px-2 py-1 hover:border border-white whitespace-nowrap">
              Registry
            </Link>
            <Link href="/products" className="px-2 py-1 hover:border border-white whitespace-nowrap">
              Gift Cards
            </Link>
            <Link href="/products" className="px-2 py-1 hover:border border-white whitespace-nowrap">
              Sell
            </Link>
          </nav>
        </div>
      </div>
    </header>
  )
}
