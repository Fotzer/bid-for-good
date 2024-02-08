import bcrypt from 'bcrypt';
const saltRounds = 10;

async function hash(password: string): Promise<string> {
  return bcrypt.hash(password, saltRounds);
}

async function compare(password: string, hashPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashPassword);
}

export { hash, compare };
