import { getRepository, Repository } from 'typeorm';

import { User } from '../../../users/entities/User';
import { Game } from '../../entities/Game';

import { IGamesRepository } from '../IGamesRepository';

export class GamesRepository implements IGamesRepository {
  private repository: Repository<Game>;

  constructor() {
    this.repository = getRepository(Game);
  }

  async findByTitleContaining(param: string): Promise<Game[]> {
    return this.repository
      .createQueryBuilder("games")
      .where("title ILIKE :title", { title: `%${param}%` })
      .getMany();
    // Complete usando query builder
  }

  async countAllGames(): Promise<[{ count: string }]> {
    return this.repository.query('select count(*) from games'); // Complete usando raw query
  }

  async findUsersByGameId(id: string): Promise<User[]> {
    return this.repository
      .createQueryBuilder('games')
      .innerJoinAndSelect('users_games_games', 'users_games_games', 'users_games_games.gamesId = games.id and users_games_games.gamesId = :id', { id: id })
      .innerJoinAndSelect('users', 'users', 'users_games_games.usersId = users.id')
      .select('users.*')
      .getRawMany();
    // Complete usando query builder
  }
}
