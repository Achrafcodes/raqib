import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.js';

const BASE_URL = process.env.SERVER_URL ?? `http://localhost:${process.env.PORT ?? 5000}`;

if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: `${BASE_URL}/api/auth/google/callback`,
      },
      async (_accessToken, _refreshToken, profile, done) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) return done(new Error('No email from Google'));

          let user = await User.findOne({ email });
          if (!user) {
            user = await User.create({
              name: profile.displayName ?? email.split('@')[0],
              email,
              password: Math.random().toString(36),
              isEmailVerified: true,
            });
          } else if (!user.isEmailVerified) {
            user.isEmailVerified = true;
            await user.save();
          }
          done(null, user);
        } catch (err) {
          done(err as Error);
        }
      }
    )
  );
}

if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID,
        clientSecret: process.env.GITHUB_CLIENT_SECRET,
        callbackURL: `${BASE_URL}/api/auth/github/callback`,
        scope: ['user:email'],
      },
      async (_accessToken: string, _refreshToken: string, profile: { displayName?: string; username?: string; emails?: { value: string }[] }, done: (err: Error | null, user?: unknown) => void) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) return done(new Error('No email from GitHub — make sure your GitHub email is public or grant email scope'));

          let user = await User.findOne({ email });
          if (!user) {
            user = await User.create({
              name: profile.displayName ?? profile.username ?? email.split('@')[0],
              email,
              password: Math.random().toString(36),
              isEmailVerified: true,
            });
          } else if (!user.isEmailVerified) {
            user.isEmailVerified = true;
            await user.save();
          }
          done(null, user);
        } catch (err) {
          done(err as Error);
        }
      }
    )
  );
}

export default passport;
