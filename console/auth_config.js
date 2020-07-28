const domain = process.env.AUTH0_DOMAIN || 'terminushub.eu.auth0.com'
const clientId = process.env.AUTH0_CLIENT_ID || 'MJJndGp0zUdM7o3POTQPmRJImY2ho0ai'
const audience = process.env.AUDIENCE || 'https://terminushub/registerUser'


export const auth0_conf={
  "domain": domain,
  "clientId": clientId,
  "audience": audience
}