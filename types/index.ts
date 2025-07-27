export interface Product {
  id: number
  title: string
  price: number
  description: string
  image: string
  category?: string
  rating?: {
    rate: number
    count: number
  }
  prime?: boolean
}

export interface Order {
  id: string
  date: string
  items: OrderItem[]
  total: number
  shippingAddress: {
    name: string
    email: string
    address: string
  }
  status: "Delivered" | "Shipped" | "Processing"
}

export interface OrderItem {
  id: number
  title: string
  price: number
  image: string
  quantity: number
}
