import { ConfigModule } from '@nestjs/config';
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LoggerMiddleware } from './middlewares/logger.middleware';
import { PokemonsModule } from './pokemons/pokemons.module';
import { PokemonsController } from './pokemons/pokemons.controller';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PokemonsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes(PokemonsController);
  }
}
