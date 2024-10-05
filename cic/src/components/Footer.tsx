import { Facebook, Twitter, Instagram } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-green-900 text-white py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">About EcoCircle</h3>
            <p className="text-sm">
              EcoCircle is a GenAI-powered marketplace promoting the circular economy. We connect buyers and sellers
              while providing creative solutions for upcycling and recycling.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a href="/about" className="text-sm hover:text-green-300 transition-colors">About Us</a></li>
              <li><a href="/faq" className="text-sm hover:text-green-300 transition-colors">FAQ</a></li>
              <li><a href="/contact" className="text-sm hover:text-green-300 transition-colors">Contact Us</a></li>
              <li><a href="/terms" className="text-sm hover:text-green-300 transition-colors">Terms of Service</a></li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-green-300 transition-colors">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-green-300 transition-colors">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="#" className="hover:text-green-300 transition-colors">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 text-center text-sm">
          © 2023 EcoCircle. All rights reserved.
        </div>
      </div>
    </footer>
  )
}