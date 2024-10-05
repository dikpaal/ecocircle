'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { BarChart, DollarSign, Leaf, Package } from 'lucide-react'
import { ReactNode, FC, ElementType } from 'react';

interface TabButtonProps {
  children: ReactNode;   // For rendering the content inside the button
  active: boolean;       // Boolean to indicate if the tab is active
  onClick: () => void;   // Function to handle the click event
}

interface StatCardProps {
    icon: ElementType;   // Icon component type
    title: string;       // Title as a string
    value: string | number;  // Value can be a string or number
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('overview')

  const userStats = {
    itemsSold: 15,
    itemsUpcycled: 8,
    sustainabilityScore: 92,
    earnings: 450,
  }

  const recentActivity = [
    { id: 1, action: 'Sold', item: 'Upcycled Wooden Pallet Coffee Table', date: '2023-06-15' },
    { id: 2, action: 'Upcycled', item: 'Old Denim Jeans', date: '2023-06-12' },
    { id: 3, action: 'Bought', item: 'Recycled Plastic Bottle Planters', date: '2023-06-10' },
  ]

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-green-800 mb-6">Your EcoCircle Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Package} title="Items Sold" value={userStats.itemsSold} />
        <StatCard icon={Leaf} title="Items Upcycled" value={userStats.itemsUpcycled} />
        <StatCard icon={BarChart} title="Sustainability Score" value={`${userStats.sustainabilityScore}%`} />
        <StatCard icon={DollarSign} title="Total Earnings" value={`$${userStats.earnings}`} />
      </div>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex border-b">
          <TabButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
            Overview
          </TabButton>
          <TabButton active={activeTab === 'listings'} onClick={() => setActiveTab('listings')}>
            Your Listings
          </TabButton>
          <TabButton active={activeTab === 'activity'} onClick={() => setActiveTab('activity')}>
            Recent Activity
          </TabButton>
        </div>
        <div className="p-6">
          {activeTab === 'overview' && (
            <div>
              <h2 className="text-xl font-semibold text-green-800 mb-4">Welcome back!</h2>
              <p className="text-gray-600">
                Your sustainability efforts are making a difference. Keep up the great work in promoting the circular economy!
              </p>
            </div>
          )}
          {activeTab === 'listings' && (
            <div>
              <h2 className="text-xl font-semibold text-green-800 mb-4">Your Active Listings</h2>
              <p className="text-gray-600">You currently have 3 active listings in the marketplace.</p>
            </div>
          )}
          {activeTab === 'activity' && (
            <div>
              <h2 className="text-xl font-semibold text-green-800 mb-4">Recent Activity</h2>
              <ul className="space-y-4">
                {recentActivity.map((activity) => (
                  <li key={activity.id} className="flex justify-between items-center border-b pb-2">
                    <div>
                      <p className="font-medium text-green-700">{activity.action}: {activity.item}</p>
                      <p className="text-sm text-gray-500">{activity.date}</p>
                    </div>
                    <Leaf className="text-green-500" />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const StatCard: FC<StatCardProps> = ({ icon: Icon, title, value }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-lg shadow-md p-6 flex items-center"
    >
      <Icon className="text-green-500 mr-4" size={24} />
      <div>
        <h2 className="text-sm font-medium text-gray-500">{title}</h2>
        <p className="text-2xl font-bold text-green-800">{value}</p>
      </div>
    </motion.div>
  )
}

const TabButton: FC<TabButtonProps> = ({ children, active, onClick }) => {
  return (
    <button
      className={`flex-1 py-3 px-4 text-center font-medium ${
        active ? 'bg-green-50 text-green-800 border-b-2 border-green-500' : 'text-gray-500 hover:text-green-800'
      }`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}