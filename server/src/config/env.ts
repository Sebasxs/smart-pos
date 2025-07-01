import { resolve } from 'node:path';
import { loadEnvFile } from 'node:process';
loadEnvFile(resolve(process.cwd(), '.env'));
