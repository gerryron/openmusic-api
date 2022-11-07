/* eslint-disable camelcase */
// eslint-disable-next-line object-curly-newline
const mapDBToSongsModel = ({
  song_id,
  title,
  year,
  performer,
  genre,
  duration,
  album_id,
}) => ({
  id: song_id,
  title,
  year,
  performer,
  genre,
  duration,
  albumId: album_id,
});

module.exports = { mapDBToSongsModel };
