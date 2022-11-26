// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  appId: 'bpd',
  env: 'develop',

  appAlias: 'test-boilerplate',
  appUrl: 'http://localhost:4201',
  // authAppUrl: 'http://localhost:4200',
  authAppUrl: 'https://test-auth.minambiente.gov.co',
  domain: 'localhost',

  apiBase:
    'https://hcd005bc35.execute-api.us-east-1.amazonaws.com/test-api/angle',

  privateKey:
    '-----BEGIN EC PRIVATE KEY-----\n' +
    'MHcCAQEEIKayiiMPbOBmZIi+iGxd+bkt3EE2srN/isFR4rnQp+dwoAoGCCqGSM49\n' +
    'AwEHoUQDQgAEArfU3ust80VEw+D0/g1FaesXhTnRJ6LPUZQKeHF65pRMGHt1nv7X\n' +
    'kMvEDtG98Q1WykiPw6UNPethlYi9jXb88A==\n' +
    '-----END EC PRIVATE KEY-----',
  publicKey:
    '-----BEGIN PUBLIC KEY-----\n' +
    'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEArfU3ust80VEw+D0/g1FaesXhTnR\n' +
    'J6LPUZQKeHF65pRMGHt1nv7XkMvEDtG98Q1WykiPw6UNPethlYi9jXb88A==\n' +
    '-----END PUBLIC KEY-----',

  jwtAud: 'https://angle-template.minambiente.gov.co',
  jwtIss: 'https://angle-template-api.minambiente.gov.co',

  googleOAuthClientId:
    '3474526703-vp4jg24a9sg6pdq1rledr5vaebrhtkb7.apps.googleusercontent.com',
  reCaptchaSiteKey: '6LeowwsTAAAAAPrV0G3kzxg1E9ehhcxEM2pb4LPE',

  sentryDsn: 'https://cd82021fc08841e5bf8b546710b764c5@sentry.io/1382267',

  minDelay: 500,
  footer: 'footer2',

  typeDocumentList: [
    {strId: '1', _label: 'Registro civil de nacimiento'},
    {strId: '2', _label: 'Tarjeta de identidad'},
    {strId: '3', _label: 'Cédula de ciudadanía'},
    {strId: '4', _label: 'Tarjeta de extranjería'},
    {strId: '5', _label: 'Cédula de extranjería'},
    {strId: '6', _label: 'NIT'},
    {strId: '7', _label: 'Pasaporte'},
    {strId: '8', _label: 'Tipo de documento extranjero'},
    {
      strId: '9',
      _label: 'Sin identificación del exterior u uso definido por la DIAN',
    },
  ],
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
