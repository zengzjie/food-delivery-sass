import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import * as DataLoader from 'dataloader';
import { PrismaService } from '../../../../prisma/prisma.service';

@Injectable()
export class UserConfigDataLoader {
  constructor(private readonly prisma: PrismaService) {}
  generateDataLoader(): DataLoader<string, User> {
    return new DataLoader<string, User>(async (keys: string[]) => {
      console.log('keys => ', keys);

      const users = await this.prisma.user.findMany({
        where: {
          id: {
            in: keys,
          },
        },
      });
      const userMap = users.reduce(
        (acc, user) => {
          acc[user.id] = user;
          return acc;
        },
        {} as Record<string, User>,
      );
      return keys.map((key) => userMap[key]);
    });
  }
}
