# BeatWatch Frontend

Frontend web de BeatWatch construido con React, Vite, Zustand y Tailwind CSS.

## Requisitos

- Node.js 22
- npm 10+
- Backend BeatWatch accesible por HTTPS

## Configuración

1. Copia `.env.example` a `.env.local`.
2. Configura `VITE_API_URL` con la URL del backend.
3. Alinea `VITE_FREE_LICENSE_METHOD` con el valor que acepte el backend para licencias de costo cero.

> Las variables `VITE_*` se incluyen en el bundle del navegador. Nunca pongas secretos, contraseñas, llaves privadas o secret keys de proveedores de pago en ellas.

## Desarrollo

```bash
npm ci
npm run dev
```

## Validaciones antes de subir cambios

```bash
npm run lint
npm run test:security
npm run build
npm run security:audit
```

También puedes ejecutar:

```bash
npm run ci
```

## Arquitectura de API

- `src/api/client.js`: transporte HTTP centralizado y Bearer token.
- `src/config/env.js`: configuración pública del frontend.
- `src/services/authService.js`: autenticación y recuperación.
- `src/services/registrationService.js`: registro de cuentas.
- `src/services/usersService.js`: usuarios/pacientes.
- `src/services/devicesService.js`: dispositivos.
- `src/services/licensesService.js`: licencias.
- `src/services/reportsService.js`: reportes.

Los componentes no deben llamar `fetch` ni declarar rutas `/api/...` directamente.

## Sesión

La sesión se guarda una sola vez con Zustand bajo `beatwatch-auth` en `sessionStorage`. El código ya no usa `bookstack-auth` ni `auth_token`.

La opción más segura a futuro es que el backend migre a cookies `Secure`, `HttpOnly` y `SameSite` para que el token no pueda ser leído por JavaScript.

## Pagos

El plan actual de $0.00 no captura ni envía número de tarjeta, fecha de expiración ni CVV.

Para planes de pago se debe integrar un proveedor PCI mediante tokenización/hosted fields. BeatWatch solo debe recibir un token o identificador de método de pago; nunca CVV.

## DevSecOps

El repositorio incluye:

- CI con lint, pruebas de política de seguridad, build y `npm audit`.
- CodeQL para SAST de JavaScript.
- Trivy para dependencias, secretos y misconfigurations.
- Dependabot para npm y GitHub Actions.
- DAST manual con ZAP Baseline para staging autorizado.
- `render.yaml` con HTTPS/security headers y variable `VITE_API_URL` no hardcodeada.

Consulta [docs/DEVSECOPS.md](docs/DEVSECOPS.md) y [SECURITY.md](SECURITY.md).
