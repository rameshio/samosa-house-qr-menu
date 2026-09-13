import crypto from 'crypto';
import prisma from '../prisma/client.js';
import { hashPassword } from '../src/services/authService.js';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function bootstrap() {
  const email = process.env.BOOTSTRAP_OWNER_EMAIL || 'admin@example.com';
  const name = process.env.BOOTSTRAP_OWNER_NAME || 'Admin';

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log('Owner already exists.');
    process.exit(0);
  }

  const password = await question('Enter password for new owner: ');
  if (!password || password.length < 8) {
    console.log('Password must be at least 8 characters.');
    process.exit(1);
  }

  const passwordHash = await hashPassword(password);

  await prisma.user.create({
    data: {
      email,
      displayName: name,
      passwordHash,
      role: 'OWNER'
    }
  });

  console.log("Owner created successfully with email: ${email}");
  process.exit(0);
}

bootstrap().catch(e => {
  console.error(e);
  process.exit(1);
});
