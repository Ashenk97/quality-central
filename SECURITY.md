# Security Policy

## Supported versions

Quality Central is under active development on `main`. Security fixes land on the latest `main` branch only.

## Reporting a vulnerability

**Do not open a public GitHub issue for security problems.**

Email the maintainer privately (GitHub profile contact for [@Ashenk97](https://github.com/Ashenk97)) with:

- A short description of the issue
- Steps to reproduce (or a PoC)
- Impact (data exposure, auth bypass, etc.)
- Whether you are available for follow-up

You should get an acknowledgement within a few days. Please give us reasonable time to fix and release before any public disclosure.

## Safe harbor

Good-faith research against a local or personal deploy is welcome. Do not:

- Access other users’ data
- Disrupt production availability
- Share secrets or personal data found during research

## Secrets & configuration

- Never commit `.env`, service-role keys, Stripe secrets, or webhook signing secrets
- Use `.env.example` as the template for local setup
- Prefer GitHub Actions secrets / Vercel env vars for CI and production
