import { Args, Int, Query, Resolver } from '@nestjs/graphql';
import { Pokemon } from './models/pokemons.model';
import { PokemonsService } from './pokemons.service';

@Resolver(() => Pokemon)
export class PokemonsResolver {
  constructor(private pokemonsService: PokemonsService) {}

  @Query(() => Pokemon, { name: 'pokemon' })
  async getPokemon(@Args('id', { type: () => Int }) id: number) {
    return this.pokemonsService.findOne(id);
  }
}
