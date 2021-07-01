module.exports = {
  // connectionString: process.env.DATABASE_URL will be injected from heroku in db/index.js
  spotifyClientId: process.env.SPOTIFY_CLIENT_ID, // spotify developer console
  spotifyClientSecret: process.env.SPOTIFY_CLIENT_SECRET, // spotify developer console
  apiJwtSecret: process.env.API_JWT_SECRET, // the secret which is used to create the api JWT e.g. secret
  statServerSecret: process.env.STAT_SERVER_SECRET, // the scret to communicate with the statserver e.g. secret // TODO: can be removed
  statServerURI: process.env.STAT_SERVER_URI, // http://localhost:5000 // TODO: can be removed
  cronJobSecret: process.envt.CRON_JOB_SECRET // the secret to allow the cronJob server to access the api, unnecessary to setup in development
};
