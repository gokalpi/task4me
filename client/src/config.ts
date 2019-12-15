const apiId = 'y7u6eu0d84'
const regiondId = 'eu-central-1'

export const apiEndpoint = `https://${apiId}.execute-api.${regiondId}.amazonaws.com/dev`

export const authConfig = {
  domain: 'dev-lsutvgwy.auth0.com',            // Auth0 domain
  clientId: 'BBhUf32BxHvNEjnQHbC9mkWDvR8MaIL6',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
