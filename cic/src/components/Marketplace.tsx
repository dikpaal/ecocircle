"use client"

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Search, Filter, Leaf, ShoppingCart } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import coffeeImage from '../images/coffee.jpg';
import recycled_bottles from '../images/recycled_bottles.jpg';
import denimTote from '../images/denimTote.jpg';
import lamps from '../images/Lamps.webp';
import cutlery from '../images/cutlery.webp';
import wooden_pictures from '../images/wooden_pictures.webp';

const AWS = require('aws-sdk');

AWS.config.update({ region: 'us-west-2' });  // Change the region to your S3 bucket's region

const s3 = new AWS.S3();


const items = [
  { 
    id: 1, 
    name: 'Upcycled Wooden Pallet Coffee Table', 
    price: 150, 
    sustainability: 95,
    description: 'Handcrafted coffee table made from reclaimed wooden pallets. Each piece is unique and adds rustic charm to any living space.',
    image: coffeeImage
  },
  { 
    id: 2, 
    name: 'Recycled Plastic Bottle Planters', 
    price: 25, 
    sustainability: 90,
    description: 'Set of 3 colorful planters made from recycled plastic bottles. Perfect for small herbs or succulents.',
    image: recycled_bottles
  },
  { 
    id: 3, 
    name: 'Repurposed Denim Tote Bag', 
    price: 45, 
    sustainability: 85,
    description: 'Stylish and durable tote bag made from repurposed denim jeans. Features internal pockets and a magnetic closure.',
    image: denimTote
  },
  { 
    id: 4, 
    name: 'Eco-friendly Bamboo Cutlery Set', 
    price: 20, 
    sustainability: 100,
    description: 'Portable cutlery set made from sustainable bamboo. Includes fork, knife, spoon, and chopsticks in a convenient carry case.',
    image: cutlery
  },
  { 
    id: 5, 
    name: 'Reclaimed Wood Picture Frames', 
    price: 35, 
    sustainability: 92,
    description: 'Set of 2 rustic picture frames crafted from reclaimed barn wood. Each frame tells a unique story.',
    image: wooden_pictures
  },
  { 
    id: 6, 
    name: 'Solar-powered LED Garden Lights', 
    price: 60, 
    sustainability: 98,
    description: 'Pack of 4 solar-powered LED lights for your garden or patio. Charges during the day and illuminates your outdoor space at night.',
    image: lamps
  },
]

export default function Marketplace() {
  const [searchTerm, setSearchTerm] = useState('')
  const [sustainabilityFilter, setSustainabilityFilter] = useState('0')

  const filteredItems = items.filter(item =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
    item.sustainability >= parseInt(sustainabilityFilter)
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">EcoCircle Marketplace</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-grow">
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search items..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="w-full md:w-64">
          <Select value={sustainabilityFilter} onValueChange={setSustainabilityFilter}>
            <SelectTrigger>
              <SelectValue placeholder="Filter by sustainability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">All Sustainability</SelectItem>
              <SelectItem value="80">80% and above</SelectItem>
              <SelectItem value="90">90% and above</SelectItem>
              <SelectItem value="95">95% and above</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="h-full flex flex-col">
              <CardHeader>
                <Image
                  src={item.image}
                  alt={item.name}
                  width={300}
                  height={200}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <CardTitle className="mt-4">{item.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow">
                <p className="text-2xl font-bold mb-2">${item.price}</p>
                <div className="flex items-center mb-4">
                  <Leaf className="text-green-600 mr-2" />
                  <span className="text-sm font-medium">
                    Sustainability Score: {item.sustainability}%
                  </span>
                </div>
                <p className="text-muted-foreground line-clamp-3">{item.description}</p>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline">View Details</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{item.name}</DialogTitle>
                      <DialogDescription>
                        <Image
                          src={item.image}
                          alt={item.name}
                          width={400}
                          height={300}
                          className="w-full h-64 object-cover rounded-lg mb-4"
                        />
                        <p className="text-lg font-bold mb-2">${item.price}</p>
                        <Badge variant="secondary" className="mb-4">
                          Sustainability Score: {item.sustainability}%
                        </Badge>
                        <p className="text-muted-foreground mb-4">{item.description}</p>
                        <Button className="w-full">
                          <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                        </Button>
                      </DialogDescription>
                    </DialogHeader>
                  </DialogContent>
                </Dialog>
                <Button>
                  <ShoppingCart className="mr-2 h-4 w-4" /> Add to Cart
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}