export interface Strain {
  id: string;
  name: string;
  type: 'Indica' | 'Sativa' | 'Hybrid' | 'Edibles' | 'Accessories';
  thc?: string;
  price: number;
  image: string;
  effects: string[];
  description: string;
  flavor?: string;
}

export const strains: Strain[] = [
  {
    id: '1',
    name: 'Blue Dream',
    type: 'Hybrid',
    thc: '18-24%',
    price: 1600,
    image: '/placeholder.svg',
    effects: ['Euphoric', 'Creative', 'Relaxed'],
    description: 'California\'s most popular hybrid with sweet berry flavors',
    flavor: 'Sweet Berry'
  },
  {
    id: '2',
    name: 'Girl Scout Cookies',
    type: 'Hybrid',
    thc: '19-28%',
    price: 1500,
    image: '/placeholder.svg',
    effects: ['Happy', 'Euphoric', 'Creative'],
    description: 'A balanced hybrid with sweet and earthy flavors',
    flavor: 'Sweet & Earthy'
  },
  {
    id: '3',
    name: 'Granddaddy Purple',
    type: 'Indica',
    thc: '17-23%',
    price: 1800,
    image: '/placeholder.svg',
    effects: ['Relaxing', 'Sleep Aid', 'Pain Relief'],
    description: 'A classic indica known for deep relaxation',
    flavor: 'Grape & Berry'
  },
  {
    id: '4',
    name: 'Sour Diesel',
    type: 'Sativa',
    thc: '20-25%',
    price: 1700,
    image: '/placeholder.svg',
    effects: ['Energizing', 'Focus', 'Uplifting'],
    description: 'An energizing sativa with fuel-like aroma',
    flavor: 'Diesel & Citrus'
  },
  {
    id: '5',
    name: 'RAW Classic Papers',
    type: 'Accessories',
    price: 300,
    image: '/placeholder.svg',
    effects: [],
    description: 'Premium rolling papers for the perfect session'
  },
  {
    id: '6',
    name: 'CBD Gummies',
    type: 'Edibles',
    price: 800,
    image: '/placeholder.svg',
    effects: ['Relaxing', 'Pain Relief'],
    description: '10mg CBD gummies for wellness and relaxation',
    flavor: 'Mixed Berry'
  },
  {
    id: '7',
    name: 'White Widow',
    type: 'Hybrid',
    thc: '20-25%',
    price: 1650,
    image: '/placeholder.svg',
    effects: ['Energetic', 'Creative', 'Social'],
    description: 'A legendary hybrid known for its resin production',
    flavor: 'Earthy & Pine'
  },
  {
    id: '8',
    name: 'Northern Lights',
    type: 'Indica',
    thc: '16-21%',
    price: 1550,
    image: '/placeholder.svg',
    effects: ['Sleepy', 'Relaxed', 'Happy'],
    description: 'A pure indica classic for evening relaxation',
    flavor: 'Sweet & Spicy'
  }
];

export const strainNames = strains.map(s => s.name);

export function getStrainPrice(name: string): number {
  const strain = strains.find(s => s.name === name);
  return strain?.price ?? 1600;
}
