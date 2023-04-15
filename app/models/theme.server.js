import { prisma } from "~/db.server";

export function createTheme({ themeInput, userId }) {
  try {
    return prisma.theme.create({
      data: {
        themeInput: themeInput,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });

  } catch (error) {
    console.error('Error creating theme:', error);
    throw error;
  }
}


export function getTheme({ userId }) {
  return prisma.theme.findFirst({
    select: { id: true, themeInput: true },
    where: { userId },
    orderBy: {
      createdAt: 'desc',
    },
  });
}
