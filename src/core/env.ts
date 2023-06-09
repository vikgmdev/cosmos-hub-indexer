import dotenv from 'dotenv-safe';

if (process.env.ENV === 'dev') {
  dotenv.config({ example: '.env.sample' });
}
