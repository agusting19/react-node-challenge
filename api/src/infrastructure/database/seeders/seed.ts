import { FuelType, TripStatus } from "@/domain/entities/trip.js";
import { UserRole } from "@/domain/entities/user.js";
import { TripModel } from "@/infrastructure/database/schemas/trip-schema.js";
import { UserModel } from "@/infrastructure/database/schemas/user-schema.js";
import bcrypt from "bcryptjs";

const seedUsers = async () => {
  const existingUsers = await UserModel.countDocuments();
  if (existingUsers > 0) {
    console.log(
      `📊 Database already has ${existingUsers} users. Skipping user seed.`
    );
    return;
  }

  const users = [
    {
      email: "admin@trucking.com",
      password: await bcrypt.hash("admin123", 12),
      name: "Administrator",
      role: UserRole.ADMIN,
    },
    {
      email: "operator@trucking.com",
      password: await bcrypt.hash("operator123", 12),
      name: "Operator User",
      role: UserRole.OPERATOR,
    },
    {
      email: "test@example.com",
      password: await bcrypt.hash("test123", 12),
      name: "Test User",
      role: UserRole.OPERATOR,
    },
  ];

  await UserModel.insertMany(users);
  console.log("✅ Users seeded successfully!");
};

const seedTrips = async () => {
  const existingTrips = await TripModel.countDocuments();
  if (existingTrips > 0) {
    console.log(
      `🚛 Database already has ${existingTrips} trips. Skipping trip seed.`
    );
    return;
  }

  // Realistic trip data for Argentina fuel transport
  const drivers = [
    "Juan Pérez",
    "María González",
    "Carlos Rodriguez",
    "Ana Martínez",
    "Diego Silva",
    "Laura Torres",
    "Miguel Fernández",
    "Sofia Castro",
    "Roberto López",
    "Carmen Ruiz",
    "Fernando Morales",
    "Valeria Díaz",
  ];

  const trucks = [
    "ABC123",
    "DEF456",
    "GHI789",
    "JKL012",
    "MNO345",
    "PQR678",
    "STU901",
    "VWX234",
    "YZA567",
    "BCD890",
    "EFG123",
    "HIJ456",
  ];

  const origins = [
    "Refinería La Plata",
    "Refinería Luján de Cuyo",
    "Terminal Dock Sud",
    "Planta YPF Ensenada",
    "Terminal Shell Campana",
    "Refinería Plaza Huincul",
    "Terminal Axion Energy",
    "Planta Puma Energy",
    "Terminal Puerto Madero",
  ];

  const destinations = [
    "Estación de Servicio Palermo",
    "Estación YPF Recoleta",
    "Shell Belgrano",
    "Axion Villa Crespo",
    "Puma Energy Caballito",
    "YPF San Telmo",
    "Shell Puerto Madero",
    "Estación Flores",
    "Terminal La Boca",
    "YPF Barracas",
    "Shell Núñez",
    "Axion Colegiales",
    "Puma Almagro",
    "Estación Villa Urquiza",
    "YPF Chacarita",
    "Shell Villa del Parque",
  ];

  const trips = [];
  const now = new Date();

  // Generate 25 trips with varied statuses and dates
  for (let i = 0; i < 25; i++) {
    // Random past/future dates (last 30 days to next 15 days)
    const randomDays = Math.floor(Math.random() * 45) - 30; // -30 to +15 days
    const departureDate = new Date(now);
    departureDate.setDate(now.getDate() + randomDays);

    // Assign status based on departure date
    let status: TripStatus;
    if (departureDate > now) {
      status = TripStatus.SCHEDULED;
    } else {
      const daysSinceDepart = Math.abs(randomDays);
      if (daysSinceDepart < 1) {
        status = TripStatus.IN_TRANSIT;
      } else if (daysSinceDepart < 7 && Math.random() > 0.1) {
        status = TripStatus.DELIVERED;
      } else if (Math.random() > 0.85) {
        status = TripStatus.CANCELLED;
      } else {
        status = TripStatus.DELIVERED;
      }
    }

    // Random but realistic liters (between 5,000 and 28,000)
    const liters = Math.floor(Math.random() * 23000) + 5000;

    // Weighted fuel type distribution (Diesel more common)
    const fuelRandom = Math.random();
    let fuel: FuelType;
    if (fuelRandom < 0.5) fuel = FuelType.DIESEL;
    else if (fuelRandom < 0.75) fuel = FuelType.SUPER_GASOLINE;
    else if (fuelRandom < 0.9) fuel = FuelType.PREMIUM_GASOLINE;
    else fuel = FuelType.CNG;

    trips.push({
      truck: trucks[Math.floor(Math.random() * trucks.length)],
      driver: drivers[Math.floor(Math.random() * drivers.length)],
      origin: origins[Math.floor(Math.random() * origins.length)],
      destination:
        destinations[Math.floor(Math.random() * destinations.length)],
      fuel,
      liters,
      departureDate,
      status,
    });
  }

  await TripModel.insertMany(trips);
  console.log("🚛 Trips seeded successfully!");

  // Show status breakdown
  const statusCounts = await TripModel.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  console.log("📊 Trip status breakdown:");
  statusCounts.forEach(({ _id, count }) => {
    console.log(`   ${_id}: ${count} trips`);
  });
};

const seedDatabase = async () => {
  try {
    console.log("🌱 Starting database seeding...");

    await seedUsers();
    await seedTrips();

    console.log("✅ Database seeded successfully!");
    console.log("👤 Login credentials:");
    console.log("   📧 admin@trucking.com / admin123 (ADMIN)");
    console.log("   📧 operator@trucking.com / operator123 (OPERATOR)");
    console.log("   📧 test@example.com / test123 (OPERATOR)");
    console.log("🚛 25 sample trips created with realistic data");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    throw error;
  }
};

export default seedDatabase;
