import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Hotelix database seed...");

  // 1. Seed Policy Categories & Policies
  console.log("Creating Policy Categories & Policies...");
  const cancellationCategory = await prisma.policyCategory.upsert({
    where: { name: "Cancellation & Refund" },
    update: {},
    create: {
      name: "Cancellation & Refund",
      description: "Guidelines on cancellations, grace periods, and refund timelines.",
      icon: "ShieldAlert",
      order: 1,
      policies: {
        create: [
          {
            title: "Free 48-Hour Cancellation",
            content: "Guests may cancel their booking free of charge up to 48 hours prior to the scheduled check-in time (3:00 PM local time). Full refunds will be processed to the original payment method within 3-5 business days.",
            importance: "mandatory"
          },
          {
            title: "Late Cancellations & No-Shows",
            content: "Cancellations made within 48 hours of check-in, as well as failure to arrive (no-show), will incur a fee equivalent to the first night's room rate plus applicable taxes.",
            importance: "standard"
          }
        ]
      }
    }
  });

  const checkinCategory = await prisma.policyCategory.upsert({
    where: { name: "Check-in & Check-out" },
    update: {},
    create: {
      name: "Check-in & Check-out",
      description: "Arrival windows, identification requirements, and departure times.",
      icon: "Clock",
      order: 2,
      policies: {
        create: [
          {
            title: "Standard Check-in Time",
            content: "Standard check-in begins at 3:00 PM. Early check-in is subject to availability upon arrival or can be guaranteed in advance via our Add-Ons service.",
            importance: "mandatory"
          },
          {
            title: "Government Photo Identification",
            content: "All guests aged 18 and older must present valid government-issued photo identification (Passport, Driver's License, or National ID) alongside the credit card used for booking.",
            importance: "mandatory"
          },
          {
            title: "Standard Check-out Time",
            content: "Check-out time is 11:00 AM. Late check-out requests must be confirmed with the front desk and may be subject to additional fees.",
            importance: "standard"
          }
        ]
      }
    }
  });

  const propertyRulesCategory = await prisma.policyCategory.upsert({
    where: { name: "Property & House Rules" },
    update: {},
    create: {
      name: "Property & House Rules",
      description: "Regulations regarding pets, smoking, quiet hours, and property care.",
      icon: "Home",
      order: 3,
      policies: {
        create: [
          {
            title: "100% Smoke-Free Facility",
            content: "All guest suites, balconies, indoor lounges, and dining areas are strictly non-smoking. A cleaning fee of $250 will be charged for violations.",
            importance: "mandatory"
          },
          {
            title: "Pet Policy",
            content: "We welcome well-behaved dogs under 35 lbs in designated pet-friendly suites. A non-refundable pet sanitization fee of $50 per stay applies.",
            importance: "standard"
          },
          {
            title: "Quiet Hours",
            content: "To guarantee restful stays for all guests, quiet hours are observed between 10:00 PM and 7:00 AM daily in all residential corridors.",
            importance: "standard"
          }
        ]
      }
    }
  });

  // 2. Seed Add-Ons & Experiences
  console.log("Creating Add-Ons...");
  const addonsData = [
    {
      name: "VIP Airport Chauffeur Transfer",
      description: "Private luxury sedan transfer between the airport and hotel with flight monitoring and luggage assistance.",
      price: 65.0,
      priceType: "per_stay",
      category: "transport",
      image: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=600&q=80",
      isAvailable: true
    },
    {
      name: "Champagne & Artisan Strawberries",
      description: "Chilled bottle of French Moët & Chandon accompanied by hand-dipped Belgian dark chocolate strawberries awaiting you upon check-in.",
      price: 85.0,
      priceType: "per_stay",
      category: "dining",
      image: "https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?auto=format&fit=crop&w=600&q=80",
      isAvailable: true
    },
    {
      name: "Couples Aromatherapy Spa Pass",
      description: "90-minute holistic full-body massage with organic essential oils and access to private thermal saunas and jacuzzi.",
      price: 180.0,
      priceType: "per_stay",
      category: "wellness",
      image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=600&q=80",
      isAvailable: true
    },
    {
      name: "Gourmet Rooftop Breakfast Buffet",
      description: "Daily access to our penthouse breakfast buffet featuring artisanal pastries, made-to-order omelets, and barista-crafted specialty coffees.",
      price: 28.0,
      priceType: "per_guest",
      category: "dining",
      image: "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?auto=format&fit=crop&w=600&q=80",
      isAvailable: true
    },
    {
      name: "Guaranteed Late Check-out (3:00 PM)",
      description: "Relax without rushing on your departure day with extended room access until 3:00 PM.",
      price: 45.0,
      priceType: "per_stay",
      category: "wellness",
      image: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80",
      isAvailable: true
    }
  ];

  for (const addon of addonsData) {
    const existing = await prisma.addOn.findFirst({ where: { name: addon.name } });
    if (!existing) {
      await prisma.addOn.create({ data: addon });
    }
  }

  // 3. Seed Promotions & Discount Codes
  console.log("Creating Promotions...");
  const promotionsData = [
    {
      code: "SUMMER25",
      title: "Summer Sunshine Getaway",
      description: "Save 25% on stays of 2 nights or more throughout the sunny summer season.",
      discountType: "percentage",
      discountValue: 25.0,
      validFrom: new Date("2026-05-01"),
      validTo: new Date("2026-10-31"),
      minNights: 2,
      bannerImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      isActive: true
    },
    {
      code: "LUXURY50",
      title: "Exclusive Suite Luxury Discount",
      description: "Receive an instant $50 reduction on luxury suites and premium executive bookings.",
      discountType: "fixed",
      discountValue: 50.0,
      validFrom: new Date("2026-01-01"),
      validTo: new Date("2026-12-31"),
      minNights: 1,
      bannerImage: "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80",
      isActive: true
    },
    {
      code: "EARLYBIRD15",
      title: "Early Bird Advance Planner",
      description: "Book at least 30 days in advance and unlock a 15% discount on all room categories.",
      discountType: "percentage",
      discountValue: 15.0,
      validFrom: new Date("2026-01-01"),
      validTo: new Date("2026-12-31"),
      minNights: 1,
      bannerImage: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?auto=format&fit=crop&w=800&q=80",
      isActive: true
    }
  ];

  for (const promo of promotionsData) {
    await prisma.promotion.upsert({
      where: { code: promo.code },
      update: {},
      create: promo
    });
  }

  // 4. Seed Amenity / Utility Categories & Facilities
  console.log("Creating Amenities & Utilities...");
  const wellnessCat = await prisma.amenityCategory.upsert({
    where: { name: "Wellness & Recreation" },
    update: {},
    create: {
      name: "Wellness & Recreation",
      icon: "Activity",
      amenities: {
        create: [
          {
            name: "Heated Infinity Sky Pool",
            description: "Panoramic heated rooftop pool open year-round with poolside beverage and towel service.",
            icon: "Waves",
            isFeatured: true
          },
          {
            name: "24/7 Technogym Fitness Center",
            description: "State-of-the-art cardio machines, free weights, Peloton bikes, and dedicated yoga studio.",
            icon: "Dumbbell",
            isFeatured: true
          },
          {
            name: "Hydrotherapy Thermal Spa",
            description: "Finnish cedar sauna, steam bath, and cold plunge immersion pools.",
            icon: "Sparkles",
            isFeatured: true
          }
        ]
      }
    }
  });

  const businessCat = await prisma.amenityCategory.upsert({
    where: { name: "Business & Connectivity" },
    update: {},
    create: {
      name: "Business & Connectivity",
      icon: "Wifi",
      amenities: {
        create: [
          {
            name: "Gigabit Fiber WiFi 6",
            description: "Complimentary ultra-high-speed encrypted Wi-Fi throughout all guest rooms, conference halls, and public lounges.",
            icon: "Wifi",
            isFeatured: true
          },
          {
            name: "Executive Co-Working Hub",
            description: "Private Zoom-equipped work pods, ergonomic Herman Miller seating, and wireless color printing.",
            icon: "Briefcase",
            isFeatured: true
          }
        ]
      }
    }
  });

  const transportCat = await prisma.amenityCategory.upsert({
    where: { name: "Transport & Parking" },
    update: {},
    create: {
      name: "Transport & Parking",
      icon: "Car",
      amenities: {
        create: [
          {
            name: "Secure Valet Parking",
            description: "24-hour underground guarded parking with in-and-out privileges.",
            icon: "Car",
            isFeatured: true
          },
          {
            name: "Tesla & Universal EV Fast Charging",
            description: "Level 2 and Level 3 DC fast chargers complimentary for registered overnight guests.",
            icon: "Zap",
            isFeatured: true
          }
        ]
      }
    }
  });

  // 5. Seed FAQs
  console.log("Creating FAQs...");
  const faqsData = [
    {
      category: "Booking",
      question: "Can I modify or cancel my reservation online?",
      answer: "Yes, reservations can be managed directly under the 'My Bookings' tab when logged into your account. Changes made at least 48 hours before check-in incur zero penalties.",
      order: 1
    },
    {
      category: "Booking",
      question: "Are taxes and service charges included in the room rate?",
      answer: "All rates displayed reflect the base room rate per night. Local tourism taxes and applicable regional service fees are clearly broken down at checkout before final payment confirmation.",
      order: 2
    },
    {
      category: "Facilities",
      question: "Is high-speed internet available in all rooms?",
      answer: "Yes, complimentary enterprise-grade Fiber Wi-Fi 6 is available across the entire property, capable of 4K streaming and video conferencing.",
      order: 3
    },
    {
      category: "Facilities",
      question: "What are the pool and fitness center operating hours?",
      answer: "The fitness center is accessible 24 hours a day with your digital room key. The heated rooftop infinity pool is open from 6:00 AM to 10:00 PM daily.",
      order: 4
    },
    {
      category: "Policies",
      question: "What is your policy on pets?",
      answer: "We are proud to welcome dogs up to 35 lbs in designated pet-friendly suites. Please notify us prior to arrival; a small one-time $50 sanitization fee applies.",
      order: 5
    },
    {
      category: "Policies",
      question: "Can I request early check-in or late check-out?",
      answer: "Yes! Early check-in and late check-out can be requested when booking through our Add-Ons section or arranged directly at the front desk subject to room availability.",
      order: 6
    }
  ];

  for (const faq of faqsData) {
    const existing = await prisma.faq.findFirst({ where: { question: faq.question } });
    if (!existing) {
      await prisma.faq.create({ data: faq });
    }
  }

  console.log("✅ Hotelix database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
