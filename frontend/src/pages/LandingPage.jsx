import Navbar from '../components/Navbar';
import Hero from '../components/landing/Hero';
import Features from '../components/landing/Features';
import HowItWorks from '../components/landing/HowItWorks';
import UserTypes from '../components/landing/UserTypes';
import FeaturedHackathons from '../components/landing/FeaturedHackathons';
import CTA from '../components/landing/CTA';
import Footer from '../components/Footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      <UserTypes />
      <FeaturedHackathons />
      <CTA />
      <Footer />
    </div>
  );
}
