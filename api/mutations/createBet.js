const { ApolloError } = require("apollo-server-express");
const { db } = require("../db");

const User = require("../classes/User");
const Bet = require("../classes/Bet");
const BetTimer = require("../util/BetTimer");

const { addArtists } = require("../util/artistHelper")

const createBet = async (
  { artistId, artistName, spotifyUrl, listeners, type, endDate },
  currentUser
) => {
  const betTimer = new BetTimer();
  const valid = betTimer.validate(endDate);
  if (!valid) {
    throw new ApolloError("INVALID_BET_TIMING");
  }
  const startDate = betTimer.starts("iso");
  // GENERATE BET ENTRY
  const userIdDb = User.decryptId(currentUser.id);
  const betId = (
    await db.query(
      `INSERT INTO public.bet (user_id, artist_id, spotify_url, listeners, type, start_date, end_date, transactions) VALUES ($1, $2, $3, $4, $5, $6, $7, false)
     RETURNING id`,
      [userIdDb, artistId, spotifyUrl, listeners, type, startDate, endDate]
    )
  ).rows[0].id;
  // SEND ARTIST TO STAT_SERVER

  const artist = {
    id: artistId,
    name: artistName,
    spotifyUrl
  }
  const data = await addArtists([artist])

  if (!data.success) {
    await db.query(`DELETE FROM public.bet WHERE id = $1`, [betId]);
    throw new ApolloError("STAT_SERVER_ERROR");
  }
  const bet = await Bet.gen(betId);
  return { bet };
};

module.exports = createBet;
