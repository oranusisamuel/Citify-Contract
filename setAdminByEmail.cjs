const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
	credential: admin.credential.cert(serviceAccount),
});

// Replace with real admin emails
const adminEmails = [
	'oranusisamuel98@gmail.com',
	
];

async function run() {
	for (const email of adminEmails) {
		try {
			const user = await admin.auth().getUserByEmail(email);
			await admin.auth().setCustomUserClaims(user.uid, { admin: true });
			console.log(`OK: ${email} (uid: ${user.uid}) is now admin`);
		} catch (err) {
			console.error(`FAIL: ${email} -> ${err.message}`);
		}
	}
}

run()
	.then(() => process.exit(0))
	.catch((err) => {
		console.error('Unexpected error:', err);
		process.exit(1);
	});
