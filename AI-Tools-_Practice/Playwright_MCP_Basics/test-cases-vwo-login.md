# VWO Login - Test Cases

Generated: May 22, 2026

## TC-01: Login with invalid credentials

**Description:** Verify error message when logging in with wrong username and wrong password

**Preconditions:** Browser open at https://app.vwo.com

**Steps:**
1. Navigate to https://app.vwo.com
2. Enter username: wronguser@example.com
3. Enter password: wrongpassword123
4. Click Sign In button

**Expected Result:** Error message displayed: Your email, password, IP address or location did not match

**Actual Result:** Error message appears below the password field.

**Status:** PASS

---

## TC-02: Login with invalid email format

**Description:** Verify validation when entering a malformed email

**Steps:**
1. Navigate to https://app.vwo.com
2. Enter username: notanemail
3. Enter password: password123
4. Click Sign In button

**Expected Result:** Inline validation error shown for invalid email format

---

## TC-03: Login with valid email and wrong password

**Description:** Verify error when email is valid but password is incorrect

**Steps:**
1. Navigate to https://app.vwo.com
2. Enter username: valid@example.com
3. Enter password: wrongpassword
4. Click Sign In button

**Expected Result:** Error message about incorrect password

---

## TC-04: Login with empty fields

**Description:** Verify validation when username and password are empty

**Steps:**
1. Navigate to https://app.vwo.com
2. Leave username and password empty
3. Click Sign In button

**Expected Result:** Required field validation errors shown for both email and password

---

## TC-05: Forgot Password link navigation

**Description:** Verify Forgot Password link works

**Steps:**
1. Navigate to https://app.vwo.com
2. Click Forgot Password? link

**Expected Result:** Navigated to password reset page
