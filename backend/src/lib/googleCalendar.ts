import { google } from 'googleapis';
import { GOOGLE_CALLBACK_URL, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from './constants';
import { prisma } from './prisma';

export const getGoogleCalendarClient = (
  userId: string,
  accessToken: string,
  refreshToken: string,
) => {
  const auth = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URL);

  auth.setCredentials({
    access_token: accessToken,
    refresh_token: refreshToken,
  });
  auth.on('tokens', async (tokens) => {
    if (tokens.access_token) {
      await prisma.user.update({
        where: { id: BigInt(userId) },
        data: {
          google_access_token: tokens.access_token,
          ...(tokens.refresh_token && { google_refresh_token: tokens.refresh_token }),
        },
      });
    }
  });
  return google.calendar({ version: 'v3', auth });
};

export async function getUserGoogleTokens(userId: string) {
  return prisma.user.findUnique({
    where: { id: BigInt(userId) },
    select: {
      google_access_token: true,
      google_refresh_token: true,
    },
  });
}
