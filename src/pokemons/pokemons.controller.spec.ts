import { HttpModule } from '@nestjs/axios';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule } from '@nestjs/config';
import { PokemonsController } from './pokemons.controller';
import { PokeapiService } from './pokeapi.service';
import { PokemonsService } from './pokemons.service';
import { PrismaService } from '../prisma/prisma.service';

describe('PokemonsController', () => {
  let controller: PokemonsController;
  let service: PokemonsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot(), HttpModule],
      controllers: [PokemonsController],
      providers: [PrismaService, PokemonsService, PokeapiService],
    }).compile();

    controller = module.get<PokemonsController>(PokemonsController);
    service = module.get<PokemonsService>(PokemonsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
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
      jest
        .spyOn(service, 'findAll')
        .mockImplementation(() => Promise.resolve(result));

      expect(await controller.findAll()).toBe(result);
    });
  });

  describe('import', () => {
    it('should return the imported pokemon', async () => {
      const result = {
        id: 1,
        name: 'Bulbasaur',
        type: 'Grass',
        imageUrl: 'image',
      };
      jest
        .spyOn(service, 'import')
        .mockImplementation(() => Promise.resolve(result));

      expect(await controller.import({ id: '1' })).toEqual(result);
    });

    it('should return null if the pokemon is not found', async () => {
      jest
        .spyOn(service, 'import')
        .mockImplementation(() => Promise.resolve(null));

      expect(await controller.import({ id: '1' })).toEqual(null);
    });
  });
});
