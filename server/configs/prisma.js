import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Helper to ensure compatibility with client components accessing either item.id or item._id
export const withLegacyId = (data) => {
  if (!data) return data;
  if (Array.isArray(data)) return data.map(withLegacyId);
  
  const mapped = { ...data, _id: data.id };
  if (data.hotel && typeof data.hotel === 'object') {
    mapped.hotel = withLegacyId(data.hotel);
  }
  if (data.room && typeof data.room === 'object') {
    mapped.room = withLegacyId(data.room);
  }
  if (data.user && typeof data.user === 'object') {
    mapped.user = withLegacyId(data.user);
  }
  return mapped;
};

export default prisma;
