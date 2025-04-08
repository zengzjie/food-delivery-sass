export const accessTokenExpiresIn = '1m';
export const refreshTokenExpiresIn = '5m';
export const accessTokenMaxAge = 1000 * 60 * 60 * 24;
export const refreshTokenMaxAge = 1000 * 60 * 60 * 24 * 7;

export enum STATUS_CODE {
  SUCCESS = 200,
  CREATED = 201,
  BAD_REQUEST = 400,
  UNAUTHENTICATED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  INTERNAL_SERVER_ERROR = 500,
}

export const HTTP_STATUS_MESSAGES = {
  UNAUTHENTICATED: 'Unauthorized access without login，Please log in first！',
  FORBIDDEN: 'Current character has no permission to operate！',
  INTERNAL_SERVER_ERROR:
    'Server internal error, please contact the administrator！',
};
