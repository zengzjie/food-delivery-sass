import { Response } from 'express';
import { accessTokenMaxAge, refreshTokenMaxAge } from '../constants';

const setAccessTokenCookie = (response: Response, token: string) => {
  response.cookie('Authorization', token, {
    httpOnly: false,
    maxAge: accessTokenMaxAge,
    secure: process.env.NODE_ENV === 'production', // Set to true if using https
    sameSite: 'lax', // Adjust as needed
    // domain: 'example.com' // production domain
    domain: process.env.NODE_ENV === 'production' ? '.example.com' : '',
  });
};

const setRefreshTokenCookie = (response: Response, token: string) => {
  response.cookie('Refresh_Token', token, {
    httpOnly: false,
    maxAge: refreshTokenMaxAge,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    domain: process.env.NODE_ENV === 'production' ? '.example.com' : '',
  });
};

export { setAccessTokenCookie, setRefreshTokenCookie };
