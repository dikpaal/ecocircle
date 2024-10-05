import Link from 'next/link'
import { ArrowRight, Leaf, Recycle, Users } from 'lucide-react'

import { ElementType } from 'react';

interface FeatureCardProps {
  icon: ElementType;    // React icon component
  title: string;     // Title as a string
  description: string; // Description as a string
}

export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)] bg-[#F0F0F3]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <div className="container mx-auto px-4">
          <section className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-green-800 mb-4">
              Welcome to EcoCircle
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Join our community-driven marketplace for sustainable commerce and upcycling
            </p>
            <Link
              href="/marketplace"
              className="inline-flex items-center bg-green-600 text-white py-3 px-6 rounded-full font-semibold text-lg hover:bg-green-700 transition-colors duration-300"
            >
              Explore Marketplace
              <ArrowRight className="ml-2" />
            </Link>
          </section>

          <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <FeatureCard
              icon={Leaf}
              title="Sustainable Shopping"
              description="Browse eco-friendly products and support sustainable sellers"
            />
            <FeatureCard
              icon={Recycle}
              title="Upcycling Ideas"
              description="Get AI-powered suggestions to breathe new life into old items"
            />
            <FeatureCard
              icon={Users}
              title="Community-Driven"
              description="Connect with like-minded individuals passionate about sustainability"
            />
          </section>

          <section className="bg-white rounded-lg shadow-md p-8 mb-16">
            <h2 className="text-3xl font-bold text-green-800 mb-4">How It Works</h2>
            <ol className="list-decimal list-inside space-y-4 text-gray-700">
              <li>Sign up for an EcoCircle account</li>
              <li>List items you want to sell or get upcycling ideas for</li>
              <li>Receive AI-generated suggestions for sustainable solutions</li>
              <li>Connect with buyers or implement upcycling ideas</li>
              <li>Rate your experience and contribute to the community</li>
            </ol>
          </section>

          <section className="text-center">
            <h2 className="text-3xl font-bold text-green-800 mb-4">
              Ready to join the circular economy?
            </h2>
            <Link
              href="/sell"
              className="inline-flex items-center bg-green-600 text-white py-3 px-6 rounded-full font-semibold text-lg hover:bg-green-700 transition-colors duration-300"
            >
              Get Started
              <ArrowRight className="ml-2" />
            </Link>
          </section>
        </div>
      </main>
    </div>
  )
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center text-center">
      <Icon className="text-green-500 mb-4" size={48} />
      <h3 className="text-xl font-semibold text-green-800 mb-2">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}