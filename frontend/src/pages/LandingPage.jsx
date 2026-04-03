import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import HowItWorks from '../components/HowItWorks';
import Features from '../components/Features';
import CtaSection from '../components/CtaSection';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="dark bg-dark-bg min-h-screen text-white font-sans flex flex-col">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <HowItWorks />
        <Features />
        <CtaSection />
      </main>
      <Footer />
    </div>
  );
}
