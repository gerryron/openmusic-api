/* eslint-disable comma-dangle */
/* eslint-disable function-paren-newline */
/* eslint-disable implicit-arrow-linebreak */
const autoBind = require('auto-bind');

class SongsHandler {
  constructor(service, validator) {
    this._service = service;
    this._validator = validator;

    autoBind(this);
  }

  async postSongHandler(request, h) {
    this._validator.validateSongPayload(request.payload);
    // eslint-disable-next-line object-curly-newline, operator-linebreak
    const { title, year, performer, genre, duration, albumId } =
      request.payload;
    const songId = await this._service.addSong({
      title,
      year,
      performer,
      genre,
      duration,
      albumId,
    });

    const response = h.response({
      status: 'success',
      data: {
        songId,
      },
    });
    response.code(201);
    return response;
  }

  async getSongsHandler(request) {
    const { title, performer } = request.query;
    const songs = await this._service.getSongs();
    let filterSong = songs.map((song) => ({
      id: song.id,
      title: song.title,
      performer: song.performer,
    }));

    if (title !== undefined) {
      filterSong = filterSong.filter((song) =>
        song.title.toLowerCase().includes(title.toLowerCase())
      );
    }

    if (performer !== undefined) {
      filterSong = filterSong.filter((song) =>
        song.performer.toLowerCase().includes(performer.toLowerCase())
      );
    }

    return {
      status: 'success',
      data: {
        songs: filterSong,
      },
    };
  }

  async getSongByIdHandler(request) {
    const { id } = request.params;
    const song = await this._service.getSongById(id);
    return {
      status: 'success',
      data: {
        song,
      },
    };
  }

  async putSongByIdHandler(request) {
    this._validator.validateSongPayload(request.payload);
    const { id } = request.params;
    await this._service.editSongById(id, request.payload);

    return {
      status: 'success',
      message: 'Lagu berhasil diperbarui',
    };
  }

  async deleteSongByIdHandler(request) {
    const { id } = request.params;
    await this._service.deleteSongById(id);

    return {
      status: 'success',
      message: 'Lagu berhasil dihapus',
    };
  }
}

module.exports = SongsHandler;
