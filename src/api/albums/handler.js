const autoBind = require('auto-bind');

class AlbumsHandler {
  constructor(service, songsService, validator) {
    this._service = service;
    this._songsService = songsService;
    this._validator = validator;

    autoBind(this);
  }

  async postAlbumHandler(request, h) {
    this._validator.validateAlbumPayload(request.payload);
    const { name, year } = request.payload;
    const albumId = await this._service.addAlbum({ name, year });

    const response = h.response({
      status: 'success',
      data: {
        albumId,
      },
    });
    response.code(201);
    return response;
  }

  async getAlbumByIdHandler(request) {
    const { albumId } = request.params;
    const album = await this._service.getAlbumById(albumId);
    const songsByAlbum = await this._songsService.getSongsByAlbumId(albumId);
    return {
      status: 'success',
      data: {
        album: {
          ...album,
          songs: songsByAlbum.map((song) => ({
            id: song.id,
            title: song.title,
            performer: song.performer,
          })),
        },
      },
    };
  }

  async putAlbumByIdHandler(request) {
    this._validator.validateAlbumPayload(request.payload);
    const { albumId } = request.params;
    await this._service.editAlbumById(albumId, request.payload);

    return {
      status: 'success',
      message: 'Album berhasil diperbarui',
    };
  }

  async deleteAlbumByIdHandler(request) {
    const { albumId } = request.params;
    await this._service.deleteAlbumById(albumId);

    return {
      status: 'success',
      message: 'Album berhasil dihapus',
    };
  }
}

module.exports = AlbumsHandler;
