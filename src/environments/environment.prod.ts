export const environment = {
  appId: 'bpp',
  env: 'production',

  appAlias: 'boilerplate',
  appUrl: 'https://www.mysite.com',
  authAppUrl: 'https://auth.mysite.com',
  domain: 'mysite.com',

  apiBase: 'https://api.mysite.com',

  privateKey: null,
  // @TODO: cambiar esta llave
  publicKey:
    '-----BEGIN PUBLIC KEY-----\n' +
    'MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAEArfU3ust80VEw+D0/g1FaesXhTnR\n' +
    'J6LPUZQKeHF65pRMGHt1nv7XkMvEDtG98Q1WykiPw6UNPethlYi9jXb88A==\n' +
    '-----END PUBLIC KEY-----',

  jwtAud: 'https://www.mysite.com',
  jwtIss: 'https://api.mysite.com',

  googleOAuthClientId:
    '3474526703-vp4jg24a9sg6pdq1rledr5vaebrhtkb7.apps.googleusercontent.com',
  reCaptchaSiteKey: '6LeowwsTAAAAAPrV0G3kzxg1E9ehhcxEM2pb4LPE',

  sentryDsn: 'https://cd82021fc08841e5bf8b546710b764c5@sentry.io/1382267',

  minDelay: 500,
  footer: 'footer2',
};
