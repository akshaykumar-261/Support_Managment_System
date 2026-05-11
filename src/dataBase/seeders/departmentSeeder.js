import mongoose from "mongoose";
import Department from "../models/department.js";
const departmentSeeder = [
  { name: "Billing" },
  { name: "Sales" },
  { name: "It" },
];
const seedDepartments = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/Support_Mangment_System");
    await Department.deleteMany();
    await Department.insertMany(departmentSeeder);
    console.log("Departments seeded successfully");
    process.exit(0);
  } catch (error) {
    console.log("Error seeding departments :", error);
    process.exit(1);
  }
};
seedDepartments();
