import Link from 'next/link'
import { Leaf, ShoppingBag, User } from 'lucide-react'

export default function Header() {
  return (
    <header className="bg-green-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <Leaf className="h-8 w-8" />
          <span className="text-2xl font-bold">EcoCircle</span>
        </Link>
        <nav className="space-x-4">
          <Link href="/marketplace" className="hover:text-green-300 transition-colors">
            Marketplace
          </Link>
          <Link href="/sell" className="hover:text-green-300 transition-colors">
            Sell/Upcycle
          </Link>
          <Link href="/dashboard" className="hover:text-green-300 transition-colors">
            Dashboard
          </Link>
        </nav>
        <div className="flex items-center space-x-4">
          <Link href="/cart" className="hover:text-green-300 transition-colors">
            <ShoppingBag className="h-6 w-6" />
          </Link>
          <Link href="/profile" className="hover:text-green-300 transition-colors">
            <User className="h-6 w-6" />
          </Link>
        </div>
      </div>
    </header>
  )
}