//console.log(process.env.AUTH0_DOMAIN);

const AUTH0_DOMAIN = localStorage.getItem("terminusdb-auth0-domain-override") || process.env.AUTH0_DOMAIN
const AUTH0_CLIENT_ID = localStorage.getItem("terminusdb-auth0-client-id-override") || process.env.AUTH0_CLIENT_ID
const AUDIENCE = localStorage.getItem("terminusdb-audience-override") || process.env.AUDIENCE

export const auth0_conf={
  "domain": AUTH0_DOMAIN,
  "clientId": AUTH0_CLIENT_ID,
  "audience": AUDIENCE
}
