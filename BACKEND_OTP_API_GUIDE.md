# Backend OTP API Implementation Guide

## 🎯 Quick Start for Backend Developers

This guide provides the exact API endpoints needed to support the frontend OTP password reset flow.

## 📋 Required Endpoints

### 1. Send OTP to Email

**Endpoint:** `POST /api/auth/send-otp`

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Verification code sent to your email"
}
```

**Error Response (400/404):**
```json
{
  "success": false,
  "message": "Email not found"
}
```

**Backend Logic:**
1. Validate email format
2. Check if user exists with this email
3. Generate 6-digit random OTP (e.g., "123456")
4. Store OTP in database with:
   - Email
   - OTP code
   - Expiration time (current time + 5 minutes)
   - Used status (false)
5. Send email with OTP code
6. Return success response

**Database Schema Example:**
```sql
CREATE TABLE password_reset_otps (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  email VARCHAR(255) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX idx_email_otp (email, otp),
  INDEX idx_expires_at (expires_at)
);
```

**Rate Limiting:**
- Max 3 OTP requests per email per 15 minutes
- Return error if limit exceeded

---

### 2. Verify OTP (Optional Endpoint)

**Endpoint:** `POST /api/auth/verify-otp`

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "OTP verified successfully"
}
```

**Error Response (400):**
```json
{
  "success": false,
  "message": "Invalid or expired OTP"
}
```

**Backend Logic:**
1. Find OTP record by email and OTP code
2. Check if OTP exists
3. Check if OTP is not expired (expires_at > current time)
4. Check if OTP is not already used
5. Return success/error

**Note:** This endpoint is optional. The frontend can skip this step and go directly to password reset.

---

### 3. Reset Password with OTP

**Endpoint:** `POST /api/auth/reset-password-otp`

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456",
  "password": "newPassword123",
  "password_confirmation": "newPassword123"
}
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

**Error Responses:**

**Invalid OTP (400):**
```json
{
  "success": false,
  "message": "Invalid or expired OTP"
}
```

**Password Mismatch (400):**
```json
{
  "success": false,
  "message": "Passwords do not match"
}
```

**Password Too Short (400):**
```json
{
  "success": false,
  "message": "Password must be at least 8 characters"
}
```

**Backend Logic:**
1. Validate request data:
   - Email format
   - OTP is 6 digits
   - Password length >= 8
   - Password matches password_confirmation
2. Find OTP record by email and OTP code
3. Verify OTP:
   - Exists
   - Not expired (expires_at > current time)
   - Not already used
4. Find user by email
5. Hash new password
6. Update user's password
7. Mark OTP as used (or delete OTP record)
8. Optionally: Send confirmation email
9. Optionally: Invalidate all user sessions
10. Return success response

---

## 🔐 Security Best Practices

### OTP Generation
```php
// PHP Example
function generateOTP() {
    return str_pad(random_int(0, 999999), 6, '0', STR_PAD_LEFT);
}
```

```javascript
// Node.js Example
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
```

```python
# Python Example
import random
def generate_otp():
    return str(random.randint(100000, 999999))
```

### Rate Limiting Implementation

**Laravel Example:**
```php
use Illuminate\Support\Facades\RateLimiter;

public function sendOtp(Request $request)
{
    $email = $request->email;
    
    // Rate limit: 3 attempts per 15 minutes
    $key = 'send-otp:' . $email;
    
    if (RateLimiter::tooManyAttempts($key, 3)) {
        $seconds = RateLimiter::availableIn($key);
        return response()->json([
            'success' => false,
            'message' => "Too many attempts. Please try again in {$seconds} seconds."
        ], 429);
    }
    
    RateLimiter::hit($key, 900); // 15 minutes
    
    // Continue with OTP generation...
}
```

### Password Hashing

**Laravel:**
```php
use Illuminate\Support\Facades\Hash;

$user->password = Hash::make($request->password);
$user->save();
```

**Node.js (bcrypt):**
```javascript
const bcrypt = require('bcrypt');
const hashedPassword = await bcrypt.hash(password, 10);
user.password = hashedPassword;
await user.save();
```

---

## 📧 Email Template Example

**Subject:** Your Password Reset Code

**Body:**
```html
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .otp-code { 
            font-size: 32px; 
            font-weight: bold; 
            letter-spacing: 8px; 
            color: #0B3B2D; 
            text-align: center;
            padding: 20px;
            background: #f5f5f5;
            border-radius: 8px;
            margin: 20px 0;
        }
        .warning { color: #666; font-size: 14px; }
    </style>
</head>
<body>
    <div class="container">
        <h2>Password Reset Request</h2>
        <p>You requested to reset your password. Use the code below to complete the process:</p>
        
        <div class="otp-code">123456</div>
        
        <p class="warning">
            ⏰ This code will expire in 5 minutes.<br>
            🔒 If you didn't request this, please ignore this email.
        </p>
        
        <p>Best regards,<br>Your App Team</p>
    </div>
</body>
</html>
```

---

## 🧪 Testing with cURL

### 1. Send OTP
```bash
curl -X POST http://localhost:8000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"email":"user@example.com"}'
```

### 2. Verify OTP (Optional)
```bash
curl -X POST http://localhost:8000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{"email":"user@example.com","otp":"123456"}'
```

### 3. Reset Password
```bash
curl -X POST http://localhost:8000/api/auth/reset-password-otp \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "email":"user@example.com",
    "otp":"123456",
    "password":"newPassword123",
    "password_confirmation":"newPassword123"
  }'
```

---

## 📊 Database Cleanup

**Automatic Cleanup (Recommended):**

Schedule a job to delete expired OTPs:

```sql
-- Delete OTPs older than 1 hour
DELETE FROM password_reset_otps 
WHERE expires_at < NOW() - INTERVAL 1 HOUR;
```

**Laravel Scheduler:**
```php
// app/Console/Kernel.php
protected function schedule(Schedule $schedule)
{
    $schedule->call(function () {
        DB::table('password_reset_otps')
            ->where('expires_at', '<', now()->subHour())
            ->delete();
    })->hourly();
}
```

---

## 🔍 Logging & Monitoring

**Log Important Events:**
1. OTP sent (email, timestamp)
2. OTP verification attempts (success/failure)
3. Password reset success
4. Rate limit hits
5. Expired OTP usage attempts

**Example Log Entry:**
```json
{
  "event": "otp_sent",
  "email": "user@example.com",
  "ip": "192.168.1.1",
  "timestamp": "2024-03-11T10:30:00Z"
}
```

---

## ⚠️ Common Pitfalls

1. **Not checking OTP expiration** - Always verify expires_at
2. **Allowing OTP reuse** - Mark as used or delete after successful reset
3. **No rate limiting** - Prevents brute force attacks
4. **Plain text OTPs in logs** - Never log actual OTP codes
5. **Not invalidating sessions** - Consider logging out all devices after password reset
6. **Case sensitivity** - OTPs should be case-insensitive (all numeric)
7. **Email not sent** - Always check email service status

---

## 🚀 Production Checklist

- [ ] OTP generation is cryptographically secure
- [ ] OTPs expire after 5 minutes
- [ ] Rate limiting implemented (3 per 15 min)
- [ ] Email service configured and tested
- [ ] Database indexes on email and expires_at
- [ ] Automatic cleanup of expired OTPs
- [ ] Logging for security monitoring
- [ ] Error messages don't leak user existence
- [ ] HTTPS enforced on all endpoints
- [ ] CORS configured correctly
- [ ] Password hashing uses bcrypt/argon2
- [ ] Sessions invalidated after password reset
- [ ] Confirmation email sent after successful reset

---

## 📞 Support

If you need help implementing these endpoints, refer to:
- Laravel Sanctum documentation
- Your framework's authentication docs
- Email service provider documentation (SendGrid, Mailgun, etc.)
