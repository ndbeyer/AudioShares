const getMonthlyListeners = require("./getMonthlyListeners")
const { db } = require("../db");

const scrapeStatistics = async () => {
  const noMonthlyListeners = [];
  try {
    const res = await db.query(
      "SELECT spotify_url, artist_id FROM public.artist"
    );
    await Promise.all(
      res.rows.map(async ({ spotify_url, artist_id }) => {
        const fetchDateStart = new Date().toISOString();
        const monthlyListeners = await getMonthlyListeners(spotify_url);
        if (monthlyListeners === null) {
          noMonthlyListeners.push({ spotify_url, artist_id })
          return
        }
        // TODO: send error email
        const fetchDateEnd = new Date().toISOString();
        await db.query(
          "INSERT INTO public.stat (artist_id, spotify_url, monthly_listeners, fetch_date_start, fetch_date_end) VALUES ($1, $2, $3, $4, $5)",
          [
            artist_id,
            spotify_url,
            monthlyListeners,
            fetchDateStart,
            fetchDateEnd
          ]
        );
      })
    );
    console.log(`For ${noMonthlyListeners.length}/${res.rows.length} artists, 'monthlyListeners: null' was returned`)
    return { success: true };
  } catch (e) {
    console.log('scrapeStatistics error', e)
    return { success: false };
  }
};

module.exports = scrapeStatistics