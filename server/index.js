import cors from 'cors';
import express from 'express';

// Load environment variables from .env file
import dotenv from 'dotenv';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

// Import authentication controllers
import { Google, Account } from '../lib/controller.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: __dirname + '/.env' });

// express app
const app = express();

// ========================================================================

/**
 * Add this line to enable JSON parsing
 */
app.use(express.json());

/**
 * This is a proxy option for the dev server.
 * It will proxy /api from the client to the routes.
 * Handles Cross-Origin Resource Sharing (CORS) errors.
 */
app.use(cors());

// ========================================================================

/**
 * Google token authentication middleware
 * includes req.account object
 *
 */
app.use(Google.authenticate);
app.get('/api/account/authenticate', Account.authenticate);
// app.get('/api/account/session', Account.session);

// ========================================================================
app.use((err, req, res, next) => {
	console.error(err.stack);
	res.status(500).send('Something broke!');
});

app.listen(process.env.EXPRESS_PORT, () => {
	console.log(`Server is running on port ${process.env.EXPRESS_PORT}`);
});