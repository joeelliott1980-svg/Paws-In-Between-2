export interface IdealHome {
  environment: string;
  family: string;
  otherPets: string;
}

export interface Analysis {
  species: string;
  breed: string;
  estimatedAge: string;
  healthNotes: string;
  mood: string;
  idealHome: IdealHome;
}

export interface Host {
    name: string;
    bio: string;
    matchReason: string;
    dailyRate: string;
    maxDuration: string;
    servicesOffered: string[];
    availability: 'Available' | 'Partially Booked' | 'Fully Booked';
}

export interface HostFilters {
  hasChildren: boolean;
  hasPets: boolean;
  environmentType: string;
}