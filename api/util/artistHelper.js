const { db } = require("../db")

const getArtist = async (data) => {
  try {
    const { id, date } = data
    const day = date && date.substr(0, 10)
    const {
      rows
    } = await db.query(`SELECT * FROM public.stat WHERE artist_id = $1 ${day ? `AND fetch_date_start::timestamp::date = $2` : ''} ORDER BY fetch_date_start DESC`, day ? [
      id, date
    ] : [id]);

    console.log('rows', rows)
    return ({ success: true, payload: rows });
  } catch (e) {
    return ({ success: false, error: e.message });
  }
}

const addArtists = async (artists) => {

  try {
    await Promise.all(
      artists.map(async artist => {
        await db.query(
          "INSERT INTO public.artist (artist_id, artist_name, spotify_url, inserted) VALUES ($1, $2, $3, now()) ON CONFLICT DO NOTHING",
          [artist.id, artist.name, artist.spotifyUrl]
        );
      })
    );
    return { success: true };
  } catch (e) {
    return { success: false }
  }
};


module.exports = {
  getArtist, addArtists
}


