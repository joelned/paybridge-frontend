import React from 'react';
import { GitMerge, Link2, BarChart3, RefreshCw, Shield, Zap, ArrowRight } from 'lucide-react';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const features = [
    { 
      icon: GitMerge, 
      title: 'Payment Orchestration', 
      description: 'Route payments intelligently across multiple providers with automatic failover'
    },
    { 
      icon: Link2, 
      title: 'Single Integration', 
      description: 'One API to rule them all - connect once, accept payments from everywhere'
    },
    { 
      icon: BarChart3, 
      title: 'Unified Analytics', 
      description: 'Cross-provider insights and reporting in one beautiful dashboard'
    },
    { 
      icon: RefreshCw, 
      title: 'Auto Reconciliation', 
      description: 'Automatically match and reconcile transactions across all providers'
    },
    { 
      icon: Shield, 
      title: 'Idempotency Built-in', 
      description: 'Prevent duplicate payments with enterprise-grade idempotency handling'
    },
    { 
      icon: Zap, 
      title: 'Smart Routing', 
      description: 'Optimize for success rates, fees, or speed with intelligent routing rules'
    }
  ];

const providers = [
  { 
    name: 'Stripe', 
    logo: 'https://logo.clearbit.com/stripe.com', 
    color: '#635BFF' 
  },
  { 
    name: 'PayPal', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg', 
    color: '#00457C' 
  },
  { 
    name: 'Flutterwave', 
    logo: 'https://upload.wikimedia.org/wikipedia/commons/9/9e/Flutterwave_Logo.png', 
    color: '#F5A623' 
  },
  { 
    name: 'Paystack', 
    logo: 'https://static.cdnlogo.com/logos/p/27/paystack.svg', 
    color: '#00C3F7' 
  },
];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
              <GitMerge className="text-white" size={24} />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              PayBridge
            </span>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={() => onNavigate('login')}>Login</Button>
            <Button onClick={() => onNavigate('register')}>Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 text-center">
        <div className="mb-6">
          <span className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
            🚀 Payment Orchestration Platform
          </span>
        </div>
        <h1 className="text-6xl font-bold text-gray-900 mb-6">
          One Integration,
          <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Infinite Possibilities
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          PayBridge orchestrates payments across multiple providers, giving you smart routing, unified analytics, 
          automatic reconciliation, and bulletproof idempotency—all through a single, elegant API.
        </p>
        <div className="flex gap-4 justify-center">
          <Button size="lg" onClick={() => onNavigate('register')} icon={ArrowRight}>
            Start Free Trial
          </Button>
          <Button size="lg" variant="outline">View Documentation</Button>
        </div>

        {/* Provider Logos */}
      <div className="mt-16">
  <p className="text-sm text-gray-600 mb-6">Supports all major payment providers</p>
  <div className="flex flex-wrap justify-center gap-4">
    {providers.map((provider, idx) => (
      <div
        key={idx}
        className="flex items-center gap-3 px-5 py-3 bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all"
      >
        <img
          src={provider.logo}
          alt={provider.name}
          className="w-8 h-8 object-contain"
        />
        <span className="font-medium text-gray-700">{provider.name}</span>
      </div>
    ))}
  </div>
</div>

      </section>

      {/* Features Grid */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-4">
          Everything You Need to Orchestrate Payments
        </h2>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          Stop juggling multiple payment integrations. PayBridge unifies everything into one powerful platform.
        </p>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <Card key={idx} hover className="p-6">
              <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <feature.icon className="text-indigo-600" size={24} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <Card className="p-12 bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Orchestrate Payments?</h2>
          <p className="text-indigo-100 mb-8">Join businesses optimizing their payment stack with PayBridge</p>
          <Button size="lg" variant="secondary" onClick={() => onNavigate('register')}>
            Create Your Account
          </Button>
        </Card>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm text-gray-600">
          <p>© 2024 PayBridge. Payment orchestration made simple.</p>
        </div>
      </footer>
    </div>
  );
};