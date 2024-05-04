const express = require('express');
const fs = require('fs');
const crypto = require('crypto');
const QRCode = require('qrcode');
const path = require('path');

const app = express();

// Serve static files from the root directory
app.use(express.static(__dirname));

// Load existing private keys from JSON file
let privateKeys = {};
const privateKeysFile = path.join(__dirname, 'privateKeys.json');
if (fs.existsSync(privateKeysFile)) {
    privateKeys = JSON.parse(fs.readFileSync(privateKeysFile));
}

// Function to generate a unique private key for each user
function generatePrivateKey() {
    return crypto.randomBytes(32).toString('hex'); // Generate a random 256-bit key (32 bytes)
}

// Function to encrypt data using a private key
function encryptData(data, privateKey) {
    const cipher = crypto.createCipher('aes-256-cbc', privateKey);
    let encryptedData = cipher.update(data, 'utf8', 'hex');
    encryptedData += cipher.final('hex');
    return encryptedData;
}

// Function to decrypt data using a private key
function decryptData(encryptedData, privateKey) {
    const decipher = crypto.createDecipher('aes-256-cbc', privateKey);
    let decryptedData = decipher.update(encryptedData, 'hex', 'utf8');
    decryptedData += decipher.final('utf8');
    return decryptedData;
}

// Route for login page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

app.get('/qrPage', (req, res) => {
    res.sendFile(path.join(__dirname, 'qrPage.html'));
});


// Route for generating QR code
app.get('/generateQR/:username', (req, res) => {
    const username = req.params.username;

    // Check if private key exists for the username, otherwise generate a new one
    let privateKey = privateKeys[username];
    if (!privateKey) {
        privateKey = generatePrivateKey();
        privateKeys[username] = privateKey;
        fs.writeFileSync(privateKeysFile, JSON.stringify(privateKeys, null, 2));
    }

    // Encrypt the username using the private key
    const encryptedUsername = encryptData(username, privateKey);

    // Generate QR code containing the encrypted username
    QRCode.toDataURL(encryptedUsername, (err, url) => {
        if (err) {
            res.status(500).send('Error generating QR code');
        } else {
            res.send(`
                <!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>QR Code</title>
                </head>
                <body>
                    <img src="${url}" alt="QR Code">
                </body>
                </html>
            `);
        }
    });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
