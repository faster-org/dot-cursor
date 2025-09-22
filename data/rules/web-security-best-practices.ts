import { Rule } from "../types";

export const rule: Rule = {
	id: "web-security-best-practices",
	slug: "web-security-best-practices",
	title: "Web Security Best Practices",
	tags: ["security", "web", "authentication", "encryption", "owasp"],
	languages: ["javascript", "typescript", "php", "python"],
	description:
		"Implement comprehensive web security measures including authentication, authorization, and protection against common vulnerabilities",
	content: `# Web Security Best Practices

## 1. Authentication and Authorization

### Secure Authentication Implementation
\`\`\`javascript
// Secure password hashing with bcrypt
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

class AuthService {
  constructor() {
    this.saltRounds = 12;
    this.jwtSecret = process.env.JWT_SECRET;
    this.jwtExpiry = '15m';
    this.refreshTokenExpiry = '7d';
  }

  async hashPassword(password) {
    // Validate password strength
    if (!this.isPasswordSecure(password)) {
      throw new Error('Password does not meet security requirements');
    }

    return await bcrypt.hash(password, this.saltRounds);
  }

  async verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  isPasswordSecure(password) {
    // Minimum 12 characters, at least one uppercase, lowercase, number, and special character
    const minLength = 12;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);

    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecial;
  }

  generateTokens(userId, userRole) {
    const payload = {
      userId,
      role: userRole,
      type: 'access'
    };

    const accessToken = jwt.sign(payload, this.jwtSecret, {
      expiresIn: this.jwtExpiry,
      issuer: 'your-app',
      audience: 'your-app-users'
    });

    const refreshPayload = {
      userId,
      type: 'refresh',
      jti: crypto.randomBytes(16).toString('hex') // JWT ID for token revocation
    };

    const refreshToken = jwt.sign(refreshPayload, this.jwtSecret, {
      expiresIn: this.refreshTokenExpiry,
      issuer: 'your-app',
      audience: 'your-app-users'
    });

    return { accessToken, refreshToken };
  }

  verifyToken(token, expectedType = 'access') {
    try {
      const decoded = jwt.verify(token, this.jwtSecret, {
        issuer: 'your-app',
        audience: 'your-app-users'
      });

      if (decoded.type !== expectedType) {
        throw new Error('Invalid token type');
      }

      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  // Rate limiting for authentication attempts
  async checkAuthAttempts(identifier) {
    const key = \`auth_attempts:\${identifier}\`;
    const attempts = await redis.get(key) || 0;

    if (attempts >= 5) {
      const ttl = await redis.ttl(key);
      throw new Error(\`Too many authentication attempts. Try again in \${ttl} seconds\`);
    }

    return true;
  }

  async recordAuthAttempt(identifier, success) {
    const key = \`auth_attempts:\${identifier}\`;

    if (success) {
      await redis.del(key);
    } else {
      await redis.incr(key);
      await redis.expire(key, 900); // 15 minutes lockout
    }
  }
}
\`\`\`

### Multi-Factor Authentication (MFA)
\`\`\`javascript
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');

class MFAService {
  generateSecret(userEmail) {
    const secret = speakeasy.generateSecret({
      name: userEmail,
      issuer: 'Your App Name',
      length: 32
    });

    return {
      secret: secret.base32,
      qrCodeUrl: secret.otpauth_url,
      backupCodes: this.generateBackupCodes()
    };
  }

  async generateQRCode(otpauthUrl) {
    return await QRCode.toDataURL(otpauthUrl);
  }

  verifyToken(secret, token) {
    return speakeasy.totp.verify({
      secret,
      encoding: 'base32',
      token,
      window: 2 // Allow 2 time steps of tolerance
    });
  }

  generateBackupCodes() {
    const codes = [];
    for (let i = 0; i < 10; i++) {
      codes.push(crypto.randomBytes(4).toString('hex').toUpperCase());
    }
    return codes;
  }

  async validateBackupCode(userId, code) {
    // Retrieve user's backup codes from database
    const user = await User.findById(userId);
    const codeIndex = user.backupCodes.indexOf(code);

    if (codeIndex === -1) {
      return false;
    }

    // Remove used backup code
    user.backupCodes.splice(codeIndex, 1);
    await user.save();

    return true;
  }
}
\`\`\`

## 2. Input Validation and Sanitization

### Comprehensive Input Validation
\`\`\`javascript
const validator = require('validator');
const DOMPurify = require('isomorphic-dompurify');

class InputValidator {
  static validateEmail(email) {
    if (!email || typeof email !== 'string') {
      throw new Error('Email is required and must be a string');
    }

    if (!validator.isEmail(email)) {
      throw new Error('Invalid email format');
    }

    if (email.length > 254) {
      throw new Error('Email address too long');
    }

    return email.toLowerCase().trim();
  }

  static validateUrl(url, options = {}) {
    const defaultOptions = {
      require_protocol: true,
      require_host: true,
      require_valid_protocol: true,
      allow_underscores: false,
      host_whitelist: false,
      host_blacklist: false,
      allow_trailing_dot: false,
      allow_protocol_relative_urls: false
    };

    const validationOptions = { ...defaultOptions, ...options };

    if (!validator.isURL(url, validationOptions)) {
      throw new Error('Invalid URL format');
    }

    return url;
  }

  static sanitizeHtml(input) {
    if (typeof input !== 'string') {
      throw new Error('Input must be a string');
    }

    // Configure DOMPurify to allow only safe tags and attributes
    const config = {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li'],
      ALLOWED_ATTR: ['href', 'title'],
      ALLOW_DATA_ATTR: false,
      ALLOW_UNKNOWN_PROTOCOLS: false
    };

    return DOMPurify.sanitize(input, config);
  }

  static validateAndSanitizeInput(input, rules) {
    const errors = [];
    let sanitizedInput = input;

    // Required field validation
    if (rules.required && (!input || input.toString().trim().length === 0)) {
      errors.push('This field is required');
    }

    if (input) {
      // Type validation
      if (rules.type === 'email') {
        try {
          sanitizedInput = this.validateEmail(input);
        } catch (error) {
          errors.push(error.message);
        }
      }

      if (rules.type === 'url') {
        try {
          sanitizedInput = this.validateUrl(input, rules.urlOptions);
        } catch (error) {
          errors.push(error.message);
        }
      }

      // Length validation
      if (rules.minLength && input.length < rules.minLength) {
        errors.push(\`Minimum length is \${rules.minLength} characters\`);
      }

      if (rules.maxLength && input.length > rules.maxLength) {
        errors.push(\`Maximum length is \${rules.maxLength} characters\`);
      }

      // Pattern validation
      if (rules.pattern && !rules.pattern.test(input)) {
        errors.push(rules.patternMessage || 'Invalid format');
      }

      // Custom validation function
      if (rules.customValidator) {
        try {
          sanitizedInput = rules.customValidator(input);
        } catch (error) {
          errors.push(error.message);
        }
      }

      // Sanitization
      if (rules.sanitize === 'html') {
        sanitizedInput = this.sanitizeHtml(sanitizedInput);
      }

      if (rules.sanitize === 'trim') {
        sanitizedInput = sanitizedInput.toString().trim();
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
      sanitizedValue: sanitizedInput
    };
  }

  // SQL injection prevention
  static preventSQLInjection(query, params) {
    // Use parameterized queries with prepared statements
    // Example with mysql2
    return db.execute(query, params);
  }

  // NoSQL injection prevention
  static sanitizeMongoQuery(query) {
    if (typeof query !== 'object' || query === null) {
      return query;
    }

    const sanitized = {};
    for (const [key, value] of Object.entries(query)) {
      // Prevent operator injection
      if (key.startsWith('$')) {
        continue;
      }

      if (typeof value === 'object' && value !== null) {
        sanitized[key] = this.sanitizeMongoQuery(value);
      } else {
        sanitized[key] = value;
      }
    }

    return sanitized;
  }
}
\`\`\`

## 3. HTTPS and Transport Security

### SSL/TLS Configuration
\`\`\`javascript
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const app = express();

// Security headers with Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", "trusted-cdn.com"],
      styleSrc: ["'self'", "'unsafe-inline'", "trusted-cdn.com"],
      imgSrc: ["'self'", "data:", "trusted-cdn.com"],
      connectSrc: ["'self'"],
      fontSrc: ["'self'", "trusted-cdn.com"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  hsts: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true
  },
  noSniff: true,
  frameguard: { action: 'deny' },
  xssFilter: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/', limiter);

// Strict rate limiting for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  message: 'Too many authentication attempts, please try again later.'
});

app.use('/api/auth/', authLimiter);

// HTTPS redirect middleware
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https') {
    res.redirect(\`https://\${req.header('host')}\${req.url}\`);
  } else {
    next();
  }
});
\`\`\`

### Certificate Pinning and HSTS
\`\`\`javascript
// Certificate pinning middleware
const crypto = require('crypto');

function certificatePinning(expectedFingerprints) {
  return (req, res, next) => {
    const cert = req.connection.getPeerCertificate();

    if (!cert || !cert.raw) {
      return res.status(400).json({ error: 'No certificate provided' });
    }

    const fingerprint = crypto
      .createHash('sha256')
      .update(cert.raw)
      .digest('hex');

    if (!expectedFingerprints.includes(fingerprint)) {
      return res.status(400).json({ error: 'Certificate validation failed' });
    }

    next();
  };
}

// Use certificate pinning for critical endpoints
app.use('/api/admin/', certificatePinning([
  'expected-certificate-fingerprint-1',
  'expected-certificate-fingerprint-2'
]));
\`\`\`

## 4. Cross-Site Scripting (XSS) Prevention

### XSS Protection Strategies
\`\`\`javascript
const createDOMPurify = require('dompurify');
const { JSDOM } = require('jsdom');

const window = new JSDOM('').window;
const DOMPurify = createDOMPurify(window);

class XSSProtection {
  static sanitizeUserInput(input, options = {}) {
    const defaultConfig = {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'h1', 'h2', 'h3'],
      ALLOWED_ATTR: ['href', 'title', 'alt'],
      ALLOW_DATA_ATTR: false,
      ALLOW_UNKNOWN_PROTOCOLS: false,
      RETURN_TRUSTED_TYPE: true
    };

    const config = { ...defaultConfig, ...options };
    return DOMPurify.sanitize(input, config);
  }

  static escapeHtml(text) {
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };

    return text.replace(/[&<>"']/g, function(m) { return map[m]; });
  }

  static validateCSP(req, res, next) {
    // Generate nonce for inline scripts
    const nonce = crypto.randomBytes(16).toString('base64');
    res.locals.nonce = nonce;

    // Set CSP header with nonce
    res.setHeader('Content-Security-Policy',
      \`default-src 'self'; script-src 'self' 'nonce-\${nonce}'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; object-src 'none';\`
    );

    next();
  }

  // Template rendering with automatic escaping
  static renderTemplate(templateString, data) {
    // Escape all variables by default
    const escapedData = {};
    for (const [key, value] of Object.entries(data)) {
      if (typeof value === 'string') {
        escapedData[key] = this.escapeHtml(value);
      } else {
        escapedData[key] = value;
      }
    }

    return templateString.replace(/{{\\s*(.*?)\\s*}}/g, (match, variable) => {
      return escapedData[variable.trim()] || '';
    });
  }
}

// Express middleware for XSS protection
app.use((req, res, next) => {
  // Sanitize query parameters
  for (const [key, value] of Object.entries(req.query)) {
    if (typeof value === 'string') {
      req.query[key] = XSSProtection.sanitizeUserInput(value);
    }
  }

  // Sanitize body parameters
  if (req.body && typeof req.body === 'object') {
    for (const [key, value] of Object.entries(req.body)) {
      if (typeof value === 'string') {
        req.body[key] = XSSProtection.sanitizeUserInput(value);
      }
    }
  }

  next();
});
\`\`\`

## 5. Cross-Site Request Forgery (CSRF) Protection

### CSRF Token Implementation
\`\`\`javascript
const csrf = require('csurf');

// CSRF protection middleware
const csrfProtection = csrf({
  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  }
});

app.use(csrfProtection);

// Provide CSRF token to templates
app.use((req, res, next) => {
  res.locals.csrfToken = req.csrfToken();
  next();
});

// Custom CSRF implementation
class CSRFProtection {
  static generateToken() {
    return crypto.randomBytes(32).toString('hex');
  }

  static validateToken(sessionToken, requestToken) {
    if (!sessionToken || !requestToken) {
      return false;
    }

    return crypto.timingSafeEqual(
      Buffer.from(sessionToken, 'hex'),
      Buffer.from(requestToken, 'hex')
    );
  }

  static middleware(req, res, next) {
    if (req.method === 'GET' || req.method === 'HEAD' || req.method === 'OPTIONS') {
      return next();
    }

    const sessionToken = req.session.csrfToken;
    const requestToken = req.body._csrf || req.headers['x-csrf-token'];

    if (!this.validateToken(sessionToken, requestToken)) {
      return res.status(403).json({ error: 'Invalid CSRF token' });
    }

    next();
  }
}

// Apply CSRF protection to state-changing operations
app.use('/api/', CSRFProtection.middleware);
\`\`\`

## 6. Secure Session Management

### Session Security Implementation
\`\`\`javascript
const session = require('express-session');
const MongoStore = require('connect-mongo');

// Secure session configuration
app.use(session({
  secret: process.env.SESSION_SECRET,
  name: 'sessionId', // Don't use default name
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    httpOnly: true, // Prevent XSS access to cookies
    maxAge: 1000 * 60 * 30, // 30 minutes
    sameSite: 'strict' // CSRF protection
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    touchAfter: 24 * 3600 // lazy session update
  })
}));

class SessionManager {
  static regenerateSession(req) {
    return new Promise((resolve, reject) => {
      req.session.regenerate((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  static destroySession(req) {
    return new Promise((resolve, reject) => {
      req.session.destroy((err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  static async secureLogin(req, user) {
    // Regenerate session ID to prevent session fixation
    await this.regenerateSession(req);

    // Store minimal user information in session
    req.session.userId = user.id;
    req.session.userRole = user.role;
    req.session.loginTime = new Date();

    // Track session for security monitoring
    await this.trackSession(req.session.id, user.id, req.ip);
  }

  static async trackSession(sessionId, userId, ip) {
    await SessionLog.create({
      sessionId,
      userId,
      ip,
      userAgent: req.headers['user-agent'],
      createdAt: new Date()
    });
  }

  static async validateSession(req, res, next) {
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    // Check session age
    const sessionAge = Date.now() - new Date(req.session.loginTime).getTime();
    const maxSessionAge = 1000 * 60 * 60 * 8; // 8 hours

    if (sessionAge > maxSessionAge) {
      await this.destroySession(req);
      return res.status(401).json({ error: 'Session expired' });
    }

    // Check for suspicious activity
    const suspiciousActivity = await this.checkSuspiciousActivity(req.session.userId, req.ip);
    if (suspiciousActivity) {
      await this.destroySession(req);
      return res.status(401).json({ error: 'Suspicious activity detected' });
    }

    next();
  }

  static async checkSuspiciousActivity(userId, currentIp) {
    // Check for multiple concurrent sessions from different IPs
    const recentSessions = await SessionLog.find({
      userId,
      createdAt: { $gte: new Date(Date.now() - 1000 * 60 * 60) } // Last hour
    });

    const uniqueIPs = [...new Set(recentSessions.map(s => s.ip))];
    return uniqueIPs.length > 3; // More than 3 different IPs in an hour
  }
}
\`\`\`

## 7. File Upload Security

### Secure File Upload Implementation
\`\`\`javascript
const multer = require('multer');
const path = require('path');
const crypto = require('crypto');

class SecureFileUpload {
  constructor() {
    this.allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'application/pdf',
      'text/plain'
    ];

    this.maxFileSize = 5 * 1024 * 1024; // 5MB
    this.uploadDir = path.join(__dirname, '../uploads');
  }

  createUploadMiddleware() {
    const storage = multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, this.uploadDir);
      },
      filename: (req, file, cb) => {
        // Generate secure random filename
        const uniqueName = crypto.randomBytes(16).toString('hex');
        const extension = path.extname(file.originalname);
        cb(null, uniqueName + extension);
      }
    });

    return multer({
      storage,
      limits: {
        fileSize: this.maxFileSize,
        files: 5 // Maximum 5 files
      },
      fileFilter: this.fileFilter.bind(this)
    });
  }

  fileFilter(req, file, cb) {
    // Check MIME type
    if (!this.allowedMimeTypes.includes(file.mimetype)) {
      return cb(new Error('File type not allowed'), false);
    }

    // Check file extension
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.pdf', '.txt'];
    const fileExtension = path.extname(file.originalname).toLowerCase();

    if (!allowedExtensions.includes(fileExtension)) {
      return cb(new Error('File extension not allowed'), false);
    }

    // Additional checks can be added here
    cb(null, true);
  }

  async validateFileContent(filePath) {
    const fs = require('fs').promises;

    try {
      // Read file header to verify actual file type
      const fileBuffer = await fs.readFile(filePath);
      const fileSignature = fileBuffer.toString('hex', 0, 4);

      const signatures = {
        '89504e47': 'image/png',
        'ffd8ffe0': 'image/jpeg',
        'ffd8ffe1': 'image/jpeg',
        'ffd8ffe2': 'image/jpeg',
        '47494638': 'image/gif',
        '25504446': 'application/pdf'
      };

      const detectedType = signatures[fileSignature];

      if (!detectedType || !this.allowedMimeTypes.includes(detectedType)) {
        await fs.unlink(filePath); // Delete suspicious file
        throw new Error('File content does not match extension');
      }

      return true;
    } catch (error) {
      throw new Error('File validation failed');
    }
  }

  async scanForMalware(filePath) {
    // Implement virus scanning (e.g., using ClamAV)
    // This is a placeholder for actual malware scanning
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 100); // Simulated scan
    });
  }

  generateSecureUrl(filename) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiry = Date.now() + (1000 * 60 * 60); // 1 hour

    // Store token with expiry in Redis or database
    redis.setex(\`file_token:\${token}\`, 3600, JSON.stringify({
      filename,
      expiry
    }));

    return \`/secure-files/\${token}\`;
  }
}

// Usage example
const fileUpload = new SecureFileUpload();
const upload = fileUpload.createUploadMiddleware();

app.post('/upload', upload.array('files'), async (req, res) => {
  try {
    for (const file of req.files) {
      // Validate file content
      await fileUpload.validateFileContent(file.path);

      // Scan for malware
      const isClean = await fileUpload.scanForMalware(file.path);
      if (!isClean) {
        await fs.unlink(file.path);
        throw new Error('File failed security scan');
      }

      // Generate secure access URL
      const secureUrl = fileUpload.generateSecureUrl(file.filename);
      file.secureUrl = secureUrl;
    }

    res.json({
      message: 'Files uploaded successfully',
      files: req.files.map(f => ({
        originalName: f.originalname,
        size: f.size,
        secureUrl: f.secureUrl
      }))
    });

  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});
\`\`\`

## Checklist for Web Security Implementation

- [ ] Implement secure password hashing with bcrypt
- [ ] Set up JWT tokens with proper expiration and rotation
- [ ] Add multi-factor authentication support
- [ ] Implement comprehensive input validation and sanitization
- [ ] Configure HTTPS with proper SSL/TLS settings
- [ ] Set up security headers (CSP, HSTS, etc.)
- [ ] Implement XSS protection with content sanitization
- [ ] Add CSRF protection for state-changing operations
- [ ] Configure secure session management
- [ ] Implement rate limiting and authentication throttling
- [ ] Set up secure file upload with content validation
- [ ] Add logging and monitoring for security events
- [ ] Implement proper error handling without information disclosure
- [ ] Regular security audits and dependency updates
- [ ] Set up automated security testing in CI/CD pipeline`,
};
