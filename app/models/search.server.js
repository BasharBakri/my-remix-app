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


export function getAllSearches({ userId }) {
  try {
    return prisma.search.findMany({
      select: { id: true, userSearchString: true, botSearchString: true, createdAt: true },
      where: { userId },
      orderBy: {
        createdAt: 'desc',
      },
    });
  } catch (error) {
    console.error('Error fetching all searches:', error);
    throw error;
  }
};


export async function deleteAllSearches({ userId }) {
  try {
    const deletedSearches = await prisma.search.deleteMany({
      where: { userId },
    });

    return deletedSearches;
  } catch (error) {
    console.error('Error deleting all searches:', error);
    throw error;
  }
}





