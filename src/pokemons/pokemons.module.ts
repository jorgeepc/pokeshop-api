import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { PokemonsService } from './pokemons.service';
import { PokemonsController } from './pokemons.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PokeapiService } from './pokeapi.service';
import { PokemonsResolver } from './pokemons.resolver';

@Module({
  imports: [HttpModule],
  controllers: [PokemonsController],
  providers: [PrismaService, PokemonsService, PokeapiService, PokemonsResolver],
})
export class PokemonsModule {}
