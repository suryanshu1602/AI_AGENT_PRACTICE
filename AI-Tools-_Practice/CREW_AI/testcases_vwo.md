# VWO Login Page Test Cases
=====================================

## 1. Valid Login
### Test Case ID: TC001
#### Description: Test that a user can log in successfully with valid credentials.
#### Pre-conditions: 
* The user has a valid email address and password.
* The user's account is not locked out.
#### Test Steps:
1. Enter a valid email address in the email field.
2. Enter a valid password in the password field.
3. Click the Login button.
#### Expected Result: 
* The user is redirected to the dashboard or the desired page.
* The user's session is created successfully.

## 2. Invalid Login
### Test Case ID: TC002
#### Description: Test that an error message is displayed when a user enters invalid credentials.
#### Pre-conditions: 
* The user has an invalid email address or password.
#### Test Steps:
1. Enter an invalid email address in the email field.
2. Enter an invalid password in the password field.
3. Click the Login button.
#### Expected Result: 
* An error message is displayed indicating that the email or password is incorrect.
* The user is prompted to try again.

## 3. Blank Fields
### Test Case ID: TC003
#### Description: Test that error messages are displayed when the email and/or password fields are blank.
#### Pre-conditions: 
* The user has not entered any credentials.
#### Test Steps:
1. Leave the email field blank.
2. Leave the password field blank.
3. Click the Login button.
#### Expected Result: 
* Error messages are displayed for both the email and password fields indicating that they are required.

## 4. Remember Me
### Test Case ID: TC004
#### Description: Test that the Remember Me checkbox persists the user's session correctly.
#### Pre-conditions: 
* The user has a valid email address and password.
* The user's account is not locked out.
#### Test Steps:
1. Enter a valid email address in the email field.
2. Enter a valid password in the password field.
3. Check the Remember Me checkbox.
4. Click the Login button.
5. Close the browser and reopen it.
6. Navigate to the VWO login page.
#### Expected Result: 
* The user is still logged in and redirected to the dashboard or the desired page.

## 5. Password Masking
### Test Case ID: TC005
#### Description: Test that passwords are masked correctly to prevent shoulder surfing.
#### Pre-conditions: 
* The user has a valid email address and password.
#### Test Steps:
1. Enter a valid email address in the email field.
2. Enter a valid password in the password field.
3. Observe the password field.
#### Expected Result: 
* The password is masked with asterisks (\*) or bullets (•) and is not visible in plain text.

## 6. Session Timeout
### Test Case ID: TC006
#### Description: Test that the session times out after a certain period of inactivity.
#### Pre-conditions: 
* The user has a valid email address and password.
* The user's account is not locked out.
#### Test Steps:
1. Enter a valid email address in the email field.
2. Enter a valid password in the password field.
3. Click the Login button.
4. Wait for the session timeout period (e.g., 30 minutes).
5. Navigate to the VWO dashboard or the desired page.
#### Expected Result: 
* The user is logged out and redirected to the login page.
* The user's session is terminated.

## 7. Invalid Email Format
### Test Case ID: TC007
#### Description: Test that an error message is displayed when an invalid email format is entered.
#### Pre-conditions: 
* The user has an invalid email address.
#### Test Steps:
1. Enter an invalid email address in the email field (e.g., "test" without the "@" symbol).
2. Enter a valid password in the password field.
3. Click the Login button.
#### Expected Result: 
* An error message is displayed indicating that the email address is invalid.

## 8. Weak Password
### Test Case ID: TC008
#### Description: Test that an error message is displayed when a weak password is entered.
#### Pre-conditions: 
* The user has a weak password (e.g., less than 8 characters, no uppercase letter, no number).
#### Test Steps:
1. Enter a valid email address in the email field.
2. Enter a weak password in the password field.
3. Click the Login button.
#### Expected Result: 
* An error message is displayed indicating that the password is weak.

## 9. SQL Injection
### Test Case ID: TC009
#### Description: Test that the application is not vulnerable to SQL injection attacks.
#### Pre-conditions: 
* The user has a valid email address and password.
#### Test Steps:
1. Enter a valid email address in the email field.
2. Enter a password with SQL injection characters (e.g., "' OR 1=1 --") in the password field.
3. Click the Login button.
#### Expected Result: 
* The application does not execute the SQL injection query and displays an error message instead.

## 10. Cross-Site Scripting (XSS)
### Test Case ID: TC010
#### Description: Test that the application is not vulnerable to XSS attacks.
#### Pre-conditions: 
* The user has a valid email address and password.
#### Test Steps:
1. Enter a valid email address in the email field.
2. Enter a password with XSS characters (e.g., "<script>alert('XSS')</script>") in the password field.
3. Click the Login button.
#### Expected Result: 
* The application does not execute the XSS script and displays an error message instead.

## 11. Cross-Site Request Forgery (CSRF)
### Test Case ID: TC011
#### Description: Test that the application is not vulnerable to CSRF attacks.
#### Pre-conditions: 
* The user has a valid email address and password.
#### Test Steps:
1. Enter a valid email address in the email field.
2. Enter a valid password in the password field.
3. Click the Login button.
4. Send a CSRF request to the application (e.g., using a tool like Burp Suite).
#### Expected Result: 
* The application does not execute the CSRF request and displays an error message instead.

## 12. Special Characters
### Test Case ID: TC012
#### Description: Test that special characters are handled correctly in the email and password fields.
#### Pre-conditions: 
* The user has a valid email address and password with special characters.
#### Test Steps:
1. Enter a valid email address with special characters (e.g., "test!@example.com") in the email field.
2. Enter a valid password with special characters (e.g., "P@ssw0rd!") in the password field.
3. Click the Login button.
#### Expected Result: 
* The application handles the special characters correctly and logs the user in successfully.

## 13. Non-ASCII Characters
### Test Case ID: TC013
#### Description: Test that non-ASCII characters are handled correctly in the email and password fields.
#### Pre-conditions: 
* The user has a valid email address and password with non-ASCII characters.
#### Test Steps:
1. Enter a valid email address with non-ASCII characters (e.g., "test@éxample.com") in the email field.
2. Enter a valid password with non-ASCII characters (e.g., "P@ssw0rdé") in the password field.
3. Click the Login button.
#### Expected Result: 
* The application handles the non-ASCII characters correctly and logs the user in successfully.

## 14. Long Input
### Test Case ID: TC014
#### Description: Test that the application handles long input correctly in the email and password fields.
#### Pre-conditions: 
* The user has a valid email address and password with long input.
#### Test Steps:
1. Enter a valid email address with long input (e.g., "test@verylongdomainname.com") in the email field.
2. Enter a valid password with long input (e.g., "P@ssw0rdverylongpassword") in the password field.
3. Click the Login button.
#### Expected Result: 
* The application handles the long input correctly and logs the user in successfully.