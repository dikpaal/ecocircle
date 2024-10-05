'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, Leaf } from 'lucide-react'

const items = [
  { id: 1, name: 'Upcycled Wooden Pallet Coffee Table', price: 150, sustainability: 95 },
  { id: 2, name: 'Recycled Plastic Bottle Planters', price: 25, sustainability: 90 },
  { id: 3, name: 'Repurposed Denim Tote Bag', price: 45, sustainability: 85 },
  { id: 4, name: 'Eco-friendly Bamboo Cutlery Set', price: 20, sustainability: 100 },
  { id: 5, name: 'Reclaimed Wood Picture Frames', price: 35, sustainability: 92 },
  { id: 6, name: 'Solar-powered LED Garden Lights', price: 60, sustainability: 98 },
]

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sustainabilityFilter, setSustainabilityFilter] = useState(0)

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    item.sustainability >= sustainabilityFilter
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-800 mb-6">EcoCircle Marketplace</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-grow">
          <div className="relative">
            <input
              type="text"
              placeholder="Search items..."
              className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>
        <div className="w-full md:w-64">
          <div className="relative">
            <select
              className="w-full p-2 pl-10 border border-gray-300 rounded-md focus:ring-green-500 focus:border-green-500 appearance-none"
              value={sustainabilityFilter}
              onChange={(e) => setSustainabilityFilter(Number(e.target.value))}
            >
              <option value={0}>All Sustainability</option>
              <option value={80}>80% and above</option>
              <option value={90}>90% and above</option>
              <option value={95}>95% and above</option>
            </select>
            <Filter className="absolute left-3 top-2.5 text-gray-400" />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-md overflow-hidden"
          >
            <div className="p-4">
              <h2 className="text-xl font-semibold text-green-800 mb-2">{item.name}</h2>
              <p className="text-gray-600 mb-4">${item.price}</p>
              <div className="flex items-center">
                <Leaf className="text-green-500 mr-2" />
                <span className="text-sm font-medium text-green-600">
                  Sustainability Score: {item.sustainability}%
                </span>
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="w-full bg-green-600 text-white py-2 px-4 hover:bg-green-700 transition-colors duration-300"
            >
              View Details
            </motion.button>
          </motion.div>
        ))}
      </div>
    </div>
  )
}