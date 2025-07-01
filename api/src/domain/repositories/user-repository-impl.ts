import type { User } from "@/domain/entities/user";
import type { UserRepository } from "@/domain/repositories/user-repository";
import {
  UserModel,
  type UserDocument,
} from "@/infrastructure/database/schemas/user-schema";

const mapToEntity = (doc: UserDocument): User => ({
  id: doc._id.toString(),
  email: doc.email,
  password: doc.password,
  name: doc.name,
  role: doc.role,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

export const userRepositoryImpl: UserRepository = {
  async findAll(): Promise<User[]> {
    const users = await UserModel.find().sort({ createdAt: -1 });
    return users.map(mapToEntity);
  },

  async findById(id: string): Promise<User | null> {
    const user = await UserModel.findById(id);
    return user ? mapToEntity(user) : null;
  },

  async findByEmail(email: string): Promise<User | null> {
    const user = await UserModel.findOne({ email: email.toLowerCase() });
    return user ? mapToEntity(user) : null;
  },

  async create(
    user: Omit<User, "id" | "createdAt" | "updatedAt">
  ): Promise<User> {
    const createdUser = await UserModel.create({
      ...user,
      email: user.email.toLowerCase(),
    });
    return mapToEntity(createdUser);
  },

  async update(id: string, user: Partial<User>): Promise<User | null> {
    const updateData = { ...user };

    // Ensure email is lowercase if being updated
    if (updateData.email) {
      updateData.email = updateData.email.toLowerCase();
    }

    const updatedUser = await UserModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return updatedUser ? mapToEntity(updatedUser) : null;
  },

  async delete(id: string): Promise<boolean> {
    const result = await UserModel.findByIdAndDelete(id);
    return !!result;
  },
};
