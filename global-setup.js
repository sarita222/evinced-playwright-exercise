// Runs once before all tests: logs the Evinced SDK in
import { setCredentials } from '@evinced/js-playwright-sdk';

export default async function globalSetup() {
  await setCredentials({
    serviceId: process.env.EVINCED_SERVICE_ID,
    secret: process.env.EVINCED_API_KEY,
  });
console.log('Evinced credentials set');
}