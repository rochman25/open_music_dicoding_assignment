/* eslint-disable no-underscore-dangle */
const { Pool } = require('pg');
const { nanoid } = require('nanoid');
const InvariantError = require('../../exceptions/InvariantError');
const { mapDBToModel } = require('../../utils/playlist');
const { mapDBToModel: songMapDBToModel } = require('../../utils/index');
const NotFoundError = require('../../exceptions/NotFoundError');
const AuthorizationError = require('../../exceptions/AuthorizationError');
const ClientError = require('../../exceptions/ClientError');

class PlaylistService {
  constructor() {
    this._pool = new Pool();
  }

  async addPlaylist({
    name, owner,
  }) {
    const id = `playlist-${nanoid(16)}`;
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const query = {
      text: 'INSERT INTO playlists VALUES($1, $2, $3, $4, $5) RETURNING id',
      values: [id, name, owner, createdAt, updatedAt],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].id) {
      throw new InvariantError('Playlist gagal ditambahkan');
    }

    return result.rows[0].id;
  }

  async getPlaylists(owner) {
    const query = {
      text: `SELECT playlists.*, users.username FROM playlists
      LEFT JOIN users ON users.id = playlists.owner
      WHERE playlists.owner = $1`,
      values: [owner],
    };
    const result = await this._pool.query(query);
    return result.rows.map(mapDBToModel);
  }

  async deletePlaylistById(id) {
    const query = {
      text: 'DELETE FROM playlists WHERE id = $1 RETURNING id',
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new NotFoundError('Playlist gagal dihapus. Id tidak ditemukan');
    }
  }

  async verifyPlaylistOwner(id, owner) {
    const query = {
      text: 'SELECT * FROM playlists WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    if (!result.rows.length) {
      throw new NotFoundError('Playlist tidak ditemukan');
    }
    const note = result.rows[0];
    if (note.owner !== owner) {
      throw new AuthorizationError('Anda tidak berhak mengakses resource ini');
    }
  }

  async addSongToPlaylist({ playlist, song }) {
    const query = {
      text: 'INSERT INTO playlist_songs VALUES($1, $2) RETURNING song',
      values: [song, playlist],
    };

    const result = await this._pool.query(query);

    if (!result.rows[0].song) {
      throw new InvariantError('Lagu gagal ditambahkan ke playlist');
    }

    return result.rows[0].song;
  }

  async getSongsFromPlaylist(playlist) {
    const query = {
      text: `SELECT songs.id, songs.title, songs.performer FROM playlist_songs
      LEFT JOIN songs ON songs.id = playlist_songs.song
      WHERE playlist_songs.playlist = $1`,
      values: [playlist],
    };
    const result = await this._pool.query(query);
    return result.rows.map(songMapDBToModel);
  }

  async deleteSongFromPlaylist(id, song) {
    const query = {
      text: 'DELETE FROM playlist_songs WHERE song = $1 AND playlist = $2 RETURNING song',
      values: [song, id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      throw new ClientError('Lagu gagal dihapus. lagu tidak ditemukan');
    }
  }
}

module.exports = PlaylistService;
