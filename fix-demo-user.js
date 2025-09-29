const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function fixDemoUser() {
  try {
    console.log('🔧 Fixing demo user...');
    
    // Delete existing demo user if exists
    await prisma.user.deleteMany({
      where: { email: 'demo@kilometrik.fr' }
    });
    
    console.log('✅ Deleted existing demo user');
    
    // Hash the password properly
    const hashedPassword = await bcrypt.hash('demo123', 12);
    
    // Create new demo user
    const demoUser = await prisma.user.create({
      data: {
        email: 'demo@kilometrik.fr',
        passwordHash: hashedPassword,
        name: 'Utilisateur Démo',
        companyType: 'Auto-entrepreneur',
        siren: '123456789',
      },
    });
    
    console.log('✅ Demo user created:', demoUser.email);
    console.log('🔑 Password hash:', hashedPassword.substring(0, 20) + '...');
    
    // Create demo vehicle
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
    
    // Test login
    const testUser = await prisma.user.findUnique({
      where: { email: 'demo@kilometrik.fr' }
    });
    
    if (testUser) {
      const passwordMatch = await bcrypt.compare('demo123', testUser.passwordHash);
      console.log('🔐 Password test:', passwordMatch ? '✅ SUCCESS' : '❌ FAILED');
    }
    
    console.log('🎉 Demo user fixed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixDemoUser();
