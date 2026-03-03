const express = require('express');
const mysql = require('mysql');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const xml2js = require('xml2js');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ============================================
// VULNERABILITY SECTION 1: SQL INJECTION (50 instances)
// ============================================

for (let i = 0; i < 50; i++) {
  app.get(`/user-sql-${i}/:id`, (req, res) => {
    const userId = req.params.id;
    const query = "SELECT * FROM users WHERE id = '" + userId + "'";
    res.send({ query, vulnerable: true });
  });
}

// ============================================
// VULNERABILITY SECTION 2: HARDCODED SECRETS (100 instances)
// ============================================

const secrets = [
  { api_key: 'sk-1234567890abcdef1234567890abcdef', service: 'stripe' },
  { db_password: 'SuperSecretPassword123!', host: 'db.example.com' },
  { aws_secret: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY', region: 'us-east-1' },
  { github_token: 'ghp_1234567890abcdefghijklmnopqrstuvwxyz', scope: 'repo' },
  { slack_webhook: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXX' },
  { jwt_secret: 'my-super-secret-jwt-key-do-not-share', algorithm: 'HS256' },
  { oauth_client_secret: 'client_secret_1234567890abcdefghijklmnop', provider: 'google' },
  { database_url: 'postgresql://user:password@localhost:5432/mydb', ssl: false },
  { api_secret: 'secret_key_12345678901234567890123456789012', version: 'v1' },
  { private_key: '-----BEGIN RSA PRIVATE KEY-----\nMIIEpAIBAAKCAQEA1234567890...', format: 'pem' },
];

for (let i = 0; i < 100; i++) {
  const secretIndex = i % secrets.length;
  app.get(`/secret-${i}`, (req, res) => {
    res.json(secrets[secretIndex]);
  });
}

// ============================================
// VULNERABILITY SECTION 3: INSECURE DESERIALIZATION (40 instances)
// ============================================

for (let i = 0; i < 40; i++) {
  app.post(`/deserialize-${i}`, (req, res) => {
    try {
      const data = req.body.data;
      const result = eval(data);
      res.json({ result });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
}

// ============================================
// VULNERABILITY SECTION 4: PATH TRAVERSAL (50 instances)
// ============================================

for (let i = 0; i < 50; i++) {
  app.get(`/file-${i}/:filename`, (req, res) => {
    const filename = req.params.filename;
    const filepath = path.join('/uploads', filename);
    try {
      res.sendFile(filepath);
    } catch (e) {
      res.status(404).json({ error: 'File not found' });
    }
  });
}

// ============================================
// VULNERABILITY SECTION 5: WEAK CRYPTOGRAPHY (60 instances)
// ============================================

for (let i = 0; i < 60; i++) {
  app.post(`/hash-${i}`, (req, res) => {
    const password = req.body.password;
    const hash = crypto.createHash('md5').update(password).digest('hex');
    res.json({ hash });
  });
}

// ============================================
// VULNERABILITY SECTION 6: COMMAND INJECTION (45 instances)
// ============================================

for (let i = 0; i < 45; i++) {
  app.post(`/execute-${i}`, (req, res) => {
    const command = req.body.command;
    exec(command, (error, stdout, stderr) => {
      if (error) {
        res.status(500).json({ error: error.message });
      } else {
        res.json({ output: stdout });
      }
    });
  });
}

// ============================================
// VULNERABILITY SECTION 7: INSECURE RANDOM (35 instances)
// ============================================

for (let i = 0; i < 35; i++) {
  app.get(`/token-${i}`, (req, res) => {
    const token = Math.random().toString(36).substring(2, 15);
    res.json({ token });
  });
}

// ============================================
// VULNERABILITY SECTION 8: XXE INJECTION (30 instances)
// ============================================

for (let i = 0; i < 30; i++) {
  app.post(`/parse-xml-${i}`, (req, res) => {
    const xmlData = req.body.xml;
    const parser = new xml2js.Parser();
    parser.parseString(xmlData, (err, result) => {
      if (err) {
        res.status(400).json({ error: err.message });
      } else {
        res.json(result);
      }
    });
  });
}

// ============================================
// VULNERABILITY SECTION 9: CSRF MISSING (40 instances)
// ============================================

for (let i = 0; i < 40; i++) {
  app.post(`/transfer-${i}`, (req, res) => {
    const amount = req.body.amount;
    const recipient = req.body.recipient;
    res.json({ status: 'success', message: 'Transfer complete' });
  });
}

// ============================================
// VULNERABILITY SECTION 10: IDOR (50 instances)
// ============================================

for (let i = 0; i < 50; i++) {
  app.get(`/profile-${i}/:userId`, (req, res) => {
    const userId = req.params.userId;
    const userProfile = {
      id: userId,
      name: 'User ' + userId,
      email: `user${userId}@example.com`,
      ssn: '123-45-6789',
      creditCard: '4532-1234-5678-9010'
    };
    res.json(userProfile);
  });
}

// ============================================
// VULNERABILITY SECTION 11: SENSITIVE DATA EXPOSURE (45 instances)
// ============================================

for (let i = 0; i < 45; i++) {
  app.get(`/user-data-${i}`, (req, res) => {
    const userData = {
      id: 123 + i,
      name: 'User ' + i,
      email: `user${i}@example.com`,
      ssn: '123-45-6789',
      creditCard: '4532-1234-5678-9010',
      password: 'plaintext_password_' + i,
      apiKey: 'sk_live_' + Math.random().toString(36).substring(7)
    };
    res.json(userData);
  });
}

// ============================================
// VULNERABILITY SECTION 12: BROKEN AUTHENTICATION (35 instances)
// ============================================

for (let i = 0; i < 35; i++) {
  app.post(`/login-${i}`, (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      res.json({ token: 'fake-token-' + username + '-' + i });
    } else {
      res.status(400).json({ error: 'Missing credentials' });
    }
  });
}

// ============================================
// VULNERABILITY SECTION 13: BROKEN ACCESS CONTROL (40 instances)
// ============================================

for (let i = 0; i < 40; i++) {
  app.delete(`/admin-delete-${i}/:id`, (req, res) => {
    const userId = req.params.id;
    res.json({ status: 'success', message: 'User ' + userId + ' deleted' });
  });
}

// ============================================
// VULNERABILITY SECTION 14: SECURITY MISCONFIGURATION (50 instances)
// ============================================

for (let i = 0; i < 50; i++) {
  app.get(`/config-${i}`, (req, res) => {
    const config = {
      database: 'mydb',
      host: 'localhost',
      port: 5432,
      user: 'admin',
      password: 'password123',
      debug: true,
      apiKey: 'sk_test_1234567890',
      environment: 'production'
    };
    res.json(config);
  });
}

// ============================================
// VULNERABILITY SECTION 15: INSUFFICIENT LOGGING (30 instances)
// ============================================

for (let i = 0; i < 30; i++) {
  app.get(`/sensitive-op-${i}`, (req, res) => {
    const apiKey = req.headers['x-api-key'];
    res.json({ status: 'success', message: 'Operation complete' });
  });
}

// ============================================
// VULNERABILITY SECTION 16: BROKEN CRYPTOGRAPHY (40 instances)
// ============================================

for (let i = 0; i < 40; i++) {
  app.post(`/encrypt-${i}`, (req, res) => {
    const data = req.body.data;
    const key = req.body.key || 'default-key';
    try {
      const cipher = crypto.createCipher('aes-256-ecb', key);
      let encrypted = cipher.update(data, 'utf8', 'hex');
      encrypted += cipher.final('hex');
      res.json({ encrypted });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
}

// ============================================
// VULNERABILITY SECTION 17: INSECURE FILE UPLOAD (35 instances)
// ============================================

for (let i = 0; i < 35; i++) {
  app.post(`/upload-${i}`, (req, res) => {
    const filename = req.body.filename || 'file.txt';
    const uploadPath = path.join('/uploads', filename);
    res.json({ status: 'success', path: uploadPath });
  });
}

// ============================================
// VULNERABILITY SECTION 18: MISSING SECURITY HEADERS (50 instances)
// ============================================

for (let i = 0; i < 50; i++) {
  app.get(`/page-${i}`, (req, res) => {
    res.send(`<html><body>Page ${i}</body></html>`);
  });
}

// ============================================
// VULNERABILITY SECTION 19: UNVALIDATED REDIRECTS (30 instances)
// ============================================

for (let i = 0; i < 30; i++) {
  app.get(`/redirect-${i}`, (req, res) => {
    const url = req.query.url || '/';
    res.redirect(url);
  });
}

// ============================================
// VULNERABILITY SECTION 20: INJECTION ATTACKS (60 instances)
// ============================================

for (let i = 0; i < 60; i++) {
  app.get(`/search-${i}`, (req, res) => {
    const query = req.query.q;
    const dbQuery = `SELECT * FROM products WHERE name LIKE '%${query}%'`;
    res.json({ query: dbQuery });
  });
}

// ============================================
// VULNERABILITY SECTION 21: TEMPLATE INJECTION (25 instances)
// ============================================

for (let i = 0; i < 25; i++) {
  app.post(`/template-${i}`, (req, res) => {
    const template = req.body.template;
    try {
      const result = eval(`\`${template}\``);
      res.json({ result });
    } catch (e) {
      res.status(400).json({ error: e.message });
    }
  });
}

// ============================================
// VULNERABILITY SECTION 22: PROTOTYPE POLLUTION (35 instances)
// ============================================

for (let i = 0; i < 35; i++) {
  app.post(`/merge-${i}`, (req, res) => {
    const obj = {};
    const userInput = req.body.data;
    Object.assign(obj, userInput);
    res.json({ status: 'success' });
  });
}

// ============================================
// VULNERABILITY SECTION 23: RACE CONDITIONS (20 instances)
// ============================================

let counter = 0;
for (let i = 0; i < 20; i++) {
  app.post(`/increment-${i}`, (req, res) => {
    const temp = counter;
    setTimeout(() => {
      counter = temp + 1;
      res.json({ counter });
    }, 10);
  });
}

// ============================================
// VULNERABILITY SECTION 24: INSECURE DEPENDENCIES (100 instances)
// ============================================

for (let i = 0; i < 100; i++) {
  app.get(`/dep-${i}`, (req, res) => {
    res.json({ message: 'Using vulnerable dependencies' });
  });
}

// ============================================
// VULNERABILITY SECTION 25: INFORMATION DISCLOSURE (50 instances)
// ============================================

for (let i = 0; i < 50; i++) {
  app.get(`/info-${i}`, (req, res) => {
    try {
      throw new Error('Intentional error for demo');
    } catch (e) {
      res.json({
        error: e.message,
        stack: e.stack,
        nodeVersion: process.version,
        platform: process.platform,
        cwd: process.cwd()
      });
    }
  });
}

// ============================================
// MAIN ENDPOINT: HELLO WORLD
// ============================================

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// ============================================
// ERROR HANDLER
// ============================================

app.use((err, req, res, next) => {
  res.status(500).json({
    error: err.message,
    stack: err.stack
  });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Visit http://localhost:${PORT}/ to see Hello World!`);
});

module.exports = app;
