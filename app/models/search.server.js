import { prisma } from "~/db.server";




export function createSearch({ userSearchString, botSearchString, userId }) {
  try {
    return prisma.search.create({
      data: {
        userSearchString: userSearchString,
        botSearchString: botSearchString,
        user: {
          connect: {
            id: userId,
          },
        },
      },
    });
  } catch (error) {
    console.error('Error saving search:', error);
    throw error;
  }
}

export function getSearch({ userId }) {
  try {
    return prisma.search.findFirst({
      select: { id: true, userSearchString: true, botSearchString: true, createdAt: true, },
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (error) {
    console.error('Error fetching search:', error);
    throw error;
  }
}






