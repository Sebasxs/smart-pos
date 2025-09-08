import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadEnvFile } from 'node:process';

const environment: string = process.env.NODE_ENV || 'development';
const envFileName: string = environment === 'production' ? '.env.production' : '.env.development';
const specificEnvPath = resolve(process.cwd(), envFileName);

if (existsSync(specificEnvPath)) {
   try {
      console.log(`Cargando archivo de configuración local: ${specificEnvPath}`);
      loadEnvFile(specificEnvPath);
   } catch (error) {
      console.error(`Error al leer el archivo ${envFileName}, pero continuando...`, error);
   }
}
