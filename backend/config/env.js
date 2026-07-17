import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve path to the root .env file relative to this module file (located in backend/config/env.js)
const rootEnvPath = path.resolve(__dirname, '../../.env');

// Load environment variables from the root .env file, overriding any system-wide variables
dotenv.config({ path: rootEnvPath, override: true });

// Also load from current working directory as fallback (with override support)
dotenv.config({ override: true });
