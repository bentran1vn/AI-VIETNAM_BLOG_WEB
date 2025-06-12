import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User, UserRole } from "./user.schema";
import * as bcrypt from "bcrypt";

@Injectable()
export class UserSeeder {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async seed() {
    console.log("Starting user seeding...");
    const adminExists = await this.userModel.findOne({ role: UserRole.ADMIN });

    if (!adminExists) {
      console.log("Creating admin user...");
      const hashedPassword = await bcrypt.hash("admin123", 10);

      const admin = await this.userModel.create({
        username: "admin",
        email: "admin@example.com",
        password: hashedPassword,
        role: UserRole.ADMIN,
      });

      console.log("Admin user created successfully:", {
        username: admin.username,
        email: admin.email,
        role: admin.role,
      });
    } else {
      console.log("Admin user already exists:", {
        username: adminExists.username,
        email: adminExists.email,
        role: adminExists.role,
      });
    }
  }
}
