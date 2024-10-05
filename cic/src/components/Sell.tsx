"use client"

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

export default function SellerForm() {
  const [itemDescription, setItemDescription] = useState('')
  const [sustainabilityOption, setSustainabilityOption] = useState('')
  const [suggestion, setSuggestion] = useState('')
  const [loading, setLoading] = useState(false)
                        
  const invokeGPI = async (handleOption: string, itemDescription: string) => {
    try {
      const response = await fetch("https://t82xtz22cc.execute-api.us-west-2.amazonaws.com/v1", { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',  // Ensure correct header for JSON
        },
        body: JSON.stringify({
          description: itemDescription,  // Item description passed to API
        }),
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      console.log(data);
      return data;
    } catch (err) {
      console.error('Error:', err);
    }
  };
    const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulating API call to GenAI model
    await new Promise(resolve => setTimeout(resolve, 1500))
    setSuggestion(`Based on your ${sustainabilityOption} preference for "${itemDescription}", here's a suggestion:
    
    Transform your item into a unique piece of eco-friendly art. Use non-toxic paints to create a vibrant design, then mount it on a reclaimed wood frame. This upcycled creation can serve as a decorative wall piece or even a functional item like a serving tray.`)
    setLoading(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle>Sell or Upcycle Your Item</CardTitle>
          <CardDescription>Get AI-powered suggestions for your items</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="itemDescription">Describe your item</Label>
              <Textarea
                id="itemDescription"
                placeholder="e.g., An old wooden chair with a broken leg"
                value={itemDescription}
                onChange={(e) => setItemDescription(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sustainabilityOption">Sustainability Option</Label>
              <Select value={sustainabilityOption} onValueChange={setSustainabilityOption}>
                <SelectTrigger>
                  <SelectValue placeholder="Select an option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="upcycling">Upcycling</SelectItem>
                  <SelectItem value="recycling">Recycling</SelectItem>
                  <SelectItem value="reusing">Reusing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={loading} className="w-full" onClick={() => invokeGPI(sustainabilityOption, itemDescription)}>
              {loading ? <Loader className="animate-spin mr-2" /> : <Send className="mr-2" />}
              {loading ? 'Generating Suggestion...' : 'Get Suggestion'}
            </Button>
          </form>
          {suggestion && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 p-4 bg-secondary rounded-md"
            >
              <h3 className="text-lg font-semibold mb-2">AI Suggestion</h3>
              <p className="whitespace-pre-line">{suggestion}</p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}