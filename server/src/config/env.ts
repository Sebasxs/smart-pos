import { dirname, resolve } from 'node:path';
import { loadEnvFile } from 'node:process';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';

const environment = process.env.NODE_ENV || 'development';
const envFileName = environment === 'production' ? '.env.production' : '.env.development';

const __dirname = dirname(fileURLToPath(import.meta.url));

const specificEnvPath = resolve(__dirname, '..', '..', envFileName);

console.log(`[DEBUG] Buscando archivo env en: ${specificEnvPath}`);

if (existsSync(specificEnvPath)) {
   try {
      loadEnvFile(specificEnvPath);
      console.log(`[SERVER] ✅ Cargado con éxito: ${envFileName}`);
   } catch (error) {
      console.error(`[SERVER] ❌ Error al cargar ${envFileName}:`, error);
   }
} else {
   console.error(`[SERVER] ⚠️ ARCHIVO NO ENCONTRADO: ${specificEnvPath}`);
}
