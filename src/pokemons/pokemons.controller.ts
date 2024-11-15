import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { PokemonsService } from './pokemons.service';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { ImportPokemonDto } from './dto/import-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from '@prisma/client';

@Controller('pokemons')
export class PokemonsController {
  constructor(private readonly pokemonsService: PokemonsService) {}

  @Post()
  async create(@Body() createPokemonDto: CreatePokemonDto): Promise<Pokemon> {
    return this.pokemonsService.create(createPokemonDto);
  }

  @Get()
  async findAll(
    @Query('take', new ParseIntPipe({ optional: true })) take?: number,
    @Query('skip', new ParseIntPipe({ optional: true })) skip?: number,
    @Query('search') search?: string,
    @Query('sort') sort?: 'asc' | 'desc',
  ): Promise<Pokemon[]> {
    // throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    // throw new ForbiddenException();
    return this.pokemonsService.findAll({ take, skip, search, sort });
  }

  @Get(':id')
  async findOne(
    @Param('id', ParseIntPipe) id: string,
  ): Promise<Pokemon | null> {
    return this.pokemonsService.findOne(+id);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updatePokemonDto: UpdatePokemonDto,
  ) {
    return this.pokemonsService.update(+id, updatePokemonDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<Pokemon> {
    return this.pokemonsService.remove(+id);
  }

  @Post('import')
  async import(
    @Body() importPokemonDto: ImportPokemonDto,
  ): Promise<Pokemon | null> {
    return this.pokemonsService.import(importPokemonDto);
  }
}
