# Testing OTP Password Reset Flow

## 🧪 Manual Testing Guide

### Prerequisites
- Backend API running on `http://localhost:8000`
- Frontend running on `http://localhost:3000`
- Email service configured on backend
- Test user account created

---

## Test Scenarios

### ✅ Scenario 1: Happy Path - Successful Password Reset

**Steps:**
1. Navigate to `http://localhost:3000/login`
2. Click "Forgot password?" link
3. Enter valid email: `test@example.com`
4. Click "Send Verification Code"
5. Check email inbox for OTP code
6. Enter the 6-digit OTP code
7. Enter new password: `NewPassword123`
8. Confirm password: `NewPassword123`
9. Click "Reset Password"
10. Wait for success message
11. Auto-redirect to login page
12. Login with new password

**Expected Results:**
- ✅ OTP email received within 30 seconds
- ✅ OTP input accepts 6 digits
- ✅ Timer shows 5:00 and counts down
- ✅ Success message appears
- ✅ Redirect to login after 3 seconds
- ✅ Can login with new password

---

### ❌ Scenario 2: Invalid Email

**Steps:**
1. Navigate to forgot password page
2. Enter non-existent email: `notfound@example.com`
3. Click "Send Verification Code"

**Expected Results:**
- ❌ Error message: "Email not found" or similar
- ❌ Does not proceed to Step 2

---

### ❌ Scenario 3: Invalid OTP

**Steps:**
1. Complete Step 1 successfully
2. Enter wrong OTP: `000000`
3. Enter valid password
4. Click "Reset Password"

**Expected Results:**
- ❌ Error message: "Invalid or expired OTP"
- ❌ Password not reset
- ❌ Stays on Step 2

---

### ⏰ Scenario 4: OTP Expiration

**Steps:**
1. Complete Step 1 successfully
2. Wait 5 minutes (or adjust timer for testing)
3. Observe timer expiration
4. Click "Resend OTP"

**Expected Results:**
- ⏰ Timer shows "Code expired!"
- ⏰ "Resend OTP" button appears
- ✅ New OTP sent on resend
- ✅ Timer resets to 5:00

---

### ❌ Scenario 5: Password Mismatch

**Steps:**
1. Complete Step 1 successfully
2. Enter valid OTP
3. Enter password: `Password123`
4. Enter different confirmation: `Password456`
5. Click "Reset Password"

**Expected Results:**
- ❌ Error message: "Passwords do not match"
- ❌ Password not reset

---

### ❌ Scenario 6: Password Too Short

**Steps:**
1. Complete Step 1 successfully
2. Enter valid OTP
3. Enter password: `Pass1` (less than 8 chars)
4. Enter same confirmation
5. Click "Reset Password"

**Expected Results:**
- ❌ Error message: "Password must be at least 8 characters"
- ❌ Password not reset

---

### 📋 Scenario 7: Paste OTP

**Steps:**
1. Complete Step 1 successfully
2. Copy OTP from email: `123456`
3. Click on first OTP input box
4. Paste (Ctrl+V or Cmd+V)

**Expected Results:**
- ✅ All 6 digits filled automatically
- ✅ Focus on last input box

---

### ⌨️ Scenario 8: Keyboard Navigation

**Steps:**
1. Complete Step 1 successfully
2. Type first digit: `1`
3. Observe auto-focus to next box
4. Type remaining digits: `2`, `3`, `4`, `5`, `6`
5. Press Backspace
6. Observe focus moves back

**Expected Results:**
- ✅ Auto-advance on digit entry
- ✅ Backspace moves to previous box
- ✅ Can edit any digit

---

### 🔄 Scenario 9: Change Email

**Steps:**
1. Complete Step 1 successfully
2. On Step 2, click "Change Email"
3. Enter different email
4. Send new OTP

**Expected Results:**
- ✅ Returns to Step 1
- ✅ Can enter new email
- ✅ New OTP sent to new email

---

### 🚫 Scenario 10: Rate Limiting

**Steps:**
1. Request OTP for same email
2. Immediately request again
3. Request 3rd time
4. Request 4th time

**Expected Results:**
- ✅ First 3 requests succeed
- ❌ 4th request shows rate limit error
- ⏰ Must wait 15 minutes

---

## 📱 Mobile Testing

### iOS Safari
- [ ] Numeric keyboard appears for OTP input
- [ ] Auto-fill OTP from SMS (if supported)
- [ ] Touch targets are large enough
- [ ] No zoom on input focus

### Android Chrome
- [ ] Numeric keyboard appears
- [ ] OTP auto-fill works
- [ ] Paste functionality works
- [ ] Smooth scrolling

---

## 🔍 Browser Testing

### Chrome
- [ ] All features work
- [ ] No console errors
- [ ] Smooth animations

### Firefox
- [ ] All features work
- [ ] OTP input styling correct

### Safari
- [ ] All features work
- [ ] Timer updates correctly

### Edge
- [ ] All features work
- [ ] No compatibility issues

---

## 🐛 Common Issues & Solutions

### Issue: OTP Email Not Received
**Check:**
- Email service configured correctly
- Check spam folder
- Verify email address is correct
- Check backend logs for email sending errors

### Issue: Timer Not Counting Down
**Check:**
- Browser console for JavaScript errors
- Component is mounted correctly
- useEffect dependencies correct

### Issue: OTP Input Not Accepting Numbers
**Check:**
- Input type is "text" not "number"
- inputMode is "numeric"
- onChange handler working

### Issue: API 419 CSRF Error
**Check:**
- CSRF cookie is set
- withCredentials: true in axios
- CORS configured correctly

### Issue: Password Not Updating
**Check:**
- Backend password hashing working
- Database connection active
- OTP validation passing

---

## 📊 Performance Testing

### Load Testing
```bash
# Test 100 concurrent OTP requests
ab -n 100 -c 10 -p otp.json -T application/json \
  http://localhost:8000/api/auth/send-otp
```

### Response Time Goals
- Send OTP: < 2 seconds
- Verify OTP: < 500ms
- Reset Password: < 1 second

---

## 🔐 Security Testing

### Test Cases
- [ ] SQL injection in email field
- [ ] XSS in email field
- [ ] Brute force OTP guessing (should be rate limited)
- [ ] Replay attack (OTP reuse)
- [ ] CSRF attack (should be protected)
- [ ] Email enumeration (error messages shouldn't reveal if email exists)

---

## ✅ Acceptance Criteria

### Functionality
- [x] User can request OTP
- [x] OTP sent to email
- [x] User can enter OTP
- [x] Timer counts down from 5:00
- [x] User can resend OTP
- [x] User can reset password
- [x] Success message shown
- [x] Auto-redirect to login

### UX
- [x] Clear error messages
- [x] Loading states shown
- [x] Disabled states prevent double submission
- [x] Smooth transitions
- [x] Mobile-friendly
- [x] Accessible (keyboard navigation)

### Security
- [x] OTP expires after 5 minutes
- [x] Rate limiting prevents abuse
- [x] Passwords hashed
- [x] CSRF protection
- [x] HTTPS only (production)

---

## 📝 Test Report Template

```markdown
## Test Report - OTP Password Reset

**Date:** YYYY-MM-DD
**Tester:** [Name]
**Environment:** [Dev/Staging/Production]

### Test Results

| Scenario | Status | Notes |
|----------|--------|-------|
| Happy Path | ✅ Pass | |
| Invalid Email | ✅ Pass | |
| Invalid OTP | ✅ Pass | |
| OTP Expiration | ✅ Pass | |
| Password Mismatch | ✅ Pass | |
| Password Too Short | ✅ Pass | |
| Paste OTP | ✅ Pass | |
| Keyboard Navigation | ✅ Pass | |
| Change Email | ✅ Pass | |
| Rate Limiting | ✅ Pass | |

### Issues Found
1. [Issue description]
2. [Issue description]

### Recommendations
1. [Recommendation]
2. [Recommendation]
```

---

## 🚀 Automated Testing (Future)

### E2E Tests (Playwright/Cypress)
```javascript
describe('OTP Password Reset', () => {
  it('should complete password reset flow', async () => {
    await page.goto('/forgot-password');
    await page.fill('input[type="email"]', 'test@example.com');
    await page.click('button[type="submit"]');
    
    // Wait for OTP (mock in test)
    const otp = '123456';
    
    // Fill OTP inputs
    for (let i = 0; i < 6; i++) {
      await page.fill(`input[inputMode="numeric"]:nth-child(${i + 1})`, otp[i]);
    }
    
    await page.fill('input[id="password"]', 'NewPassword123');
    await page.fill('input[id="passwordConfirmation"]', 'NewPassword123');
    await page.click('button[type="submit"]');
    
    // Verify success
    await expect(page.locator('text=Password Reset Successful')).toBeVisible();
  });
});
```

---

## 📞 Support

If tests fail, check:
1. Backend API logs
2. Browser console errors
3. Network tab in DevTools
4. Email service logs
5. Database records
