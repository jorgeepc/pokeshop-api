import { Test, TestingModule } from '@nestjs/testing';
import { PokeapiService } from './pokeapi.service';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { AxiosResponse } from 'axios';
import { of, throwError } from 'rxjs';
import { ImportPokemonDto } from './dto/import-pokemon.dto';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { ServiceUnavailableException } from '@nestjs/common';

describe('PokeapiService', () => {
  let service: PokeapiService;
  let httpService: HttpService;

  const mockConfigService = {
    get: jest.fn().mockReturnValue('https://pokeapi.co/api/v2'),
  };

  const mockHttpService = {
    get: jest.fn(),
  };

  const rawPokemonData = {
    id: 1,
    name: 'bulbasaur',
    types: [{ type: { name: 'grass' } }, { type: { name: 'poison' } }],
    sprites: {
      front_default: 'http://image.url/bulbasaur.png',
    },
  };

  const importPokemonDto: ImportPokemonDto = { id: '1' };
  const expectedPokemonDto: CreatePokemonDto = {
    name: 'bulbasaur',
    type: 'grass,poison',
    imageUrl: 'http://image.url/bulbasaur.png',
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PokeapiService, ConfigService, HttpService],
    })
      .overrideProvider(ConfigService)
      .useValue(mockConfigService)
      .overrideProvider(HttpService)
      .useValue(mockHttpService)
      .compile();

    service = module.get<PokeapiService>(PokeapiService);
    httpService = module.get<HttpService>(HttpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get', () => {
    it('should return the pokemon from external api', async () => {
      const mockResponse: AxiosResponse = {
        data: rawPokemonData,
      } as AxiosResponse;
      // jest.spyOn(httpService, 'get').mockImplementation(() => of(mockResponse));
      mockHttpService.get.mockReturnValue(of(mockResponse));

      expect(await service.get(importPokemonDto)).toEqual(expectedPokemonDto);
      expect(httpService.get).toHaveBeenCalledWith(
        'https://pokeapi.co/api/v2/pokemon/1',
      );
    });

    it('should throw a ServiceUnavailableException when the API fails', async () => {
      const mockError = new Error('Service Unavailable');
      mockHttpService.get.mockReturnValue(throwError(() => mockError));

      await expect(service.get(importPokemonDto)).rejects.toThrow(
        ServiceUnavailableException,
      );
    });
  });
});
