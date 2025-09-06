import { resolve } from 'node:path';
import { loadEnvFile } from 'node:process';

try {
   loadEnvFile(resolve(process.cwd(), '.env'));
} catch (error) {
   console.error('Error al cargar el archivo .env:', error);
}
