"use client"
import Image from "next/image"
import Link from "next/link"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useCart } from "@/context/CartContext"
import { format } from "date-fns"

export default function OrdersPage() {
  const { orders } = useCart()

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#EAEDED] flex flex-col">
        <Header />

        <main className="max-w-4xl mx-auto py-4 px-4 flex-grow">
          <h1 className="text-2xl font-medium mb-4">Your Orders</h1>

          {orders.length === 0 ? (
            <div className="bg-white p-8 text-center rounded-sm">
              <p className="text-lg text-gray-600 mb-4">You haven't placed any orders yet</p>
              <Link href="/products" className="btn-primary">
                Browse Products
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((order) => (
                <div key={order.id} className="bg-white p-4 rounded-sm" data-testid="order-item">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-b pb-4 mb-4">
                    <div>
                      <div className="text-xs text-gray-500">ORDER PLACED</div>
                      <div className="text-sm">{format(new Date(order.date), "MMM d, yyyy")}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">TOTAL</div>
                      <div className="text-sm">${order.total.toFixed(2)}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">SHIP TO</div>
                      <div className="text-sm truncate">{order.shippingAddress.name}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500">ORDER # {order.id.slice(0, 8)}</div>
                      <div className="text-sm text-blue-600">View order details</div>
                    </div>
                  </div>

                  <div className="mb-2">
                    <div className="text-lg font-medium text-green-700">{order.status}</div>
                  </div>

                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={`${order.id}-${item.id}`} className="flex gap-4">
                        <div className="relative w-20 h-20 flex-shrink-0">
                          <Image
                            src={item.image || "/placeholder.svg"}
                            alt={item.title}
                            fill
                            style={{ objectFit: "contain" }}
                          />
                        </div>
                        <div>
                          <h3 className="font-medium line-clamp-1">{item.title}</h3>
                          <div className="text-sm text-gray-600">
                            ${item.price.toFixed(2)} x {item.quantity}
                          </div>
                          <Link href="/products" className="text-sm text-blue-600">
                            Buy it again
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>

        <Footer />
      </div>
    </ProtectedRoute>
  )
}
