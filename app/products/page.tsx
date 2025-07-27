"use client"

import { useState } from "react"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ProductCard from "@/components/ProductCard"
import ProtectedRoute from "@/components/ProtectedRoute"
import { products } from "@/data/products"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function ProductsPage() {
  const [currentPage, setCurrentPage] = useState(1)
  const productsPerPage = 9

  // Calculate pagination
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(products.length / productsPerPage)

  // Generate page numbers
  const pageNumbers = []
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#EAEDED] flex flex-col">
        <Header />

        <div className="max-w-7xl mx-auto px-4 py-4 flex-grow">
          <div className="flex flex-wrap gap-2 mb-4">
            <div className="bg-white p-3 rounded-sm text-sm w-full md:w-auto">
              <span className="font-bold">Department:</span> All Products
            </div>
            <div className="bg-white p-3 rounded-sm text-sm w-full md:w-auto">
              <span className="font-bold">Filter by:</span> All Items
            </div>
          </div>

          <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </main>

          {/* Pagination */}
          <div className="flex justify-center mt-8 mb-4">
            <div className="flex items-center">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="pagination-btn rounded-l-sm"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>

              {pageNumbers.map((number) => (
                <button
                  key={number}
                  onClick={() => setCurrentPage(number)}
                  className={currentPage === number ? "pagination-btn-active" : "pagination-btn"}
                >
                  {number}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="pagination-btn rounded-r-sm"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </ProtectedRoute>
  )
}
