import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import { prisma } from 'lib/prisma';

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const profileId = req.query.pid as string;
  const startDate = req.body.startDate;

  const session = await getSession({ req });
  if (!session) {
    res.status(401).send({ message: 'Unauthorized ' });
    return;
  }

  switch (req.method) {
    case 'PUT': {
      const profile = await prisma.profile.update({
        where: { id: profileId },
        data: { startDate },
      });
      res.json(profile);
      break;
    }
    default:
      throw new Error(
        `The HTTP ${req.method} method is not supported at this route.`
      );
  }
}
