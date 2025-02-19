import DataLoader from 'dataloader';
import { Request, Response } from 'express';
import { User } from './entities/user.entities';

export type ConfiguredEnv = {
  DATABASE_URL: string;
  ACTIVATION_SECRET: string;
  SMTP_HOST: string;
  SMTP_PORT: number;
  SMTP_SERVICE: string;
  SMTP_MAIL: string;
  SMTP_PASSWORD: string;
  ACCESS_TOKEN_SECRET: string;
  REFRESH_TOKEN_SECRET: string;
  PERM_ROUTER_WHITE_LIST: string;
  REDIS_HOST: string;
  REDIS_PORT: number;
  REDIS_PASSWORD: string;
  REDIS_DB: number;
  REDIS_PREFIX: string;
};

export type GraphContextType = {
  req: Request;
  res: Response;
  userConfigDataLoader: DataLoader<string, User>;
};
