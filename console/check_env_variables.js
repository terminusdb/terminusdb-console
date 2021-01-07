const path = require('path');

const dotenv001 = require('dotenv').config( {
      path: path.join(__dirname, '.env')
} );
/*
if(!process.env.AUTH0_DOMAIN || !process.env.AUTH0_CLIENT_ID || !process.env.AUDIENCE){
  throw new Error('I CAN NOT FIND THE Auth0 env VARS')
}
if(!process.env.TERMINUS_HUB_URL || !process.env.TERMINUS_BFF_URL){
  throw new Error('I CAN NOT FIND THE TERMINUS_HUB env VARS')
}*/
