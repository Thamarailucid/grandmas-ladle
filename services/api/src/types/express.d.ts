import { UserProfile } from '@grandmas-ladle/shared';

declare global {
  namespace Express {
    interface Request {
      user?: UserProfile;
    }
  }
}
