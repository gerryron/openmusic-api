const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const NotFoundError = require('../../exceptions/NotFoundError');
const { mapDBToSongsModel } = require('../../utils');

class SongsService {
  constructor() {
    this._pool = new Pool();
  }

  // eslint-disable-next-line object-curly-newline
  async addSong({ title, year, performer, genre, duration, albumId }) {
    const id = `song-${nanoid(16)}`;

    const query = {
      text: 'INSERT INTO songs VALUES($1, $2, $3, $4, $5, $6, $7) RETURNING song_id',
      values: [id, title, year, performer, genre, duration, albumId],
    };
    const result = await this._pool.query(query);

    if (!result.rows[0].song_id) {
      throw new InvariantError('Lagu gagal ditambahkan');
    }

    return result.rows[0].song_id;
  }

  async getSongs() {
    const result = await this._pool.query('SELECT * FROM songs');
    return result.rows.map(mapDBToSongsModel);
  }

  async getSongById(id) {
    const query = {
      text: 'SELECT * FROM songs WHERE song_id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu tidak ditemukan');
    }

    return result.rows.map(mapDBToSongsModel)[0];
  }

  async getSongsByAlbumId(albumId) {
    const query = {
      text: 'SELECT * FROM songs WHERE album_id = $1',
      values: [albumId],
    };
    const result = await this._pool.query(query);

    return result.rows.map(mapDBToSongsModel);
  }

  // eslint-disable-next-line object-curly-newline
  async editSongById(id, { title, year, performer, genre, duration, albumId }) {
    const query = {
      text: 'UPDATE songs SET title = $1, year = $2, performer = $3, genre = $4, duration = $5, album_id = $6 WHERE song_id = $7 RETURNING song_id',
      values: [title, year, performer, genre, duration, albumId, id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Gagal memperbarui lagu. Id tidak ditemukan');
    }
  }

  async deleteSongById(id) {
    const query = {
      text: 'DELETE FROM songs WHERE song_id = $1 RETURNING song_id',
      values: [id],
    };
    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Lagu gagal dihapus. Id tidak ditemukan');
    }
  }
}

module.exports = SongsService;
