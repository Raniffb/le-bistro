require('dotenv').config();

const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;
const maxAttempts = 30;
const delayMs = 2000;

async function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function checkConnection() {
  const client = new Client({ connectionString });

  try {
    await client.connect();
    await client.end();
    return true;
  } catch (error) {
    try {
      await client.end();
    } catch {}
    return false;
  }
}

async function main() {
  if (!connectionString) {
    console.error('DATABASE_URL não foi carregada do .env');
    process.exit(1);
  }

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    console.log(
      `Tentativa ${attempt}/${maxAttempts} para conectar no banco...`,
    );

    const ok = await checkConnection();

    if (ok) {
      console.log('Banco disponível.');
      process.exit(0);
    }

    await wait(delayMs);
  }

  console.error('Banco não ficou disponível a tempo.');
  process.exit(1);
}

main();
