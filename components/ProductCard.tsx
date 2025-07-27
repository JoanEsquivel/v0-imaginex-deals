"use client"

import Image from "next/image"
import type { Product } from "@/types"
import { useCart } from "@/context/CartContext"
import { Star, StarHalf } from "lucide-react"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart()

  // Render star ratings
  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 >= 0.5

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`star-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half-star" className="h-4 w-4 fill-yellow-400 text-yellow-400" />)
    }

    const emptyStars = 5 - stars.length
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />)
    }

    return stars
  }

  return (
    <div className="card h-full flex flex-col" data-testid="product-card">
      <div className="relative h-48 mb-4 bg-white p-2">
        <Image src={product.image || "/placeholder.svg"} alt={product.title} fill style={{ objectFit: "contain" }} />
      </div>

      <h3 className="text-base font-medium mb-1 line-clamp-2 flex-grow" data-testid="product-title">
        {product.title}
      </h3>

      <div className="flex items-center mb-1">
        {renderStars(product.rating?.rate || 4)}
        <span className="text-xs text-blue-600 ml-1">
          ({product.rating?.count || Math.floor(Math.random() * 500 + 50)})
        </span>
      </div>

      <div className="flex items-baseline mb-1">
        <span className="text-lg font-medium">$</span>
        <span className="text-xl font-medium">{product.price.toFixed(2)}</span>
      </div>

      {product.prime && (
        <div className="text-xs mb-2">
          <span className="text-blue-500 font-bold">Prime</span> FREE delivery by{" "}
          <span className="font-bold">Tomorrow</span>
        </div>
      )}

      <p className="text-gray-600 text-xs mb-3 line-clamp-2">{product.description}</p>

      <button onClick={() => addToCart(product)} className="btn-primary mt-auto" data-testid="add-to-cart-button">
        Add to Cart
      </button>
    </div>
  )
}
