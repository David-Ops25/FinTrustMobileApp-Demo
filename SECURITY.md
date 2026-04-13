# SECURITY.md

## Scope

`FinTrust Banking` is a **demo-only application** for portfolio presentation.  
It intentionally simulates banking workflows without connecting to real financial backends.

## What Is Mocked

- Authentication endpoint and token issuance
- User profile, account balance, transactions, notifications
- Biometric and 2FA settings behavior
- Transfer success/failure responses

## Security Practices Demonstrated

1. **Explicit demo auth boundaries**
   - Demo credentials are clearly labeled in UI and documentation.
   - Credentials are not hidden as a fake "real" auth flow.

2. **Input validation**
   - Login and transfer forms validate input length, numeric constraints, and limits.

3. **Secure storage abstraction**
   - Session payload is stored via `expo-secure-store`, not plain local storage.
   - Logout clears persisted session.

4. **Session lifecycle**
   - Mock token includes expiration metadata.
   - Session timeout auto-logs out user when token expires.

5. **Least sensitive data policy**
   - No real PII, account numbers, or secrets in repository.
   - All user/account data is synthetic.

6. **DevSecOps checks in CI**
   - Lint for code quality and maintainability.
   - `npm audit --audit-level=high` for dependency vulnerability scanning.

## Limitations (Demo Constraints)

- No backend API, TLS pinning, or server-side authorization checks.
- No real biometric SDK integration.
- No hardware-backed attestation / jailbreak detection.
- No production fraud detection, risk scoring, or anti-money-laundering logic.
- Mock JWT format is illustrative and not cryptographically signed.

## Production Hardening Recommendations

- Replace mock auth with OAuth2/OIDC + short-lived signed JWTs.
- Add backend session revocation + refresh token rotation.
- Enforce certificate pinning and API request signing.
- Implement secure telemetry, threat detection, and abuse-rate controls.
- Add SAST/DAST + secret scanning and SBOM generation in CI/CD.
