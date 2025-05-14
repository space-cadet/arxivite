import React, { useState, useEffect, ReactNode } from 'react';
import { ArrowRight, BookMarked, Search, Sparkles, Menu, X } from 'lucide-react';
import { LogoIcon } from '@/components/icons/LogoIcon';
import { Link } from 'react-router-dom';

// Floating Orb Component
interface FloatingOrbProps {
  size: string;
  color: string;
  duration: string;
  delay: string;
  top: string;
  left: string;
}

const FloatingOrb: React.FC<FloatingOrbProps> = ({ size, color, duration, delay, top, left }) => (
  <div 
    className="absolute rounded-full blur-3xl opacity-30 animate-float mix-blend-plus-lighter"
    style={{
      width: size,
      height: size,
      background: color,
      animationDuration: duration,
      animationDelay: delay,
      top: top,
      left: left,
      pointerEvents: 'none'
    }}
  />
);

// Background Grid
const BackgroundGrid = () => (
  <div className="absolute inset-0 overflow-hidden">
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#080808_1px,transparent_1px),linear-gradient(to_bottom,#080808_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-30" />
  </div>
);

interface FadeInProps {
  children: ReactNode;
  delay?: number;
}

const FadeIn: React.FC<FadeInProps> = ({ children, delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`transition-all duration-1000 transform ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      {children}
    </div>
  );
};

interface FeatureCardProps {
  icon: React.FC<{ className?: string }>;
  title: string;
  description: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon: Icon, title, description, delay }) => (
  <FadeIn delay={delay}>
    <div className="p-6 rounded-xl bg-white/5 backdrop-blur-lg border border-white/10 hover:border-white/20 transition-all duration-300 hover:transform hover:-translate-y-1">
      <Icon className="w-8 h-8 mb-4 text-blue-400" />
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </div>
  </FadeIn>
);

const LandingPage = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#0A0A1B] to-[#0F0F2D] text-white relative overflow-hidden">
      {/* Animated Background */}
      <BackgroundGrid />
      
      {/* Animated Gradient Orbs */}
      {/* Noise texture */}
      <div className="absolute inset-0 opacity-20" style={{ 
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 2000 2000' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        backgroundSize: '200px 200px'
      }} />

      <FloatingOrb
        size="45rem"
        color="radial-gradient(circle, rgba(59,130,246,0.4) 0%, rgba(37,99,235,0.1) 50%, transparent 70%)"
        duration="25s"
        delay="0s"
        top="-20%"
        left="-10%"
      />
      <FloatingOrb
        size="40rem"
        color="radial-gradient(circle, rgba(147,51,234,0.35) 0%, rgba(126,34,206,0.1) 50%, transparent 70%)"
        duration="30s"
        delay="-5s"
        top="30%"
        left="60%"
      />
      <FloatingOrb
        size="35rem"
        color="radial-gradient(circle, rgba(6,182,212,0.3) 0%, rgba(8,145,178,0.1) 50%, transparent 70%)"
        duration="28s"
        delay="-2s"
        top="50%"
        left="5%"
      />
      <FloatingOrb
        size="50rem"
        color="radial-gradient(circle, rgba(79,70,229,0.25) 0%, rgba(67,56,202,0.1) 50%, transparent 70%)"
        duration="32s"
        delay="-8s"
        top="20%"
        left="30%"
      />

      {/* Dynamic Spotlight Effect */}
      <div 
        className="absolute inset-0 opacity-30"
        style={{
          background: `radial-gradient(circle 50rem at ${mousePosition.x * 100}% ${mousePosition.y * 100}%, rgba(59,130,246,0.15), transparent 100%)`,
          transition: 'background 0.3s ease'
        }}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Navbar */}
        <nav className="fixed w-full z-50 bg-black/30 backdrop-blur-lg border-b border-white/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              <div className="flex items-center">
                <Link to="/" className="flex items-center gap-2 group">
                  <LogoIcon size={32} className="text-blue-500 group-hover:text-blue-400 transition-colors" />
                  <span className="text-xl font-bold bg-gradient-to-r from-white to-blue-500 bg-clip-text text-transparent">
                    arxivite
                  </span>
                </Link>
              </div>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
                <a href="#how-it-works" className="hover:text-blue-400 transition-colors">How it Works</a>
                <Link to="/app/search" className="hover:text-blue-400 transition-colors">Get Started</Link>
                <Link 
                  to="/app/auth-test" 
                  className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition-colors"
                >
                  Sign In
                </Link>
              </div>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-gray-300 hover:text-white"
                >
                  {isMenuOpen ? <X /> : <Menu />}
                </button>
              </div>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden bg-black/95 backdrop-blur-lg border-b border-white/10">
              <div className="px-2 pt-2 pb-3 space-y-1">
                <a href="#features" className="block px-3 py-2 hover:bg-white/10 rounded-lg">Features</a>
                <a href="#how-it-works" className="block px-3 py-2 hover:bg-white/10 rounded-lg">How it Works</a>
                <Link to="/app/search" className="block px-3 py-2 hover:bg-white/10 rounded-lg">Get Started</Link>
                <Link 
                  to="/app/auth-test" 
                  className="w-full mt-4 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 transition-colors block text-center"
                >
                  Sign In
                </Link>
              </div>
            </div>
          )}
        </nav>

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-4 relative">
          <div className="max-w-7xl mx-auto">
            <FadeIn>
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-center mb-6 bg-gradient-to-r from-white via-blue-400 to-blue-600 text-transparent bg-clip-text">
                Stay on top of research effortlessly
              </h1>
            </FadeIn>
            <FadeIn delay={200}>
              <p className="text-xl md:text-2xl text-center text-gray-400 mb-8 max-w-3xl mx-auto">
                Track, organize, and discover arXiv papers seamlessly across all your devices
              </p>
            </FadeIn>
            <FadeIn delay={400}>
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4">
                <Link 
                  to="/app/search"
                  className="px-8 py-4 rounded-lg bg-blue-600 hover:bg-blue-500 transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2 group"
                >
                  Get Started 
                  <ArrowRight className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <a 
                  href="#features"
                  className="px-8 py-4 rounded-lg border border-white/20 hover:border-white/40 transition-all duration-300 transform hover:-translate-y-1"
                >
                  Learn More
                </a>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                Everything you need to stay updated
              </h2>
            </FadeIn>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              <FeatureCard
                icon={Search}
                title="Smart Search"
                description="Find relevant papers quickly with our intelligent search system"
                delay={200}
              />
              <FeatureCard
                icon={BookMarked}
                title="Easy Organization"
                description="Bookmark and categorize papers with a simple click"
                delay={400}
              />
              <FeatureCard
                icon={Sparkles}
                title="Personalized Feed"
                description="Get recommendations based on your research interests"
                delay={600}
              />
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="how-it-works" className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
                How it Works
              </h2>
            </FadeIn>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <FadeIn delay={200}>
                <div className="aspect-video rounded-xl bg-gradient-to-br from-blue-600/20 to-purple-600/20 border border-white/10 flex items-center justify-center backdrop-blur-sm">
                  <span className="text-gray-400">Demo Video</span>
                </div>
              </FadeIn>
              <FadeIn delay={400}>
                <div className="space-y-8">
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">1</div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Create Your Profile</h3>
                      <p className="text-gray-400">Set up your research interests and preferences</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">2</div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Discover Papers</h3>
                      <p className="text-gray-400">Browse through curated recommendations</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">3</div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Stay Updated</h3>
                      <p className="text-gray-400">Get notifications for new relevant papers</p>
                    </div>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* Get Started Section */}
        <section id="get-started" className="py-20 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Ready to streamline your research?
              </h2>
            </FadeIn>
            <FadeIn delay={200}>
              <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
                Join thousands of researchers who use arxivite to stay on top of their field
              </p>
            </FadeIn>
            <FadeIn delay={400}>
              <Link 
                to="/app/search"
                className="px-8 py-4 rounded-lg bg-blue-600 hover:bg-blue-500 transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2 mx-auto group inline-flex"
              >
                Get Started Now
                <ArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </FadeIn>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-12 px-4 border-t border-white/10 relative">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">arxivite</h3>
                <p className="text-gray-400">Stay on top of research effortlessly</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Product</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/app/search" className="hover:text-white transition-colors">Search</Link></li>
                  <li><Link to="/app/catchup" className="hover:text-white transition-colors">Catchup</Link></li>
                  <li><Link to="/app/bookmarks" className="hover:text-white transition-colors">Bookmarks</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Account</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><Link to="/app/profile" className="hover:text-white transition-colors">Profile</Link></li>
                  <li><Link to="/app/settings" className="hover:text-white transition-colors">Settings</Link></li>
                  <li><Link to="/app/auth-test" className="hover:text-white transition-colors">Sign In</Link></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Legal</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                </ul>
              </div>
            </div>
            <div className="mt-12 pt-8 border-t border-white/10 text-center text-gray-400">
              <p>&copy; 2025 arxivite. All rights reserved.</p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;