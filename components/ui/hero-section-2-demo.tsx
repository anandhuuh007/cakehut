import React from 'react';
import { HeroSection } from '@/components/ui/hero-section-2';

export default function HeroSectionDemo() {
  return (
    <div className="w-full my-20">
      <HeroSection
        title={
          <>
            Ready to <br />
            <span className="text-primary">Taste the Magic?</span>
          </>
        }
        subtitle="Order your custom cake today or explore our signature collections. Perfect for weddings, birthdays, and special occasions."
        callToAction={{
          text: "ORDER NOW",
          href: "/products",
        }}
        backgroundImage="/cta/ChatGPT%20Image%20May%2021,%202026,%2002_11_13%20PM.png"
        contactInfo={{
            website: "sweetlayers.com",
            phone: "+1 (555) 123-BAKE",
            address: "123 Pastry Lane, Sweet Town",
        }}
      />
    </div>
  );
}
