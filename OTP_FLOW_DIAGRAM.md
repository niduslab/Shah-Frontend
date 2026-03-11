# OTP Password Reset - Visual Flow Diagram

## 📊 Complete User Journey

```
┌─────────────────────────────────────────────────────────────────┐
│                    PASSWORD RESET FLOW                          │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│  STEP 1: Enter Email                                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────┐    │
│  │  Forgot Password?                                      │    │
│  │  Enter your email to receive a verification code      │    │
│  │                                                         │    │
│  │  Email Address                                          │    │
│  │  ┌─────────────────────────────────────────────────┐  │    │
│  │  │ name@example.com                                 │  │    │
│  │  └─────────────────────────────────────────────────┘  │    │
│  │                                                         │    │
│  │  ┌─────────────────────────────────────────────────┐  │    │
│  │  │      Send Verification Code                      │  │    │
│  │  └─────────────────────────────────────────────────┘  │    │
│  │                                                         │    │
│  │  Remember your password? Back to login                 │    │
│  └───────────────────────────────────────────────────────┘    │
│                                                                 │
│  User Action: Enter email → Click "Send Verification Code"     │
│  Backend: Generate OTP → Send email → Store in DB              │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  STEP 2: Verify OTP                                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────┐    │
│  │  Reset Password                                        │    │
│  │  Enter the 6-digit code sent to user@example.com      │    │
│  │                                                         │    │
│  │  ✅ OTP sent to your email. Valid for 5 minutes.      │    │
│  │                                                         │    │
│  │  Verification Code                                      │    │
│  │  ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐ ┌───┐                │    │
│  │  │ 1 │ │ 2 │ │ 3 │ │ 4 │ │ 5 │ │ 6 │                │    │
│  │  └───┘ └───┘ └───┘ └───┘ └───┘ └───┘                │    │
│  │                                                         │    │
│  │  Code expires in: 4:38                                 │    │
│  │                                                         │    │
│  │  ┌─────────────────────────────────────────────────┐  │    │
│  │  │           Verify Code                            │  │    │
│  │  └─────────────────────────────────────────────────┘  │    │
│  │                                                         │    │
│  │  Change Email                                           │    │
│  └───────────────────────────────────────────────────────┘    │
│                                                                 │
│  User Action: Enter 6-digit OTP → Click "Verify Code"          │
│  Backend: Validate OTP → Check expiration → Return success     │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  STEP 3: Set New Password                                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────┐    │
│  │  Create New Password                                   │    │
│  │  Enter your new password for user@example.com         │    │
│  │                                                         │    │
│  │  New Password                                           │    │
│  │  ┌─────────────────────────────────────────────────┐  │    │
│  │  │ At least 8 characters                  👁         │  │    │
│  │  └─────────────────────────────────────────────────┘  │    │
│  │                                                         │    │
│  │  Confirm Password                                       │    │
│  │  ┌─────────────────────────────────────────────────┐  │    │
│  │  │ Re-enter password                      👁         │  │    │
│  │  └─────────────────────────────────────────────────┘  │    │
│  │                                                         │    │
│  │  ┌─────────────────────────────────────────────────┐  │    │
│  │  │           Reset Password                         │  │    │
│  │  └─────────────────────────────────────────────────┘  │    │
│  │                                                         │    │
│  │  Change Email                                           │    │
│  └───────────────────────────────────────────────────────┘    │
│                                                                 │
│  User Action: Enter password → Confirm → Click "Reset"         │
│  Backend: Validate OTP again → Hash password → Update DB       │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│  STEP 4: Success                                                │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌───────────────────────────────────────────────────────┐    │
│  │                                                         │    │
│  │                    ┌─────────┐                         │    │
│  │                    │    ✓    │                         │    │
│  │                    └─────────┘                         │    │
│  │                                                         │    │
│  │         Password Reset Successful!                      │    │
│  │                                                         │    │
│  │    Your password has been reset successfully.          │    │
│  │                                                         │    │
│  │         Redirecting to login page...                    │    │
│  │                                                         │    │
│  └───────────────────────────────────────────────────────┘    │
│                                                                 │
│  Auto Action: Wait 3 seconds → Redirect to /login              │
└─────────────────────────────────────────────────────────────────┘
```

## 🔄 State Transitions

```
[Start] 
   ↓
[Step 1: Email Entry]
   ↓ (Send OTP)
[Step 2: OTP Verification]
   ↓ (Verify OTP)
[Step 3: Password Entry]
   ↓ (Reset Password)
[Step 4: Success]
   ↓ (Auto-redirect after 3s)
[Login Page]
```

## 🔀 Alternative Flows

### Resend OTP Flow
```
[Step 2: OTP Verification]
   ↓ (Timer expires)
[Show "Code expired!" message]
   ↓ (Click "Resend OTP")
[Call sendOtp API again]
   ↓ (Success)
[Reset timer to 5:00]
   ↓
[Continue Step 2]
```

### Change Email Flow
```
[Step 2 or Step 3]
   ↓ (Click "Change Email")
[Return to Step 1]
   ↓ (Enter new email)
[Start flow again]
```

### Error Handling Flow
```
[Any Step]
   ↓ (API Error)
[Show error message]
   ↓ (User corrects input)
[Retry same step]
```

## 📱 Component Hierarchy

```
ForgotPasswordPage
├── Step 1: Email Form
│   ├── Email Input
│   ├── Submit Button
│   └── Back to Login Link
│
├── Step 2: OTP Verification
│   ├── OtpInput Component (6 digits)
│   ├── CountdownTimer Component
│   ├── Verify Button
│   └── Change Email Link
│
├── Step 3: Password Form
│   ├── Password Input (with show/hide)
│   ├── Confirm Password Input (with show/hide)
│   ├── Reset Button
│   └── Change Email Link
│
└── Step 4: Success Message
    ├── Success Icon
    ├── Success Text
    └── Auto-redirect Logic
```

## 🎨 UI States

### Loading States
- **Step 1**: Button shows "Sending..." while API call in progress
- **Step 2**: Button shows "Verifying..." while validating OTP
- **Step 3**: Button shows "Resetting..." while updating password
- **All Steps**: Inputs disabled during loading

### Error States
- Red border on invalid inputs
- Error message banner at top of form
- Specific error messages for each validation failure

### Success States
- Green success message banner
- Checkmark icon on Step 4
- Auto-redirect countdown

## 🔐 Security Checkpoints

```
Step 1: Email Entry
├── ✓ Email format validation
├── ✓ Rate limiting (3 requests per 15 min)
└── ✓ User existence check

Step 2: OTP Verification
├── ✓ OTP format validation (6 digits)
├── ✓ OTP expiration check (5 minutes)
├── ✓ OTP match validation
└── ✓ Prevent brute force (rate limiting)

Step 3: Password Entry
├── ✓ Password length validation (min 8 chars)
├── ✓ Password match validation
├── ✓ Re-verify OTP before reset
└── ✓ Password hashing (bcrypt/argon2)

Step 4: Success
├── ✓ Invalidate OTP after use
├── ✓ Optional: Invalidate all sessions
└── ✓ Optional: Send confirmation email
```

## 📊 API Call Sequence

```
User                Frontend              Backend              Database
 │                     │                     │                     │
 │  Enter Email        │                     │                     │
 ├────────────────────>│                     │                     │
 │                     │  POST /send-otp     │                     │
 │                     ├────────────────────>│                     │
 │                     │                     │  Store OTP          │
 │                     │                     ├────────────────────>│
 │                     │                     │  Send Email         │
 │                     │                     ├─────────────────────┤
 │                     │  Success Response   │                     │
 │                     │<────────────────────┤                     │
 │  Show Step 2        │                     │                     │
 │<────────────────────┤                     │                     │
 │                     │                     │                     │
 │  Enter OTP          │                     │                     │
 ├────────────────────>│                     │                     │
 │                     │  POST /verify-otp   │                     │
 │                     ├────────────────────>│                     │
 │                     │                     │  Validate OTP       │
 │                     │                     ├────────────────────>│
 │                     │  Success Response   │                     │
 │                     │<────────────────────┤                     │
 │  Show Step 3        │                     │                     │
 │<────────────────────┤                     │                     │
 │                     │                     │                     │
 │  Enter Password     │                     │                     │
 ├────────────────────>│                     │                     │
 │                     │  POST /reset-pwd    │                     │
 │                     ├────────────────────>│                     │
 │                     │                     │  Update Password    │
 │                     │                     ├────────────────────>│
 │                     │  Success Response   │                     │
 │                     │<────────────────────┤                     │
 │  Show Success       │                     │                     │
 │<────────────────────┤                     │                     │
 │                     │                     │                     │
 │  Auto Redirect      │                     │                     │
 │<────────────────────┤                     │                     │
```

## 🎯 Key Differences from 3-Step Flow

| Aspect | 3-Step Flow | 4-Step Flow (Current) |
|--------|-------------|----------------------|
| OTP Verification | Combined with password entry | Separate step |
| User Focus | Multiple tasks per screen | One task per screen |
| Error Feedback | OTP and password errors mixed | Clear, isolated errors |
| Mobile UX | More scrolling required | Less scrolling, focused |
| Cognitive Load | Higher (2 tasks at once) | Lower (1 task at a time) |
| Industry Pattern | Less common | Standard (banking, 2FA) |
| Password Visibility | Shown before OTP verified | Only after OTP verified |

## 💡 Implementation Tips

1. **Timer Persistence**: Consider storing timer state in sessionStorage to survive page refreshes
2. **OTP Auto-fill**: Use `autocomplete="one-time-code"` for SMS OTP auto-fill on mobile
3. **Accessibility**: Ensure proper ARIA labels and keyboard navigation
4. **Analytics**: Track drop-off rates at each step to identify UX issues
5. **Error Recovery**: Provide clear paths to retry or go back
6. **Loading States**: Always show loading indicators during API calls
7. **Success Animation**: Consider adding a subtle animation on Step 4
