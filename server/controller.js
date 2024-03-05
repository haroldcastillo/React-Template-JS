import { OAuth2Client } from 'google-auth-library';

// Google OAuth2 client ID
const CLIENT_ID = '987122640202-cttf76h8r41jmu6fp13ihoun32nuigq1.apps.googleusercontent.com';

export const Google = {
	// Middleware to authenticate the Google token provided in the request header
	// and retrieve the user information from the token payload

	authenticate: async (req, res, next) => {
		const token = req.headers.authorization && req.headers.authorization.split(' ')[1];

		if (!token) {
			return res.status(400).json({ error: 'Token not provided' });
		}

		const client = new OAuth2Client(CLIENT_ID);

		try {
			const ticket = await client.verifyIdToken({
				idToken: token,
				audience: CLIENT_ID,
			});

			const payload = ticket.getPayload();
			// Here, you can access user information from the decoded token payload
			// For example, you can use payload.sub to get the user ID

			req.account = payload; // Attach the user information to the response object
			next(); // Call the next middleware or route handler
		} 
		catch (error) {
			console.error('Error verifying token:', error.message);
			return res.status(401).json({ error: 'Invalid token' });
		}
	},
};

export const Account = {
	// Route handler to authenticate the user and send the user information

	authenticate: (req, res) => res.status(200).send(req.account),
};