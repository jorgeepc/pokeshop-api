import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { ImportPokemonDto } from './dto/import-pokemon.dto';
import { TRawPokemon } from './interfaces/pokeapi.interface';

@Injectable()
export class PokeapiService {
  constructor(
    private configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  async get(importPokemonDto: ImportPokemonDto): Promise<CreatePokemonDto> {
    const baseUrl = this.configService.get<string>('POKEAPI_BASE_URL');

    const { data } = await firstValueFrom(
      this.httpService
        .get<TRawPokemon>(`${baseUrl}/pokemon/${importPokemonDto.id}`)
        .pipe(
          catchError((error: AxiosError) => {
            throw new ServiceUnavailableException(error);
          }),
        ),
    );

    const { name, types, sprites } = data;

    return {
      name,
      type: types.map(({ type }) => type.name).join(','),
      imageUrl: sprites.front_default,
    };
  }
}
