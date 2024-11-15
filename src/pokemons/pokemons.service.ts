import { Injectable } from '@nestjs/common';
import { Pokemon, Prisma } from '@prisma/client';
import { ImportPokemonDto } from './dto/import-pokemon.dto';
import { PokeapiService } from './pokeapi.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PokemonsService {
  constructor(
    private prisma: PrismaService,
    private readonly pokeapiService: PokeapiService,
  ) {}

  async create(data: Prisma.PokemonCreateInput): Promise<Pokemon> {
    return this.prisma.pokemon.create({
      data,
    });
  }

  async findAll(params: {
    take?: number;
    skip?: number;
    search?: string;
    sort?: 'asc' | 'desc';
  }): Promise<Pokemon[]> {
    const { take, skip, search, sort } = params;
    const searchQuery = search
      ? { OR: [{ name: { contains: search } }, { type: { contains: search } }] }
      : {};

    return this.prisma.pokemon.findMany({
      take,
      skip,
      where: searchQuery,
      orderBy: {
        name: sort,
      },
    });
  }

  async findOne(id: number): Promise<Pokemon | null> {
    return this.prisma.pokemon.findUnique({
      where: { id },
    });
  }

  async update(id: number, data: Prisma.PokemonUpdateInput): Promise<Pokemon> {
    return this.prisma.pokemon.update({
      data,
      where: { id },
    });
  }

  async remove(id: number): Promise<Pokemon> {
    return this.prisma.pokemon.delete({ where: { id } });
  }

  async import(importPokemonDto: ImportPokemonDto): Promise<Pokemon> {
    const pokemon = await this.findOne(+importPokemonDto.id);
    if (pokemon) {
      return pokemon;
    }

    const data = await this.pokeapiService.get(importPokemonDto);
    return await this.create(data);
  }
}
