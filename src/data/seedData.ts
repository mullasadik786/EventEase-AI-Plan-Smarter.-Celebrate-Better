import { AppEvent, BudgetItem, TimelineTask, Vendor, Guest, DayOfScheduleItem, InspirationItem } from '../types';

export const SEED_EVENTS: AppEvent[] = [
  {
    id: 'evt-wedding-01',
    title: "Priya & Aarav's Royal South Indian Wedding",
    eventType: 'Wedding',
    date: '2026-12-18',
    time: '08:30 AM - 10:30 PM',
    city: 'Hyderabad',
    location: 'Taj Falaknuma Heritage Lawns, Hyderabad',
    venueType: 'Hybrid',
    guestCount: 300,
    currency: 'INR',
    totalBudget: 1500000,
    contingencyPercent: 10,
    theme: 'Traditional Heritage Elegance with Temple Florals',
    colorPalette: ['#D4AF37', '#800020', '#FFF8DC', '#2E8B57', '#FF7799'],
    vision: 'A timeless royal South Indian wedding blending age-old Vedic ceremonies, cascading marigold and tuberose mandap architecture, authentic vegetarian sadhya on banana leaves, and soulful Carnatic fusion evening music.',
    coverImage: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1200&q=80',
    status: 'Planning',
    culturalPreferences: 'Telugu & Tamil Vedic traditions, traditional Kanjeevaram styling, evening Carnatic instrumental reception',
    dietary: 'Pure vegetarian multi-course traditional feast with live dessert theatre (jalebi-rabdi, payasam)',
    style: 'Traditional Royal',
    planningPreferences: {
      diyVsPro: 'Full Service',
      priorities: ['Memorable guest hospitality', 'Sacred and grand mandap aesthetics', 'Authentic culinary experience']
    },
    emergencyContacts: [
      { name: 'Ramesh Sharma', role: 'Head Family Coordinator', phone: '+91 98480 12345', notes: 'Handles venue arrival & relatives' },
      { name: 'Meera Iyer', role: 'Lead Event Planner', phone: '+91 98765 43210', notes: 'Master coordinator for all vendors' },
      { name: 'Dr. S. K. Rao', role: 'Family Physician on Call', phone: '+91 99001 55667', notes: 'Medical support standby' }
    ],
    createdAt: '2026-10-01T10:00:00.000Z'
  },
  {
    id: 'evt-bday-02',
    title: "Leo's 10th Superhero Galactic Birthday",
    eventType: 'Birthday',
    date: '2026-11-20',
    time: '04:00 PM - 08:30 PM',
    city: 'Bengaluru',
    location: 'Greenwood Lawn & Club House, Indiranagar',
    venueType: 'Outdoor',
    guestCount: 50,
    currency: 'INR',
    totalBudget: 120000,
    contingencyPercent: 10,
    theme: 'Cosmic Superhero Adventure',
    colorPalette: ['#5B5CF0', '#FF7799', '#F5BD55', '#CFF5E8', '#14213D'],
    vision: 'An action-packed 10th birthday party featuring laser games, custom superhero capes, LED cosmic balloon tunnels, and a 3-tier galaxy chocolate fudge cake.',
    coverImage: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=1200&q=80',
    status: 'Planning',
    culturalPreferences: 'Modern friendly party with family and school classmates',
    dietary: 'Kid-friendly appetizers (mini burgers, pizza slices, fruit skewers) + healthy options',
    style: 'Vibrant Playful',
    planningPreferences: {
      diyVsPro: 'Hybrid',
      priorities: ['Interactive games & entertainment', 'Spectacular theme cake', 'Custom return gifts']
    },
    emergencyContacts: [
      { name: 'Kavita Menon', role: 'Mother / Host', phone: '+91 98200 44556' },
      { name: 'Arjun Menon', role: 'Father / Logistics', phone: '+91 98200 44557' }
    ],
    createdAt: '2026-10-10T14:30:00.000Z'
  },
  {
    id: 'evt-fest-03',
    title: "Diwali Community Festival of Lights",
    eventType: 'Community Festival',
    date: '2026-11-08',
    time: '05:00 PM - 11:00 PM',
    city: 'Mumbai',
    location: 'Bandra Reclamation Community Amphitheatre',
    venueType: 'Outdoor',
    guestCount: 450,
    currency: 'INR',
    totalBudget: 650000,
    contingencyPercent: 12,
    theme: 'Luminescence & Heritage Rangoli',
    colorPalette: ['#FF9933', '#138808', '#D4AF37', '#5B5CF0', '#FFFFFF'],
    vision: 'A heartwarming community cultural festival with giant floral rangolis, live acoustic fusion band, 20 craft and sweet stalls, safe cold-sparkler lighting, and charity clothing drive.',
    coverImage: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    status: 'Planning',
    culturalPreferences: 'All-inclusive multi-faith neighborhood Diwali gathering',
    dietary: 'Artisanal regional street food stalls, fresh cane juice, hot samosas & festive sweets',
    style: 'Festive Community',
    planningPreferences: {
      diyVsPro: 'Full Service',
      priorities: ['Safety & crowd management', 'High quality stage sound', 'Eco-friendly lighting']
    },
    emergencyContacts: [
      { name: 'Sunil Deshmukh', role: 'Society Chairman', phone: '+91 98190 77889' },
      { name: 'Anjali Verma', role: 'Cultural Secretary', phone: '+91 98190 33441' }
    ],
    createdAt: '2026-10-05T09:15:00.000Z'
  }
];

export const SEED_BUDGET_ITEMS: BudgetItem[] = [
  // Wedding items
  {
    id: 'b-01',
    eventId: 'evt-wedding-01',
    category: 'Venue & Accommodation',
    name: 'Palace Royal Lawns & Guest Suites (2 Days)',
    estimatedCost: 450000,
    actualCost: 430000,
    paidAmount: 200000,
    status: 'deposit_paid',
    priority: 'high',
    vendorName: 'Taj Falaknuma Palace',
    notes: 'Includes 10 guest suites and valet parking for 150 cars'
  },
  {
    id: 'b-02',
    eventId: 'evt-wedding-01',
    category: 'Catering & Beverages',
    name: 'Traditional Royal Sadhya (300 guests + 50 buffer)',
    estimatedCost: 380000,
    actualCost: 375000,
    paidAmount: 150000,
    status: 'deposit_paid',
    priority: 'high',
    vendorName: 'Annapurna Royal Catering',
    notes: 'Multi-course lunch and evening dinner reception with dessert theatre'
  },
  {
    id: 'b-03',
    eventId: 'evt-wedding-01',
    category: 'Decoration & Lighting',
    name: 'Temple Arch Mandap, Entrance Florals & Fairy Lights',
    estimatedCost: 260000,
    actualCost: 250000,
    paidAmount: 100000,
    status: 'deposit_paid',
    priority: 'high',
    vendorName: 'Vedic Blooms & Decor',
    notes: 'Fresh marigold, jasmine, lotus pool, brass samai lamps'
  },
  {
    id: 'b-04',
    eventId: 'evt-wedding-01',
    category: 'Photography & Videography',
    name: 'Candid Photography, Drone Aerials & Cinematic Film',
    estimatedCost: 160000,
    actualCost: 155000,
    paidAmount: 80000,
    status: 'deposit_paid',
    priority: 'high',
    vendorName: 'Studio Memories Hyderabad',
    notes: '2 lead photographers, 1 drone pilot, 2 cinematographers, teaser video within 7 days'
  },
  {
    id: 'b-05',
    eventId: 'evt-wedding-01',
    category: 'Attire & Styling',
    name: 'Bridal Kanjeevarams, Groom Sherwani & Makeup Team',
    estimatedCost: 110000,
    actualCost: 115000,
    paidAmount: 115000,
    status: 'fully_paid',
    priority: 'medium',
    vendorName: 'Pothys Silk & Glamour Studio',
    notes: 'Includes bridal makeup and hair styling for 3 immediate family members'
  },
  {
    id: 'b-06',
    eventId: 'evt-wedding-01',
    category: 'Entertainment & Music',
    name: 'Live Nadaswaram, Carnatic Fusion Quartet & DJ Console',
    estimatedCost: 65000,
    actualCost: 60000,
    paidAmount: 30000,
    status: 'deposit_paid',
    priority: 'medium',
    vendorName: 'Swaralaya Music Ensemble'
  },
  {
    id: 'b-07',
    eventId: 'evt-wedding-01',
    category: 'Invitations & Favors',
    name: 'Eco Seed-Paper Box Invites & Handcrafted Brass Favors',
    estimatedCost: 45000,
    actualCost: 42000,
    paidAmount: 42000,
    status: 'fully_paid',
    priority: 'low',
    vendorName: 'GreenPrints Artisans'
  },
  {
    id: 'b-08',
    eventId: 'evt-wedding-01',
    category: 'Miscellaneous & Emergency',
    name: 'Guest Shuttle Cabs, Contingency & Permits',
    estimatedCost: 30000,
    actualCost: 18000,
    paidAmount: 10000,
    status: 'deposit_paid',
    priority: 'low'
  },

  // Birthday items
  {
    id: 'b-10',
    eventId: 'evt-bday-02',
    category: 'Venue & Grounds',
    name: 'Club House Lawn Rental (5 hours)',
    estimatedCost: 35000,
    actualCost: 35000,
    paidAmount: 35000,
    status: 'fully_paid',
    priority: 'high'
  },
  {
    id: 'b-11',
    eventId: 'evt-bday-02',
    category: 'Catering & Custom Cake',
    name: 'Galaxy Cake + Finger Food Buffet (50 pax)',
    estimatedCost: 45000,
    actualCost: 42000,
    paidAmount: 20000,
    status: 'deposit_paid',
    priority: 'high'
  },
  {
    id: 'b-12',
    eventId: 'evt-bday-02',
    category: 'Entertainment & Activities',
    name: 'Laser Tag Arena Setup & Game Emcee',
    estimatedCost: 22000,
    actualCost: 22000,
    paidAmount: 10000,
    status: 'deposit_paid',
    priority: 'medium'
  },
  {
    id: 'b-13',
    eventId: 'evt-bday-02',
    category: 'Decoration & Balloons',
    name: 'LED Cosmic Balloon Arch & Photo Corner',
    estimatedCost: 18000,
    actualCost: 16000,
    paidAmount: 16000,
    status: 'fully_paid',
    priority: 'medium'
  }
];

export const SEED_TASKS: TimelineTask[] = [
  // Wedding Tasks
  {
    id: 't-01',
    eventId: 'evt-wedding-01',
    title: 'Lock In Taj Falaknuma Venue Agreement & Date',
    dueDate: '2026-10-15',
    category: 'Venue',
    priority: 'high',
    status: 'completed',
    owner: 'Host',
    notes: 'Signed contract and deposited 40% advance'
  },
  {
    id: 't-02',
    eventId: 'evt-wedding-01',
    title: 'Finalize Menu Tasting with Annapurna Catering',
    dueDate: '2026-11-05',
    category: 'Catering',
    priority: 'high',
    status: 'in_progress',
    owner: 'Meera (Planner)',
    notes: 'Taste 3 varieties of payasam and live counters'
  },
  {
    id: 't-03',
    eventId: 'evt-wedding-01',
    title: 'Approve Mandap Floral Architecture CAD Render',
    dueDate: '2026-11-12',
    category: 'Decor',
    priority: 'high',
    status: 'todo',
    owner: 'Vedic Blooms Designer'
  },
  {
    id: 't-04',
    eventId: 'evt-wedding-01',
    title: 'Dispatch Digital Save-the-Date Video to Relatives',
    dueDate: '2026-11-15',
    category: 'Invitations',
    priority: 'medium',
    status: 'completed',
    owner: 'Family'
  },
  {
    id: 't-05',
    eventId: 'evt-wedding-01',
    title: 'Coordinate Out-of-Town Guest Airport Pickups',
    dueDate: '2026-12-05',
    category: 'Logistics',
    priority: 'medium',
    status: 'todo',
    owner: 'Ramesh Sharma'
  },
  {
    id: 't-06',
    eventId: 'evt-wedding-01',
    title: 'Finalize Day-of Music Playlist with Swaralaya Ensemble',
    dueDate: '2026-12-10',
    category: 'Entertainment',
    priority: 'low',
    status: 'todo',
    owner: 'Couple'
  },
  {
    id: 't-07',
    eventId: 'evt-wedding-01',
    title: 'Final Sound & Emergency Generator Drill at Venue',
    dueDate: '2026-12-16',
    category: 'Technical',
    priority: 'high',
    status: 'todo',
    owner: 'Meera (Planner)'
  },

  // Birthday Tasks
  {
    id: 't-10',
    eventId: 'evt-bday-02',
    title: 'Confirm Galaxy Cake Flavor & Custom Fondant Figures',
    dueDate: '2026-11-10',
    category: 'Catering',
    priority: 'high',
    status: 'completed',
    owner: 'Kavita Menon'
  },
  {
    id: 't-11',
    eventId: 'evt-bday-02',
    title: 'Pack 40 Superhero Return Gift Hampers',
    dueDate: '2026-11-18',
    category: 'Favors',
    priority: 'medium',
    status: 'todo',
    owner: 'Kavita Menon'
  }
];

export const SEED_VENDORS: Vendor[] = [
  {
    id: 'v-01',
    eventId: 'evt-wedding-01',
    name: 'Taj Falaknuma Palace & Lawns',
    category: 'Venues',
    location: 'Engine Bowli, Hyderabad',
    priceRange: '₹₹₹₹',
    serviceDescription: 'Iconic royal heritage palace with panoramic views, manicured lawns, and royal hospitality.',
    quotedAmount: 450000,
    depositPaid: 200000,
    status: 'booked',
    rating: 4.9,
    contactPerson: 'Vikramaditya Rao',
    contactPhone: '+91 40 6629 8585',
    contactEmail: 'banquets.falaknuma@tajhotels.com',
    notes: 'Contract includes 10 heritage suites and complimentary bridal suite.',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=600&q=80',
    isSample: true
  },
  {
    id: 'v-02',
    eventId: 'evt-wedding-01',
    name: 'Annapurna Royal Catering Co.',
    category: 'Caterers',
    location: 'Banjara Hills, Hyderabad',
    priceRange: '₹₹₹',
    serviceDescription: 'Authentic South Indian multi-course feast masters with live brass jalebi counters and filter coffee stalls.',
    quotedAmount: 380000,
    depositPaid: 150000,
    status: 'booked',
    rating: 4.8,
    contactPerson: 'Chef K. Narayanan',
    contactPhone: '+91 94440 98711',
    contactEmail: 'info@annapurnacatering.in',
    notes: 'Includes traditional banana leaf service and 40 trained banquet staff.',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=600&q=80',
    isSample: true
  },
  {
    id: 'v-03',
    eventId: 'evt-wedding-01',
    name: 'Vedic Blooms & Stage Artisans',
    category: 'Decorators',
    location: 'Jubilee Hills, Hyderabad',
    priceRange: '₹₹₹',
    serviceDescription: 'Award-winning eco-friendly floral architectures, traditional wooden mandaps, and ambient illumination.',
    quotedAmount: 260000,
    depositPaid: 100000,
    status: 'booked',
    rating: 4.9,
    contactPerson: 'Deepa Reddy',
    contactPhone: '+91 98490 22334',
    contactEmail: 'deepa@vedicblooms.com',
    notes: 'Providing 500 meters of fresh marigold ropes and water lotus bowl walkways.',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    isSample: true
  },
  {
    id: 'v-04',
    eventId: 'evt-wedding-01',
    name: 'Studio Memories Candid Stories',
    category: 'Photographers',
    location: 'Madhapur, Hyderabad',
    priceRange: '₹₹₹',
    serviceDescription: 'Specialists in royal cinematic weddings, drone aerial perspectives, and luxury coffee table albums.',
    quotedAmount: 160000,
    depositPaid: 80000,
    status: 'booked',
    rating: 4.95,
    contactPerson: 'Siddharth Varma',
    contactPhone: '+91 99887 66554',
    contactEmail: 'hello@studiomemories.in',
    notes: 'Full raw 4K footage delivered on SSD + 100-page Italian flush-mount album.',
    image: 'https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=600&q=80',
    isSample: true
  },
  {
    id: 'v-05',
    eventId: 'evt-wedding-01',
    name: 'Swaralaya Carnatic & Fusion Troupe',
    category: 'DJs and musicians',
    location: 'Gachibowli, Hyderabad',
    priceRange: '₹₹',
    serviceDescription: 'Enchanting live Nadaswaram for muhurtham followed by violin-keyboard-flute jugalbandi.',
    quotedAmount: 65000,
    depositPaid: 30000,
    status: 'booked',
    rating: 4.75,
    contactPerson: 'Guru S. Raghavan',
    contactPhone: '+91 98491 55662',
    contactEmail: 'swaralaya.live@gmail.com',
    notes: 'Includes wireless sound system & backup generator line.',
    image: 'https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=600&q=80',
    isSample: true
  },
  {
    id: 'v-06',
    eventId: 'evt-wedding-01',
    name: 'The Hyderabad Grand Ballroom',
    category: 'Venues',
    location: 'Hitec City, Hyderabad',
    priceRange: '₹₹₹',
    serviceDescription: 'Modern luxury banquet hall with 800 guest capacity, crystal chandeliers, and in-house audio.',
    quotedAmount: 390000,
    depositPaid: 0,
    status: 'shortlisted',
    rating: 4.6,
    contactPerson: 'Ananya Sen',
    contactPhone: '+91 40 4455 6677',
    contactEmail: 'sales@grandballroomhyd.com',
    notes: 'Alternate indoor backup option inspected during early planning.',
    image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80',
    isSample: true
  }
];

export const SEED_GUESTS: Guest[] = [
  {
    id: 'g-01',
    eventId: 'evt-wedding-01',
    name: 'Venkatesh & Sumathi Rao',
    email: 'v.rao.family@example.com',
    phone: '+91 98480 99887',
    group: 'Family',
    rsvpStatus: 'confirmed',
    plusOnes: 3,
    mealPreference: 'Vegetarian',
    tableNumber: 'Table 1 (Elders)',
    notes: 'Bride’s paternal uncle. Needs ground floor seating.'
  },
  {
    id: 'g-02',
    eventId: 'evt-wedding-01',
    name: 'Dr. Anandita Swaminathan',
    email: 'anandita.s@example.com',
    phone: '+91 97112 33445',
    group: 'Friends',
    rsvpStatus: 'confirmed',
    plusOnes: 1,
    mealPreference: 'Vegetarian',
    dietaryNotes: 'Gluten sensitivity',
    tableNumber: 'Table 4 (College Batch)',
    notes: 'Arriving from Singapore on Dec 16'
  },
  {
    id: 'g-03',
    eventId: 'evt-wedding-01',
    name: 'Karan & Pooja Kapoor',
    email: 'karan.kapoor@example.com',
    phone: '+91 98201 11223',
    group: 'Colleagues',
    rsvpStatus: 'confirmed',
    plusOnes: 1,
    mealPreference: 'Vegetarian',
    tableNumber: 'Table 5 (Tech Team)'
  },
  {
    id: 'g-04',
    eventId: 'evt-wedding-01',
    name: 'Justice P. K. Murthy (Retd)',
    email: 'murthy.p.k@example.com',
    phone: '+91 94440 22110',
    group: 'VIP',
    rsvpStatus: 'confirmed',
    plusOnes: 1,
    mealPreference: 'Jain',
    dietaryNotes: 'Strict Jain meal (no root vegetables)',
    tableNumber: 'Table 2 (VIP Heritage)'
  },
  {
    id: 'g-05',
    eventId: 'evt-wedding-01',
    name: 'Siddhant Deshmukh',
    email: 'siddhant.d@example.com',
    phone: '+91 98900 66778',
    group: 'Friends',
    rsvpStatus: 'pending',
    plusOnes: 0,
    mealPreference: 'Vegetarian',
    notes: 'Awaiting leave approval confirmation'
  },
  {
    id: 'g-06',
    eventId: 'evt-wedding-01',
    name: 'Mohit & Sneha Singhal',
    email: 'singhal.m@example.com',
    phone: '+91 98110 55443',
    group: 'Colleagues',
    rsvpStatus: 'declined',
    plusOnes: 0,
    mealPreference: 'Standard',
    notes: 'Pre-scheduled overseas work travel'
  }
];

export const SEED_DAY_OF_SCHEDULE: DayOfScheduleItem[] = [
  {
    id: 's-01',
    eventId: 'evt-wedding-01',
    time: '06:00 AM',
    title: 'Florist & Mandap Team Arrival',
    lead: 'Deepa Reddy (Vedic Blooms)',
    location: 'Palace Central Courtyard',
    notes: 'Inspect fresh tuberose garlands, stage Samai brass lamps, and lotus water basin setup.',
    completed: true
  },
  {
    id: 's-02',
    eventId: 'evt-wedding-01',
    time: '07:00 AM',
    title: 'Bridal Hair, Makeup & Styling Begins',
    lead: 'Glamour Studio Artists',
    location: 'Bridal Heritage Suite 101',
    notes: 'First photo session begins at 08:00 AM sharp with traditional silk saree.',
    completed: true
  },
  {
    id: 's-03',
    eventId: 'evt-wedding-01',
    time: '08:00 AM',
    title: 'Live Nadaswaram & Sound Check',
    lead: 'Guru S. Raghavan',
    location: 'Main Mandap Stage',
    notes: 'Acoustic mic balance check and audio recording test.',
    completed: false
  },
  {
    id: 's-04',
    eventId: 'evt-wedding-01',
    time: '08:45 AM',
    title: 'Guest Arrival & Welcome Refreshments',
    lead: 'Hospitality Host Team',
    location: 'Grand Palace Portico',
    notes: 'Chilled tender coconut water with mint served to arriving guests.',
    completed: false
  },
  {
    id: 's-05',
    eventId: 'evt-wedding-01',
    time: '09:30 AM',
    title: 'Sacred Muhurtham & Kanyadaan Ceremony',
    lead: 'Head Priests & Family Elders',
    location: 'Central Vedic Mandap',
    notes: 'Key moments: Jeelakarra Bellam, Mangalsutra Dharana, and Saptapadi.',
    completed: false
  },
  {
    id: 's-06',
    eventId: 'evt-wedding-01',
    time: '12:30 PM',
    title: 'Traditional Royal Banana-Leaf Sadhya Lunch',
    lead: 'Chef Narayanan (Annapurna)',
    location: 'Heritage Dining Pavilion',
    notes: '3 batches of 110 guests each. Hot payasam served in traditional brass cups.',
    completed: false
  },
  {
    id: 's-07',
    eventId: 'evt-wedding-01',
    time: '06:30 PM',
    title: 'Sunset Photo Session & Golden Hour Portraits',
    lead: 'Siddharth (Studio Memories)',
    location: 'Terrace Overlooking City Skyline',
    notes: 'Drone cinematic portrait shots of the couple and immediate family.',
    completed: false
  },
  {
    id: 's-08',
    eventId: 'evt-wedding-01',
    time: '07:30 PM',
    title: 'Evening Carnatic Fusion Concert & Dinner Reception',
    lead: 'Meera Iyer (Planner)',
    location: 'Illuminated Palace Lawn',
    notes: 'Live acoustic fusion, signature dinner buffet, and guest blessings.',
    completed: false
  }
];

export const SEED_INSPIRATIONS: InspirationItem[] = [
  {
    id: 'insp-01',
    title: 'Royal Mandap with Marigold Cascade',
    collection: 'Traditional Indian Weddings',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    description: 'An evocative sacred temple aesthetic featuring 1,000 strands of saffron marigolds, antique brass diyas, and fragrant jasmine garlands.',
    colorPalette: ['#D4AF37', '#FF7A00', '#FFF8DC', '#800020', '#2E8B57'],
    budgetTier: 'Luxury',
    tags: ['Traditional', 'Floral Arch', 'Temple Architecture', 'Marigolds']
  },
  {
    id: 'insp-02',
    title: 'Enchanted Botanical Glasshouse Reception',
    collection: 'Luxury Weddings',
    image: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=800&q=80',
    description: 'Cascading hanging wisteria, twinkling fairy lights, crystal candelabras, and natural moss runners across banquet tables.',
    colorPalette: ['#1B4332', '#D8F3DC', '#F5BD55', '#FFFFFF', '#5B5CF0'],
    budgetTier: 'Ultra-Luxury',
    tags: ['Modern Luxury', 'Fairy Lights', 'Hanging Florals', 'Romantic']
  },
  {
    id: 'insp-03',
    title: 'Vibrant Cosmic Neon Birthday Playground',
    collection: 'Birthday Themes',
    image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80',
    description: 'Galactic balloon arches with metallic chrome spheres, UV glow-in-the-dark zones, and custom neon light signage.',
    colorPalette: ['#5B5CF0', '#FF7799', '#00F0FF', '#F5BD55', '#14213D'],
    budgetTier: 'Mid-Range',
    tags: ['Birthday', 'Neon', 'Balloons', 'Playful', 'Kids']
  },
  {
    id: 'insp-04',
    title: 'Minimalist Sunset Garden Soirée',
    collection: 'Minimalist Celebrations',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    description: 'Warm natural linen tablecloths, dried pampas grass accents, beeswax taper candles, and rustic wooden crossback chairs.',
    colorPalette: ['#E9ECEF', '#DDB892', '#7F5539', '#6B705C', '#FFE0CB'],
    budgetTier: 'Budget-Friendly',
    tags: ['Minimalist', 'Boho', 'Rustic', 'Outdoor', 'Earth Tones']
  },
  {
    id: 'insp-05',
    title: 'Luminous Heritage Rangoli & Brass Lamps',
    collection: 'Cultural Celebrations',
    image: 'https://images.unsplash.com/photo-1605335198424-69974c0f8623?auto=format&fit=crop&w=800&q=80',
    description: 'Intricate 15-foot hand-laid organic flower petal rangolis floating on brass urli water bowls with fragrant floating candles.',
    colorPalette: ['#FF9933', '#C70039', '#F5BD55', '#007A3D', '#FFFFFF'],
    budgetTier: 'Mid-Range',
    tags: ['Diwali', 'Festival', 'Rangoli', 'Eco-friendly', 'Community']
  },
  {
    id: 'insp-06',
    title: 'Artisanal Grazing Table & Mocktail Station',
    collection: 'Elegant Table Settings',
    image: 'https://images.unsplash.com/photo-1555244162-803834f70033?auto=format&fit=crop&w=800&q=80',
    description: 'An interactive culinary experience loaded with artisanal cheeses, fresh stone fruits, infused syrups, and rosemary sprigs.',
    colorPalette: ['#8338EC', '#3A86FF', '#FF006E', '#FB5607', '#FFBE0B'],
    budgetTier: 'Luxury',
    tags: ['Catering', 'Grazing Table', 'Interactive', 'Gourmet']
  }
];
