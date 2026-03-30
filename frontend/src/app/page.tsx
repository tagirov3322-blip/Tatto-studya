"use client";

import { Navbar } from "@/components/sections/Navbar";
import { HeroSection } from "@/components/sections/HeroSection";
import { StatsSection } from "@/components/sections/StatsSection";
import { PortfolioSection } from "@/components/sections/PortfolioSection";
import { MastersSection } from "@/components/sections/MastersSection";
import { TattooPriceSection } from "@/components/sections/TattooPriceSection";
import { PiercingPriceSection } from "@/components/sections/PiercingPriceSection";
import { TrainingSection } from "@/components/sections/TrainingSection";
import { BookingForm } from "@/components/sections/BookingForm";
import { ContactsFaqSection } from "@/components/sections/ContactsFaqSection";
import { CustomCursor } from "@/components/ui/custom-cursor";
import { CookieConsent } from "@/components/ui/cookie-consent";

export default function Home() {
  return (
    <main className="bg-black min-h-screen">
      <CustomCursor />
      <Navbar />
      <HeroSection />
      <StatsSection />
      <PortfolioSection />
      <MastersSection />
      <TattooPriceSection />
      <PiercingPriceSection />
      <TrainingSection />
      <BookingForm />
      <ContactsFaqSection />
    </main>
  );
}
