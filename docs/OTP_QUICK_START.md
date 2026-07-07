# OTP Password Reset - Quick Start Guide

## 🚀 5-Minute Setup

### For Users
1. Go to `/forgot-password` or click "Forgot password?" on login
2. Enter your email → Get OTP code
3. Enter 6-digit OTP → Verify
4. Enter new password → Reset
5. Done! Auto-redirected to login

### For Developers

#### Frontend (✅ DONE)
```bash
# Files created:
lib/components/OtpInput.tsx
lib/components/CountdownTimer.tsx
lib/services/otpAuthService.ts
app/(auth)/forgot-password/page.tsx
```

#### Backend (⏳ TODO)
Implement 3 endpoints:

```typescript
// 1. Send OTP
POST /api/auth/send-otp
{ email: "user@example.com" }
→ { success: true, message: "OTP sent" }

// 2. Verify OTP
POST /api/auth/verify-otp
{ email: "user@example.com", otp: "123456" }
→ { success: true, message: "OTP verified" }

// 3. Reset Password
POST /api/auth/reset-password-otp
{ 
  email: "user@example.com", 
  otp: "123456",
  password: "newpass123",
  password_confirmation: "newpass123"
}
→ { success: true, message: "Password reset" }
```

## 📋 Backend Checklist

- [ ] Generate 6-digit random OTP
- [ ] Store OTP in database with 5-minute expiration
- [ ] Send OTP via email
- [ ] Verify OTP matches and hasn't expired
- [ ] Update user password (hashed)
- [ ] Invalidate OTP after use
- [ ] Add rate limiting (3 per 15 min)

## 🧪 Quick Test

```bash
# 1. Send OTP
curl -X POST http://localhost:8000/api/auth/send-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'

# 2. Verify OTP
curl -X POST http://localhost:8000/api/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","otp":"123456"}'

# 3. Reset Password
curl -X POST http://localhost:8000/api/auth/reset-password-otp \
  -H "Content-Type: application/json" \
  -d '{
    "email":"test@example.com",
    "otp":"123456",
    "password":"newpass123",
    "password_confirmation":"newpass123"
  }'
```

## 📚 Full Documentation

- **OTP_IMPLEMENTATION_SUMMARY.md** - Complete overview
- **BACKEND_OTP_API_GUIDE.md** - Backend implementation details
- **OTP_FLOW_DIAGRAM.md** - Visual flow diagrams
- **TESTING_OTP_FLOW.md** - Testing scenarios
- **OTP_PASSWORD_RESET_COMPLETE.md** - Feature documentation

## 🎯 Key Features

✅ 4-step flow (Email → Verify OTP → Password → Success)
✅ 5-minute OTP expiration with countdown
✅ Resend OTP functionality
✅ Auto-advance OTP input
✅ Paste support for OTP codes
✅ Password visibility toggle
✅ Mobile-optimized
✅ Loading states
✅ Error handling
✅ Auto-redirect after success

## 🔐 Security

✅ OTP expires in 5 minutes
✅ Rate limiting support
✅ Password min 8 characters
✅ CSRF protection
✅ Secure password hashing (backend)

## 📱 User Flow

```
/forgot-password
    ↓
Enter email → Send OTP
    ↓
Enter 6-digit OTP → Verify
    ↓
Enter new password → Reset
    ↓
Success → Auto-redirect to /login
```

## 💻 Code Example

```typescript
// Using the service
import { otpAuthService } from '@/lib/services/otpAuthService';

// Send OTP
await otpAuthService.sendOtp('user@example.com');

// Verify OTP
await otpAuthService.verifyOtp('user@example.com', '123456');

// Reset password
await otpAuthService.resetPassword(
  'user@example.com',
  '123456',
  'newPassword123',
  'newPassword123'
);
```

## 🐛 Troubleshooting

**OTP not received?**
- Check spam folder
- Verify email service configured
- Check backend logs

**Timer not working?**
- Check browser console
- Verify component mounted

**API errors?**
- Check network tab
- Verify endpoints in .env.local
- Test with cURL

## ✅ Status

**Frontend**: ✅ Complete
**Backend**: ⏳ Pending
**Testing**: ⏳ Pending

---

**Ready to integrate!** Implement the 3 backend endpoints and you're good to go.
