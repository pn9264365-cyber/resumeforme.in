# Security Specification for ResuGenius AI

## 1. Data Invariants
- A user document must match the authenticated user's UID.
- Users can only read and write their own data.
- The `email` field must be a valid email string.
- `lastLogin` must be a server timestamp on create/update.

## 2. The "Dirty Dozen" Payloads (Red Team)
1. **Identity Spoofing**: Attempt to create a user document with a UID of another user.
2. **Ghost Field Injection**: Adding `isAdmin: true` to a user document.
3. **Email Poisioning**: Injecting a 1MB string into the `email` field.
4. **Unauthorized Read**: Authenticated User A attempts to read User B's profile.
5. **Unauthorized Write**: Guest (unauthenticated) attempts to create a user profile.
6. **LastLogin Fabrication**: Attempt to send a client-side timestamp for `lastLogin`.
7. **Path Traversal ID**: Attempting to use `../` or special characters in the userId path.
8. **PII Leakage**: Attempting to list all users to scrape emails.
9. **Schema Mismatch**: Writing a number to the `displayName` field.
10. **Resource Exhaustion**: Sending a payload with 1000 unknown fields.
11. **Email Spoofing (Unverified)**: Authenticated user with email A attempts to set document email to B.
12. **Update Gap**: Changing the `uid` of an existing document.

## 3. Test Runner
(Tests would be implemented in `firestore.rules.test.ts` if environment supported it)
