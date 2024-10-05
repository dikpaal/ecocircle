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
  const sustainabilityScore = 60
  const [loading, setLoading] = useState(false)
  const [sellerName, setSellerName] = useState('')
  const [price, setPrice] = useState('')

  const generateRandomId = () => {
    const timestamp = Date.now().toString(36);
    const randomStr = Math.random().toString(36).substring(2, 8);
    return `${timestamp}-${randomStr}`;
  };

  const sellerId = generateRandomId();

  const handleInitialSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    // Simulating API call to GenAI model
    await new Promise(resolve => setTimeout(resolve, 1500))
    // setSuggestion(`Based on your item "${itemDescription}" made of ${material}, here's a suggestion: ${modelSuggestion}`)
    
    const score = calculateSustainabilityScore()
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

  const calculateSustainabilityScore = () => {
    let score = 0;
  
    // Materials scoring
    const materialScore = ['bamboo', 'organic cotton', 'recycled plastic'].includes(material.toLowerCase()) ? 30 : 20;
    score += materialScore;
  
    // Condition rating (scale it and add a random factor to skew towards higher values)
    const randomConditionBoost = Math.random() * 2 + 3; // Random factor between 3 and 5
    const conditionScore = parseInt(conditionRating) * randomConditionBoost;
    score += conditionScore;
  
    // Handmade or factory scoring with a slight random variation
    const handmadeScore = handmadeOrFactory === 'handmade' ? 20 + Math.random() * 5 : 10 + Math.random() * 5;
    score += handmadeScore;
  
    // Cap and randomize final score with bias towards higher values
    const randomnessFactor = Math.random() * 10 + 90; // Random value between 90 and 100
    const finalScore = Math.min(score, randomnessFactor);
  
    return Math.min(finalScore, 100); // Cap score at 100
  };
  
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
      const parsedBody = JSON.parse(data.body);
      setLoading(false);
      setSuggestion(`Based on your item "${itemDescription}" made of ${material}, here's a suggestion:
      ${parsedBody.result.split('\n')} `);
      setStep(1)
      console.log(parsedBody.result);
    } catch (err) {
      console.error('Error:', err);
    }
  };
    const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    // Simulating API call to GenAI model
    await new Promise(resolve => setTimeout(resolve, 1500))
    setLoading(false)
  }

  const potentialBuyers = [
    { id: 1, name: 'Alice Green', avatar: '/placeholder.svg?height=40&width=40', offer: 45 },
    { id: 2, name: 'Bob Eco', avatar: '/placeholder.svg?height=40&width=40', offer: 50 },
    { id: 3, name: 'Carol Sustain', avatar: '/placeholder.svg?height=40&width=40', offer: 55 },
  ]

  const publishToMarketplace = async () => {
    try {
      const response = await fetch("https://kxo7vlqqf3.execute-api.us-west-2.amazonaws.com/v1", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Seller_id: sellerId,
          name: sellerName,
          description: itemDescription,
          image: image,
          price: price
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const result = await response.json();
      console.log("Item published successfully:", result);
      setStep(3);  // Move to the "Published" step
    } catch (error) {
      console.error("Error publishing item:", error);
      // Handle the error appropriately (e.g., show an error message to the user)
    }
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <form onSubmit={handleInitialSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sellerId">Seller ID</Label>
              <Input
                id="sellerId"
                value={sellerId}
                readOnly
              />
              <p className="text-sm text-muted-foreground">This is your unique seller ID.</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sellerName">Your Name</Label>
              <Input
                id="sellerName"
                placeholder="Enter your name"
                value={sellerName}
                onChange={(e) => setSellerName(e.target.value)}
                required
              />
            </div>
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
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                type="number"
                placeholder="Enter the price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
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
              invokeGPI(itemDescription, material, handmadeOrFactory, conditionRating);
            }}>
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
              <Progress value={sustainabilityScore} className="w-full" />
              <p className="mt-2 text-sm text-muted-foreground">
                Your item's sustainability score: {sustainabilityScore}/100
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
            <Button className="w-full" variant="secondary" onClick={publishToMarketplace}>
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