import { Test, TestingModule } from '@nestjs/testing';
import { PokemonsService } from './pokemons.service';
import { PokeapiService } from './pokeapi.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';

describe('PokemonsService', () => {
  let service: PokemonsService;
  let pokeapiService: PokeapiService;
  let prismaService: PrismaService;

  const mockPrismaService = {
    pokemon: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    // Reset the mock (clear call history and implementation) before each test
    mockPrismaService.pokemon.findMany.mockReset();
    mockPrismaService.pokemon.findUnique.mockReset();
    mockPrismaService.pokemon.create.mockReset();

    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), HttpModule],
      providers: [PokemonsService, PokeapiService, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .compile();

    service = module.get<PokemonsService>(PokemonsService);
    pokeapiService = module.get<PokeapiService>(PokeapiService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of pokemons', async () => {
      const result = [
        {
          id: 1,
          name: 'Bulbasaur',
          type: 'Grass',
          imageUrl: 'image',
        },
      ];
      mockPrismaService.pokemon.findMany.mockResolvedValue(result);

      expect(await service.findAll({})).toBe(result);
    });
  });

  describe('import', () => {
    it('should return the imported pokemon from external api', async () => {
      const result = {
        id: 1,
        name: 'Bulbasaur',
        type: 'Grass',
        imageUrl: 'image',
      };
      jest
        .spyOn(pokeapiService, 'get')
        .mockImplementation(() => Promise.resolve(result));
      mockPrismaService.pokemon.create.mockResolvedValue(result);

      expect(await service.import({ id: '1' })).toEqual(result);
      expect(prismaService.pokemon.create).toHaveBeenCalledWith({
        data: result,
      });
    });

    it('should return the pokemon from db if already exists', async () => {
      const result = {
        id: 1,
        name: 'Bulbasaur',
        type: 'Grass',
        imageUrl: 'image',
      };
      jest
        .spyOn(pokeapiService, 'get')
        .mockImplementation(() => Promise.resolve(result));
      mockPrismaService.pokemon.findUnique.mockResolvedValue(result);

      expect(await service.import({ id: '1' })).toEqual(result);
      expect(pokeapiService.get).not.toHaveBeenCalled();
      expect(prismaService.pokemon.create).not.toHaveBeenCalled();
    });
  });
});
