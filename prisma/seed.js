const {
  PrismaClient,
  Role,
  CampaignPlacementType,
  CampaignStatus,
  StatusMetricType,
  JourneyStage,
  AlertSeverity,
} = require("@prisma/client");
const bcrypt = require("bcryptjs");

const prisma = new PrismaClient();

const defaultPassword = "pass@123";

async function seedUsers() {
  const passwordHash = await bcrypt.hash(defaultPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: "admin@ist-airport.com" },
    update: {},
    create: {
      name: "Istanbul Ops Admin",
      email: "admin@ist-airport.com",
      password: passwordHash,
      role: Role.ADMIN,
    },
  });

  const editor = await prisma.user.upsert({
    where: { email: "editor@ist-airport.com" },
    update: {},
    create: {
      name: "Content Editor",
      email: "editor@ist-airport.com",
      password: passwordHash,
      role: Role.EDITOR,
    },
  });

  return { admin, editor };
}

async function seedHomepageModules() {
  await prisma.sectionVersion.deleteMany();

  await prisma.alert.deleteMany();
  await prisma.statusMetric.deleteMany();
  await prisma.journeyTile.deleteMany();
  await prisma.cTAStrip.deleteMany();
  await prisma.atAirport.deleteMany();
  await prisma.transport.deleteMany();
  await prisma.highlight.deleteMany();
  await prisma.quickLink.deleteMany();
  await prisma.hero.deleteMany();

  const hero = await prisma.hero.create({
    data: {
      title: "Welcome to Istanbul Airport",
      subtitle: "Your journey starts here. Track flights, explore transport, and stay informed.",
      imageUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800",
      ctaText: "Plan Your Trip",
      ctaLink: "https://www.istairport.com/",
    },
  });

  const quickLinksData = [
    {
      label: "Flight Status",
      icon: "plane",
      url: "https://www.istairport.com/en/passenger/flight-status",
    },
    {
      label: "Airport Map",
      icon: "map",
      url: "https://www.istairport.com/en/passenger/airport-map",
    },
    {
      label: "Transport",
      icon: "bus",
      url: "https://www.istairport.com/en/passenger/transport",
    },
    {
      label: "Shops & Dining",
      icon: "shopping-bag",
      url: "https://www.istairport.com/en/shopping-dining",
    },
  ];

  const highlightData = [
    {
      title: "New Lounge Experience",
      description: "Relax in our redesigned business lounge with Turkish cuisine and private suites.",
      imageUrl: "https://images.unsplash.com/photo-1521293281845-22d5827c38f0",
      category: "Luxury",
      tags: "lounge,premium,breakfast,price:€55,duration:2h",
      spotlight: true,
    },
    {
      title: "Family Facilities",
      description: "Enjoy family rooms, kids play zones, and fast-track security for parents.",
      imageUrl: "https://images.unsplash.com/photo-1527325671451-1b1cfd656e0e",
      category: "Family",
      tags: "family,kids,rest,price:₺0,duration:1h",
      spotlight: false,
    },
    {
      title: "Shopping Festival",
      description: "Duty free offers up to 40% off luxury brands until the end of the month.",
      imageUrl: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef",
      category: "Duty Free",
      tags: "shopping,deals,luxury,dutyfree,price:Up to 40% off,duration:30m",
      spotlight: true,
    },
  ];

  const transportData = [
    {
      mode: "Metro",
      status: "Operational",
      description: "M11 metro runs every 8 minutes to Kagithane and Gayrettepe during peak hours.",
      iconUrl: "https://images.unsplash.com/photo-1518981288866-7f480759c836",
      badgeText: "Next in 6 min",
      nextDeparture: "09:06",
      frequency: "Every 8 min",
      ctaText: "View metro planner",
      ctaUrl: "https://www.metro.istanbul/Hatlarimiz/Sayfalar/M11.aspx",
      sortOrder: 1,
    },
    {
      mode: "Taxi",
      status: "Limited",
      description: "High demand between 20:00-23:00. Consider pre-booked rides for faster pickup.",
      iconUrl: "https://images.unsplash.com/photo-1529876754933-64649e60a422",
      badgeText: "15 min wait",
      frequency: "On demand",
      ctaText: "Book a taxi",
      ctaUrl: "https://www.istairport.com/en/passenger/transport/taxi",
      sortOrder: 2,
    },
    {
      mode: "Airport Shuttle",
      status: "Operational",
      description: "Havaist coaches depart from Gate 19 with routes to Taksim, Kadikoy, and Besiktas.",
      iconUrl: "https://images.unsplash.com/photo-1517142874080-5a16d7912c65",
      badgeText: "Next at 09:15",
      nextDeparture: "09:15",
      frequency: "Every 30 min",
      ctaText: "See shuttle routes",
      ctaUrl: "https://hava.ist/en",
      sortOrder: 3,
    },
    {
      mode: "Parking",
      status: "Operational",
      description: "P3 short-term parking has 120 spots free. Book online for discounted rates.",
      iconUrl: "https://images.unsplash.com/photo-1489515217757-5fd1be406fef",
      badgeText: "120 spaces free",
      frequency: "Live occupancy",
      ctaText: "Reserve parking",
      ctaUrl: "https://www.istairport.com/en/passenger/parking",
      sortOrder: 4,
    },
  ];

  const atAirportData = [
    {
      name: "IGA Lounge",
      category: "Lounges",
      description: "Premium lounge with showers, gourmet buffet, and runway views.",
      imageUrl: "https://images.unsplash.com/photo-1518304272495-7bea421b43c4",
    },
    {
      name: "Duty Free Grand Bazaar",
      category: "Shopping",
      description: "Discover premium Turkish delights, perfumes, and luxury fashion brands.",
      imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e",
    },
    {
      name: "IGA Sleep Pod",
      category: "Wellness",
      description: "Bookable sleep pods near Gate D11 with on-demand wake-up service.",
      imageUrl: "https://images.unsplash.com/photo-1451866640812-298fa6292e31",
    },
  ];

  const quickLinks = await prisma.$transaction(
    quickLinksData.map((item) => prisma.quickLink.create({ data: item })),
  );
  const highlights = await prisma.$transaction(
    highlightData.map((item) => prisma.highlight.create({ data: item })),
  );
  const transports = await prisma.$transaction(
    transportData.map((item) => prisma.transport.create({ data: item })),
  );
  const atAirport = await prisma.$transaction(
    atAirportData.map((item) => prisma.atAirport.create({ data: item })),
  );

  const ctaStrip = await prisma.cTAStrip.create({
    data: {
      title: "Need travel assistance?",
      subtitle: "Our airport concierge can arrange private transfers, lounge access, and luggage handling.",
      buttonText: "Book Concierge",
      buttonUrl: "https://www.istairport.com/en/passenger/concierge",
    },
  });

  const statusMetrics = await prisma.$transaction([
    prisma.statusMetric.create({
      data: {
        type: StatusMetricType.DAILY_DEPARTURES,
        title: "Daily departures",
        metric: "184",
        unit: "flights",
        trendLabel: "+8 vs yesterday",
        icon: "plane-takeoff",
        sortOrder: 1,
      },
    }),
    prisma.statusMetric.create({
      data: {
        type: StatusMetricType.SECURITY_WAIT,
        title: "Security wait",
        metric: "12",
        unit: "min",
        trendLabel: "Peak at 09:30",
        icon: "shield-alert",
        sortOrder: 2,
      },
    }),
    prisma.statusMetric.create({
      data: {
        type: StatusMetricType.PARKING_AVAILABILITY,
        title: "Parking availability",
        metric: "74%",
        unit: "capacity",
        trendLabel: "More spaces in P4",
        icon: "parking-circle",
        sortOrder: 3,
      },
    }),
  ]);

  const journeyTiles = await prisma.$transaction([
    prisma.journeyTile.create({
      data: {
        stage: JourneyStage.BEFORE_FLIGHT,
        title: "Check-in & baggage",
        description: "Confirm baggage allowances, drop-off points, and online check-in cut-offs.",
        icon: "luggage",
        ctaLabel: "View check-in guide",
        ctaUrl: "https://www.istairport.com/en/passenger/check-in",
        sortOrder: 1,
      },
    }),
    prisma.journeyTile.create({
      data: {
        stage: JourneyStage.BEFORE_FLIGHT,
        title: "Fast track & lounges",
        description: "Skip the queues with fast track access or reserve a premium lounge.",
        icon: "vip",
        ctaLabel: "Book fast track",
        ctaUrl: "https://www.igapass.com/en/fast-track",
        partnerSlug: "iga-pass",
        sortOrder: 2,
      },
    }),
    prisma.journeyTile.create({
      data: {
        stage: JourneyStage.ON_ARRIVAL,
        title: "Passport control",
        description: "Have your documents ready; e-gates available for eligible passports.",
        icon: "passport",
        sortOrder: 1,
      },
    }),
    prisma.journeyTile.create({
      data: {
        stage: JourneyStage.ON_ARRIVAL,
        title: "Currency & transfers",
        description: "Access 24/7 currency exchange and onward transfer desks in arrivals hall.",
        icon: "currency",
        ctaLabel: "See transfer options",
        ctaUrl: "https://www.istairport.com/en/passenger/transport",
        sortOrder: 2,
      },
    }),
  ]);

  const alerts = await prisma.$transaction([
    prisma.alert.create({
      data: {
        title: "Security advisory",
        message: "Additional screening in Terminal 1 due to maintenance. Arrive 20 minutes earlier.",
        severity: AlertSeverity.WARNING,
        ctaLabel: "View details",
        ctaUrl: "https://www.istairport.com/en/passenger/announcements",
      },
    }),
  ]);

  return { hero, quickLinks, highlights, transports, atAirport, ctaStrip, statusMetrics, journeyTiles, alerts };
}

async function seedFlights() {
  await prisma.flight.deleteMany();
  const now = new Date();
  const flights = [
    {
      flightNo: "TK 1943",
      destination: "London Heathrow",
      status: "On Time",
      departure: new Date(now.getTime() + 45 * 60 * 1000),
    },
    {
      flightNo: "TK 2321",
      destination: "Berlin Brandenburg",
      status: "Boarding",
      departure: new Date(now.getTime() + 20 * 60 * 1000),
    },
    {
      flightNo: "TK 89",
      destination: "New York JFK",
      status: "Delayed",
      departure: new Date(now.getTime() + 120 * 60 * 1000),
    },
    {
      flightNo: "TK 723",
      destination: "Dubai",
      status: "On Time",
      departure: new Date(now.getTime() + 75 * 60 * 1000),
    },
  ];

  await prisma.$transaction(flights.map((flight) => prisma.flight.create({ data: flight })));
}

async function seedPartnerCampaigns() {
  await prisma.campaignClickEvent.deleteMany();
  await prisma.campaignPlacement.deleteMany();
  await prisma.partnerCampaign.deleteMany();

  const campaigns = [
    {
      name: "Transavia Summer Sale",
      slug: "transavia-summer",
      headline: "Fly Transavia from Istanbul",
      subheadline: "Save 20% on summer flights to Amsterdam, Rotterdam, and Eindhoven when you book before 31 July.",
      imageUrl: "https://images.unsplash.com/photo-1504198458649-3128b932f49b",
      ctaText: "Book with Transavia",
      destinationUrl: "https://www.transavia.com/en-EU/home/",
      utmSource: "ist-airport-guide",
      utmMedium: "hero",
      utmCampaign: "transavia-summer",
      locale: "all",
      status: CampaignStatus.LIVE,
      startDate: new Date(),
      endDate: null,
      placements: [CampaignPlacementType.HERO_TILE, CampaignPlacementType.FEATURED_SECTION],
    },
    {
      name: "Turkish Airlines Business Lounge",
      slug: "tk-business-lounge",
      headline: "Turkish Airlines Business Lounge",
      subheadline: "Experience award-winning dining and private suites when you upgrade to Business Class.",
      imageUrl: "https://images.unsplash.com/photo-1556740749-887f6717d7e4",
      ctaText: "Upgrade now",
      destinationUrl: "https://www.turkishairlines.com/en-int/flights/",
      utmSource: "ist-airport-guide",
      utmMedium: "featured",
      utmCampaign: "tk-lounge",
      locale: "en",
      status: CampaignStatus.LIVE,
      startDate: new Date(),
      endDate: null,
      placements: [CampaignPlacementType.FEATURED_SECTION, CampaignPlacementType.QUICK_LINK],
    },
    {
      name: "Duty Free Deluxe",
      slug: "duty-free-deluxe",
      headline: "Save 15% on luxury fragrances",
      subheadline: "Exclusive airport-only pricing on designer fragrances at Duty Free Grand Bazaar.",
      imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
      ctaText: "See the offer",
      destinationUrl: "https://www.istairport.com/en/shopping-dining",
      utmSource: "ist-airport-guide",
      utmMedium: "banner",
      utmCampaign: "dutyfree-deluxe",
      locale: "all",
      status: CampaignStatus.LIVE,
      startDate: new Date(),
      endDate: null,
      placements: [CampaignPlacementType.BANNER, CampaignPlacementType.QUICK_LINK],
    },
  ];

  for (const campaign of campaigns) {
    await prisma.partnerCampaign.create({
      data: {
        name: campaign.name,
        slug: campaign.slug,
        headline: campaign.headline,
        subheadline: campaign.subheadline,
        imageUrl: campaign.imageUrl,
        ctaText: campaign.ctaText,
        destinationUrl: campaign.destinationUrl,
        utmSource: campaign.utmSource,
        utmMedium: campaign.utmMedium,
        utmCampaign: campaign.utmCampaign,
        locale: campaign.locale,
        status: campaign.status,
        startDate: campaign.startDate,
        endDate: campaign.endDate,
        placements: {
          create: campaign.placements.map((placement, index) => ({ placement, sortOrder: index })),
        },
      },
    });
  }

  return campaigns.length;
}

async function main() {
  console.log("🌱 Seeding Istanbul Airport Guide data...");
  const users = await seedUsers();
  const homepage = await seedHomepageModules();
  await seedFlights();
  const partnerCount = await seedPartnerCampaigns();

  console.log("✅ Seed complete.");
  console.table([
    { label: "Admin", email: users.admin.email, password: defaultPassword },
    { label: "Editor", email: users.editor.email, password: defaultPassword },
  ]);
  console.log(`Hero section seeded: ${homepage.hero.title}`);
  console.log(`Partner campaigns seeded: ${partnerCount}`);
}

main()
  .catch((error) => {
    console.error("❌ Seed failed:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
