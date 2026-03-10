import React from 'react';
import { GitMerge, Link2, BarChart3, Shield, Zap, ArrowRight, ServerCog } from 'lucide-react';
import paybridgeLogo from '../../assets/paybridge_logo_compact.png';
import paystackLogo from '../../assets/paystack_logo.webp';
import { Button } from '../../components/common/Button';
import { Card } from '../../components/common/Card';
import { Container } from '../../components/layout/Container';
import { SectionHeader } from '../../components/section/SectionHeader';

interface LandingPageProps {
  onNavigate: (page: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const currentYear = new Date().getFullYear();
  const features = [
    { 
      icon: GitMerge, 
      title: 'Unified Payment API', 
      description: 'Create checkout payments through one endpoint across multiple providers'
    },
    { 
      icon: Link2, 
      title: 'Provider Routing', 
      description: 'Choose a provider explicitly or let PayBridge route using your enabled configurations'
    },
    { 
      icon: BarChart3, 
      title: 'Merchant Analytics', 
      description: 'Track payment volume, status breakdown, and provider-level performance from one API'
    },
    {
      icon: ServerCog,
      title: 'API Key + Auth Flows',
      description: 'Use API keys for payment requests and dashboard auth for merchant operations'
    },
    { 
      icon: Shield, 
      title: 'Idempotency Protection', 
      description: 'Prevent duplicate charges safely with idempotency keys on payment requests'
    },
    { 
      icon: Zap, 
      title: 'Webhooks + Verification', 
      description: 'Receive provider webhooks with signature verification and deduplication'
    }
  ];

const providers = [
  { 
    name: 'Stripe', 
    mark: 'S',
    color: '#635BFF' 
  },
  {
    name: 'Paystack', 
    mark: 'P',
    color: '#00C3F7',
    logo: paystackLogo
  },
];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="bg-white/70 backdrop-blur supports-[backdrop-filter]:bg-white/60 border-b border-gray-200 sticky top-0 z-50">
        <Container className="py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center rounded-lg bg-white/90 border border-gray-200 h-12 sm:h-14 px-2.5 sm:px-3 shadow-sm">
            <img src={paybridgeLogo} alt="PayBridge" className="h-8 sm:h-10 w-auto object-contain" />
          </div>
          <div className="flex gap-2 sm:gap-3">
            <Button variant="ghost" onClick={() => onNavigate('login')}>Login</Button>
            <Button onClick={() => onNavigate('register')}>Get Started</Button>
          </div>
        </Container>
      </nav>

      {/* Hero Section */}
      <section className="py-16 sm:py-20 text-center">
        <Container>
        <div className="mb-6">
          <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-indigo-100 text-indigo-700 rounded-full text-xs sm:text-sm font-medium">
            🚀 Payment Orchestration Platform
          </span>
        </div>
        <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6 tracking-tight">
          One Integration,
          <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Infinite Possibilities
          </span>
        </h1>
        <p className="text-base sm:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
          PayBridge connects merchants to multiple payment providers through one simple integration.
        </p>
        <div className="flex gap-3 sm:gap-4 justify-center">
          <Button size="lg" onClick={() => onNavigate('register')} icon={ArrowRight}>
            Get Started
          </Button>
          <Button size="lg" variant="outline" onClick={() => onNavigate('docs')}>View Documentation</Button>
        </div>

        {/* Provider Logos */}
        <div className="mt-12 sm:mt-16">
          <p className="text-xs sm:text-sm text-gray-600 mb-4 sm:mb-6">Current provider support</p>
          <div className="grid grid-cols-2 gap-3 sm:gap-3 place-items-center max-w-md mx-auto">
            {providers.map((provider, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3 px-4 sm:px-5 py-2.5 sm:py-3 bg-white/90 backdrop-blur rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all"
              >
                <span
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs sm:text-sm"
                  style={{ backgroundColor: provider.color }}
                  aria-hidden="true"
                >
                  {provider.logo ? (
                    <img
                      src={provider.logo}
                      alt={`${provider.name} logo`}
                      className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
                    />
                  ) : (
                    provider.mark
                  )}
                </span>
                <span className="font-medium text-gray-700 text-sm">{provider.name}</span>
              </div>
            ))}
          </div>
        </div>

        </Container>
      </section>

      {/* Features Grid */}
      <section className="py-16 sm:py-20">
        <Container>
          <SectionHeader
            title="Everything You Need to Orchestrate Payments"
            subtitle="Built for merchants who need reliable payments, smooth operations, and clear insights."
            className="text-center mb-10 sm:mb-12"
          />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, idx) => (
              <Card key={idx} hover padding="lg" variant="soft" className="">
                <div className="w-11 h-11 sm:w-12 sm:h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                  <feature.icon className="text-indigo-600" size={24} />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1.5 sm:mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
              </Card>
            ))}
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-16 sm:py-20">
        <Container className="max-w-4xl">
          <Card padding="lg" className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white text-center ring-1 ring-white/10">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">Ready to Integrate PayBridge?</h2>
          <p className="text-indigo-100 mb-6 sm:mb-8">Create a merchant account, connect your providers, and start creating payments.</p>
          <Button size="lg" variant="secondary" onClick={() => onNavigate('register')}>
            Create Your Account
          </Button>
          </Card>
        </Container>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8">
        <Container>
          <div className="text-center text-sm text-gray-600">
            <p>© {currentYear} PayBridge. Payment orchestration made simple.</p>
          </div>
        </Container>
      </footer>
    </div>
  );
};
