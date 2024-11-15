import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { AppService } from './../src/app.service';
import { Pokemon } from '@prisma/client';
import { PrismaService } from '../src/prisma/prisma.service';
import { HttpService } from '@nestjs/axios';
import { PokemonsService } from '../src/pokemons/pokemons.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  const appService = { getHello: () => 'Hello World!' };
  const expectedPokemon: Pokemon = {
    id: 1,
    name: 'bulbasaur',
    type: 'grass,poison',
    imageUrl: 'http://image.url/bulbasaur.png',
  };
  const pokemonsService = { import: () => expectedPokemon };

  const mockHttpService = {
    get: jest.fn(),
  };

  const mockPrismaService = {
    pokemon: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(AppService)
      .useValue(appService)
      .overrideProvider(PokemonsService)
      .useValue(pokemonsService)
      .overrideProvider(PrismaService)
      .useValue(mockPrismaService)
      .overrideProvider(HttpService)
      .useValue(mockHttpService)
      .compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect(appService.getHello());
  });

  it('/pokemons/import (POST)', () => {
    return request(app.getHttpServer())
      .post('/pokemons/import')
      .expect(201)
      .expect(pokemonsService.import());
  });

  afterAll(async () => {
    await app.close();
  });
});
