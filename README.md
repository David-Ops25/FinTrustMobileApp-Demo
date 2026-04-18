# FinTrust Banking (Demo)

Production-style **mobile banking demo app** built with Expo + React Native.  
Designed for portfolio showcase with secure coding patterns, realistic UX, and clearly isolated mock data/authentication.

## Demo Credentials

- Username: `user`
- Password: `pass`

This app uses **mock authentication only** and labels demo credentials clearly in the UI.

## Features

- Secure demo login flow with session persistence (SecureStore abstraction)
- Dashboard with balance card, quick actions, and spending chart
- Transactions list with credit/debit filters and details screen
- Send money flow with input validation and simulated success/failure
- Profile and settings (dark mode, biometric/2FA mock toggles, secure logout)
- Notifications feed with transaction and security alerts
- Session timeout simulation (auto logout when token expires)

## Security/DevSecOps Highlights

- No production secrets in code; only explicit demo credentials
- Input validation on login and transfer forms
- Secure session storage with `expo-secure-store`
- Mock token-based auth payload and expiration handling
- CI workflow includes lint + `npm audit`

See `SECURITY.md` for details and limitations.

## Tech Stack

- Expo SDK 54 + React Native + TypeScript
- React Navigation (stack + tabs)
- Expo SecureStore, Linear Gradient, Vector Icons

## Run Locally

```bash
npm install
npm run start
```

Then press:
- `a` for Android
- `i` for iOS (macOS required)
- `w` for web

## Quality Checks

```bash
npm run lint
npm run security:audit
```

## Secure Git Workflow (Feature Branch)

Use a feature branch to protect `main`:

```bash
git checkout -b feature/docker-security
git add .
git commit -m "feat: add dockerization and security scanning"
git push origin feature/docker-security
```

## Docker (Hardened Static Web Runtime)

The container flow uses:
- **Builder**: `node:20-alpine` to install deps and run Expo web export
- **Runtime**: unprivileged Nginx image to serve static files as non-root

Build and run:

```bash
docker build -t fintrust-app .
docker run -p 3000:3000 fintrust-app
```

Then open [http://localhost:3000](http://localhost:3000).

## Vulnerability Scanning

If "Arko" refers to a scanner not available in your environment, use these standards:
- **Trivy** (preferred)
- **Snyk** (optional)
- `npm audit`

Local scan commands:

```bash
trivy image fintrust-app
npm audit --audit-level=high
```

## GitHub Security Pipeline

`/.github/workflows/security.yml` includes:
- Lint gate
- `npm audit --audit-level=high`
- Docker image build
- Trivy image scan that fails on **HIGH/CRITICAL** vulnerabilities

## Environment Variables

Use `.env.example` as the template for local configuration.  
Do not commit real credentials, tokens, or API keys.

## Build APK / IPA

Use Expo EAS for production-style artifacts:

```bash
npx eas build:configure
npx eas build --platform android
npx eas build --platform ios
```

> iOS builds require Apple credentials and are best run on macOS-enabled setup.

## Project Structure

```text
src/
  constants/
  context/
  navigation/
  services/
  theme/
  types/
```
