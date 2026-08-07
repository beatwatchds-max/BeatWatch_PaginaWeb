# DevSecOps en BeatWatch

## Pipeline

`pull request / push -> install locked dependencies -> lint -> security policy tests -> build -> npm audit -> CodeQL -> Trivy`

DAST is intentionally manual because it targets a running environment and must only be executed against staging with authorization.

## Local commands

```bash
npm ci
npm run lint
npm run test:security
npm run build
npm run security:audit
```

## Required Render configuration

Set `VITE_API_URL` in Render before building the static site. Do not commit a production URL to source code.

`VITE_*` values are public browser configuration, not secrets.

## Payment backend contract

For the current free plan the frontend sends only:

```json
{
  "UsuarioId": "...",
  "TipoLicencia": "Grupal",
  "MetodoPago": "Gratuito",
  "CorreoElectronico": "..."
}
```

If the backend currently only accepts `card`, `paypal` or `oxxo`, add `Gratuito` (or configure `VITE_FREE_LICENSE_METHOD` to the backend's zero-cost enum). Do not restore raw card/CVV fields.

For future paid plans, create a provider-specific backend endpoint that accepts a payment token, not PAN/CVV.

## Recommended branch protection

Require the following checks before merging to `main`:

- CI / quality-and-security-gates
- CodeQL / JavaScript security analysis
- Trivy Security Scan / filesystem-scan

Also require pull-request review and block direct pushes to `main`.
