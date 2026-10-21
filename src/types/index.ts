export type EventType =
  | 'Wedding'
  | 'Birthday'
  | 'Engagement'
  | 'Anniversary'
  | 'Baby Shower'
  | 'Graduation'
  | 'Community Festival'
  | 'Fundraiser'
  | 'Corporate Event';

export type Currency = 'INR' | 'USD' | 'EUR' | 'GBP';

export type RSVPStatus = 'invited' | 'confirmed' | 'declined' | 'pending';

export type MealPreference =
  | 'Vegetarian'
  | 'Non-Vegetarian'
  | 'Vegan'
  | 'Jain'
  | 'Halal'
  | 'Gluten-Free'
  | 'Standard';

export interface BudgetItem {
  id: string;
  eventId: string;
  category: string;
  name: string;
  estimatedCost: number;
  actualCost: number;
  paidAmount: number;
  status: 'unpaid' | 'deposit_paid' | 'fully_paid';
  priority: 'high' | 'medium' | 'low';
  vendorName?: string;
  notes?: string;
}

export interface TimelineTask {
  id: string;
  eventId: string;
  title: string;
  dueDate: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  status: 'todo' | 'in_progress' | 'completed';
  owner: string;
  notes?: string;
}

export interface Vendor {
  id: string;
  eventId: string;
  name: string;
  category: string;
  location: string;
  priceRange: string;
  serviceDescription: string;
  quotedAmount: number;
  depositPaid: number;
  status: 'shortlisted' | 'contacted' | 'booked' | 'declined';
  rating: number;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  notes: string;
  image?: string;
  isSample: boolean;
}

export interface Guest {
  id: string;
  eventId: string;
  name: string;
  email: string;
  phone: string;
  group: 'Family' | 'Friends' | 'Colleagues' | 'VIP' | 'Community' | string;
  rsvpStatus: RSVPStatus;
  plusOnes: number;
  mealPreference: MealPreference;
  dietaryNotes?: string;
  tableNumber?: string;
  notes?: string;
}

export interface DayOfScheduleItem {
  id: string;
  eventId: string;
  time: string;
  title: string;
  lead: string;
  location: string;
  notes: string;
  completed: boolean;
}

export interface EmergencyContact {
  name: string;
  role: string;
  phone: string;
  notes?: string;
}

export interface CreativeIdea {
  title: string;
  description: string;
  estimatedCost: number;
}

export interface RiskItem {
  risk: string;
  mitigation: string;
}

export interface GeneratedPlan {
  eventSummary: {
    title: string;
    eventType: string;
    date: string;
    location: string;
    theme: string;
    colorPalette: string[];
    guestCount: number;
    currency: Currency;
    vision: string;
  };
  budget: {
    total: number;
    contingency: number;
    availablePlanningBudget: number;
    categories: {
      name: string;
      estimatedCost: number;
      actualCost: number;
      priority: 'high' | 'medium' | 'low';
      reason: string;
    }[];
  };
  timeline: {
    title: string;
    dueDate: string;
    priority: 'high' | 'medium' | 'low';
    status: 'pending' | 'in_progress' | 'completed';
    owner: string;
  }[];
  vendorChecklist: {
    category: string;
    status: string;
    requirements: string[];
  }[];
  creativeIdeas: CreativeIdea[];
  riskChecklist: RiskItem[];
  nextActions: string[];
}

export interface AppEvent {
  id: string;
  title: string;
  eventType: EventType;
  date: string;
  time: string;
  city: string;
  location: string;
  venueType: 'Indoor' | 'Outdoor' | 'Hybrid';
  guestCount: number;
  currency: Currency;
  totalBudget: number;
  contingencyPercent: number;
  theme: string;
  colorPalette: string[];
  vision: string;
  coverImage: string;
  status: 'Planning' | 'Confirmed' | 'Completed';
  culturalPreferences: string;
  dietary: string;
  style: string;
  planningPreferences: {
    diyVsPro: 'DIY' | 'Hybrid' | 'Full Service';
    priorities: string[];
  };
  emergencyContacts: EmergencyContact[];
  generatedPlan?: GeneratedPlan;
  createdAt: string;
}

export interface InspirationItem {
  id: string;
  title: string;
  collection: string;
  image: string;
  description: string;
  colorPalette: string[];
  budgetTier: 'Budget-Friendly' | 'Mid-Range' | 'Luxury' | 'Ultra-Luxury';
  tags: string[];
}
