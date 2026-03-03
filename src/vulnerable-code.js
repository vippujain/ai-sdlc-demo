// VULNERABLE CODE EXAMPLES FOR DEMO
// This file contains intentional security vulnerabilities for demonstration purposes

const express = require('express');
const mysql = require('mysql');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const app = express();

// VULNERABILITY 1: SQL Injection
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  // VULNERABLE: Direct string concatenation in SQL query
  const query = "SELECT * FROM users WHERE id = '" + userId + "'";
  // This allows SQL injection attacks
  res.send(query);
});

// VULNERABILITY 2: Hardcoded Credentials
const dbConfig = {
  host: 'localhost',
  user: 'admin',
  password: 'SuperSecretPassword123!', // HARDCODED PASSWORD
  database: 'myapp'
};

// VULNERABILITY 3: Insecure Deserialization
app.post('/deserialize', (req, res) => {
  const data = req.body.data;
  // VULNERABLE: Using eval() on user input
  const result = eval(data);
  res.json(result);
});

// VULNERABILITY 4: Path Traversal
app.get('/file/:filename', (req, res) => {
  const filename = req.params.filename;
  // VULNERABLE: No path validation
  const filepath = path.join('/uploads', filename);
  res.sendFile(filepath);
});

// VULNERABILITY 5: Weak Cryptography
function hashPassword(password) {
  // VULNERABLE: Using MD5 which is cryptographically broken
  return crypto.createHash('md5').update(password).digest('hex');
}

// VULNERABILITY 6: Command Injection
app.post('/execute', (req, res) => {
  const command = req.body.command;
  // VULNERABLE: Using child_process.exec with user input
  const { exec } = require('child_process');
  exec(command, (error, stdout, stderr) => {
    res.send(stdout);
  });
});

// VULNERABILITY 7: Insecure Random Number Generation
function generateToken() {
  // VULNERABLE: Using Math.random() for security tokens
  return Math.random().toString(36).substring(2, 15);
}

// VULNERABILITY 8: XXE (XML External Entity)
const xml2js = require('xml2js');
app.post('/parse-xml', (req, res) => {
  const xmlData = req.body.xml;
  // VULNERABLE: No XXE protection
  const parser = new xml2js.Parser();
  parser.parseString(xmlData, (err, result) => {
    res.json(result);
  });
});

// VULNERABILITY 9: CSRF Token Missing
app.post('/transfer-money', (req, res) => {
  const amount = req.body.amount;
  const recipient = req.body.recipient;
  // VULNERABLE: No CSRF token validation
  // Process transfer
  res.send('Transfer complete');
});

// VULNERABILITY 10: Insecure Direct Object Reference (IDOR)
app.get('/profile/:userId', (req, res) => {
  const userId = req.params.userId;
  // VULNERABLE: No authorization check
  const userProfile = getUserProfile(userId);
  res.json(userProfile);
});

// VULNERABILITY 11: Sensitive Data Exposure
app.get('/api/user-data', (req, res) => {
  const userData = {
    id: 123,
    name: 'John Doe',
    email: 'john@example.com',
    ssn: '123-45-6789', // SENSITIVE DATA
    creditCard: '4532-1234-5678-9010', // SENSITIVE DATA
    password: 'plaintext_password' // SENSITIVE DATA
  };
  res.json(userData);
});

// VULNERABILITY 12: Broken Authentication
app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  // VULNERABLE: No rate limiting, weak password validation
  if (username && password) {
    // Grant access without proper validation
    res.json({ token: 'fake-token-' + username });
  }
});

// VULNERABILITY 13: Broken Access Control
app.delete('/admin/user/:id', (req, res) => {
  // VULNERABLE: No role-based access control
  const userId = req.params.id;
  deleteUser(userId);
  res.send('User deleted');
});

// VULNERABILITY 14: Security Misconfiguration
app.use((err, req, res, next) => {
  // VULNERABLE: Exposing stack traces in error responses
  res.status(500).json({
    error: err.message,
    stack: err.stack // EXPOSES INTERNAL DETAILS
  });
});

// VULNERABILITY 15: Using Components with Known Vulnerabilities
// All the dependencies in package.json are outdated versions with known CVEs

// VULNERABILITY 16: Insufficient Logging & Monitoring
app.get('/sensitive-operation', (req, res) => {
  // VULNERABLE: No logging of sensitive operations
  const apiKey = req.headers['x-api-key'];
  // Process sensitive operation without logging
  res.send('Operation complete');
});

// VULNERABILITY 17: Broken Cryptography
function encryptData(data, key) {
  // VULNERABLE: Using ECB mode (deterministic encryption)
  const cipher = crypto.createCipher('aes-256-ecb', key);
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
}

// VULNERABILITY 18: Insecure File Upload
app.post('/upload', (req, res) => {
  const file = req.files.upload;
  // VULNERABLE: No file type validation
  const uploadPath = path.join('/uploads', file.name);
  file.mv(uploadPath, (err) => {
    res.send('File uploaded');
  });
});

// VULNERABILITY 19: Missing Security Headers
app.get('/page', (req, res) => {
  // VULNERABLE: No security headers
  res.send('<html><body>Hello</body></html>');
});

// VULNERABILITY 20: Unvalidated Redirects
app.get('/redirect', (req, res) => {
  const url = req.query.url;
  // VULNERABLE: No URL validation
  res.redirect(url);
});

// Additional vulnerable patterns repeated for scale
for (let i = 0; i < 100; i++) {
  app.get(`/vulnerable-endpoint-${i}`, (req, res) => {
    const input = req.query.input;
    // VULNERABLE: Repeated SQL injection patterns
    const query = `SELECT * FROM table_${i} WHERE id = '${input}'`;
    res.send(query);
  });
}

module.exports = app;
