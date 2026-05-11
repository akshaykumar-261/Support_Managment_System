import Role from "../models/roles.js";
import mongoose from "mongoose";
const roleSeeder = [{ name: "customer" }, { name: "admin" }, { name: "agent" }];
const seedRoles = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/Support_Mangment_System");
    await Role.deleteMany();
    await Role.insertMany(roleSeeder);
    console.log("Roles seeded successfully");
    process.exit(0);
  } catch (error) {
    console.log("Error seeding roles:", error);
    process.exit(1);
  }
};
seedRoles();
