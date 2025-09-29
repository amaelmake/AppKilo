import { PrismaClient } from '@prisma/client';
import { BAREME_2025 } from '../src/lib/bareme';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Seed barème data
  console.log('📊 Seeding barème data...');
  
  for (const entry of BAREME_2025) {
    await prisma.bareme.upsert({
      where: {
        country_year_cvMin_cvMax: {
          country: 'FR',
          year: entry.year,
          cvMin: entry.cvMin,
          cvMax: entry.cvMax,
        },
      },
      update: {
        segments: entry.segments,
        params: entry.params,
      },
      create: {
        country: 'FR',
        year: entry.year,
        cvMin: entry.cvMin,
        cvMax: entry.cvMax,
        segments: entry.segments,
        params: entry.params,
      },
    });
  }

  console.log('✅ Barème data seeded successfully');

  // Create a demo user (optional - for development)
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@kilometrik.fr' },
    update: {},
    create: {
      email: 'demo@kilometrik.fr',
      passwordHash: '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4J/8KzKz2a', // password: "demo123"
      name: 'Utilisateur Démo',
      companyType: 'Auto-entrepreneur',
      siren: '123456789',
    },
  });

  console.log('👤 Demo user created:', demoUser.email);

  // Create a demo vehicle
  const demoVehicle = await prisma.vehicle.upsert({
    where: { plate: 'AB-123-CD' },
    update: {},
    create: {
      userId: demoUser.id,
      label: 'Peugeot 308',
      fiscalHP: 6,
      fuelType: 'essence',
      plate: 'AB-123-CD',
      year: 2020,
    },
  });

  console.log('🚗 Demo vehicle created:', demoVehicle.label);

  // Create some demo trips
  const demoTrips = [
    {
      userId: demoUser.id,
      vehicleId: demoVehicle.id,
      date: new Date('2025-01-15'),
      startAddr: '12 Rue Victor Hugo, Lyon',
      endAddr: 'Aéroport Saint-Exupéry',
      distanceKm: 28.4,
      purpose: 'RDV client',
      roundTrip: false,
      year: 2025,
      amountEUR: 18.06,
      amountMode: 'IK',
      vehicleCV: 6,
    },
    {
      userId: demoUser.id,
      vehicleId: demoVehicle.id,
      date: new Date('2025-01-20'),
      startAddr: 'Bureau, Paris',
      endAddr: 'Client, Versailles',
      distanceKm: 45.2,
      purpose: 'Rendez-vous commercial',
      roundTrip: true,
      year: 2025,
      amountEUR: 57.36,
      amountMode: 'IK',
      vehicleCV: 6,
    },
  ];

  for (const trip of demoTrips) {
    await prisma.trip.create({
      data: trip,
    });
  }

  console.log('🗺️ Demo trips created');

  console.log('🎉 Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

