"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader, Send, Users, ShoppingBag, Upload } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Progress } from '@/components/ui/progress'

export default function SellerForm() {
  const [step, setStep] = useState(0)
  const [itemDescription, setItemDescription] = useState('')
  const [material, setMaterial] = useState('')
  const [handmadeOrFactory, setHandmadeOrFactory] = useState('')
  const [conditionRating, setConditionRating] = useState('')
  const [image, setImage] = useState(null)
  const [suggestion, setSuggestion] = useState('')
  // const [sustainabilityScore, setSustainabilityScore] = useState(0)
  const [loading, setLoading] = useState(false)

  const handleInitialSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // Simulating API call to GenAI model
    await new Promise(resolve => setTimeout(resolve, 1500))
    setSuggestion(`Based on your item "${itemDescription}" made of ${material}, here's a suggestion:
    
    Consider upcycling your item into a unique piece of eco-friendly decor. For example, if it's a small item, you could transform it into a quirky planter or a decorative wall hanging. If it's larger, consider repurposing it into a functional piece of furniture with a fresh coat of non-toxic paint.
    
    This approach not only extends the life of your item but also adds a personal touch to your living space while reducing waste.`)
    
    // const score = calculateSustainabilityScore()
    // setSustainabilityScore(score)
    setLoading(false)
  }

  // const calculateSustainabilityScore = () => {
  //   let score = 0
  //   score += ['bamboo', 'organic cotton', 'recycled plastic'].includes(material.toLowerCase()) ? 30 : 20
  //   score += parseInt(conditionRating) * 5
  //   score += handmadeOrFactory === 'handmade' ? 20 : 10
  //   return Math.min(score, 100) // Cap the score at 100
  // }

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const retrieveBuyersDataset = async () => {
    try {
      const response = await fetch("https://5uq5nzn4g3.execute-api.us-west-2.amazonaws.com/v1", {
        method: 'GET',
      });
      if (!response.ok) {
        throw new Error(`HTTP error status ${response.status}`);
      }
      const data = await response.json();
      console.log(data);
    } catch (err) {
      console.error('Error:', err);
    }
  }
  const invokeGPI = async (itemDescription: string, material: string, handmadeOrFactory: string, conditionRating: string) => {
    try {
      setLoading(true)
      const response = await fetch("https://t82xtz22cc.execute-api.us-west-2.amazonaws.com/v1", { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',  // Ensure correct header for JSON
        },
        body: JSON.stringify({
          desc: itemDescription.toString(),
          material: material.toString(),
          handmade: handmadeOrFactory.toString(),
          condition: conditionRating.toString(),  
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);
      const parsedBody = JSON.parse(data.body);
      setLoading(false);
      setSuggestion(`Based on your preference for "${itemDescription}", here's a suggestion:
      ${parsedBody.result} `);
      setStep(1);
      console.log(parsedBody.result);
    } catch (err) {
      console.error('Error:', err);
    }
  };

  const potentialBuyers = [
    { id: 1, name: 'Alice Green', avatar: '/placeholder.svg?height=40&width=40', offer: 45 },
    { id: 2, name: 'Bob Eco', avatar: '/placeholder.svg?height=40&width=40', offer: 50 },
    { id: 3, name: 'Carol Sustain', avatar: '/placeholder.svg?height=40&width=40', offer: 55 },
  ]

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <form onSubmit={handleInitialSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="itemDescription">Describe your item</Label>
              <Textarea
                id="itemDescription"
                placeholder="e.g., An old wooden chair with intricate carvings"
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="material">Material</Label>
              <Input
                id="material"
                placeholder="e.g., Oak wood, Bamboo, Recycled plastic"
                value={material}
                onChange={(e) => setMaterial(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Handmade or Factory-made</Label>
              <RadioGroup value={handmadeOrFactory} onValueChange={setHandmadeOrFactory}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="handmade" id="handmade" />
                  <Label htmlFor="handmade">Handmade</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="factory" id="factory" />
                  <Label htmlFor="factory">Factory-made</Label>
                </div>
              </RadioGroup>
            </div>
            <div className="space-y-2">
              <Label htmlFor="conditionRating">Condition Rating (1-10)</Label>
              <Input
                id="conditionRating"
                type="number"
                min="1"
                max="10"
                value={conditionRating}
                onChange={(e) => setConditionRating(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Upload an image of your item</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                required
              />
              {image && (
                <div className="mt-2">
                  <img src={image} alt="Uploaded item" className="max-w-full h-auto rounded-md" />
                </div>
              )}
            </div>
            <Button type="submit" disabled={loading} className="w-full" onClick={() => {
            invokeGPI(itemDescription, material, handmadeOrFactory, conditionRating)           }}>
              {loading ? <Loader className="animate-spin mr-2" /> : <Send className="mr-2" />}
              {loading ? 'Generating Suggestion...' : 'Get Suggestion'}
            </Button>
          </form>
        )
      case 1:
        return (
          <div className="space-y-4">
            <div className="p-4 bg-secondary rounded-md">
              <h3 className="text-lg font-semibold mb-2">AI Suggestion</h3>
              <p className="whitespace-pre-line">{suggestion}</p>
            </div>
            <div className="p-4 bg-secondary rounded-md">
              <h3 className="text-lg font-semibold mb-2">Sustainability Score</h3>
              {/* <Progress value={sustainabilityScore} className="w-full" /> */}
              <p className="mt-2 text-sm text-muted-foreground">
                {/* Your item's sustainability score: {sustainabilityScore}/100 */}
              </p>
            </div>
            <h3 className="text-lg font-semibold">Potential Buyers</h3>
            {potentialBuyers.map((buyer) => (
              <Card key={buyer.id}>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center space-x-4">
                    <Avatar>
                      <AvatarImage src={buyer.avatar} alt={buyer.name} />
                      <AvatarFallback>{buyer.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{buyer.name}</p>
                      <p className="text-sm text-muted-foreground">Offer: ${buyer.offer}</p>
                    </div>
                  </div>
                  <Button variant="outline" onClick={() => setStep(2)}>Accept Offer</Button>
                </CardContent>
              </Card>
            ))}
            <Button className="w-full" variant="secondary" onClick={() => setStep(3)}>
              <ShoppingBag className="mr-2" />
              Publish on Marketplace
            </Button>
          </div>
        )
      case 2:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Offer Accepted</h3>
            <p>Congratulations! Your offer has been accepted. The buyer will be in touch with you soon to arrange the transaction.</p>
            <Button onClick={() => setStep(0)} className="w-full">List Another Item</Button>
          </div>
        )
      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Publish on Marketplace</h3>
            <p>Your item has been successfully published on the EcoCircle Marketplace.</p>
            <p>Potential buyers will be able to see your listing and make offers.</p>
            <Button onClick={() => setStep(0)} className="w-full">List Another Item</Button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Sell or Upcycle Your Item</CardTitle>
          <CardDescription>Get AI-powered suggestions for your items</CardDescription>
        </CardHeader>
        <CardContent>
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </CardContent>
      </Card>
    </div>
  )
}