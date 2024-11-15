import { IsNotEmpty } from 'class-validator';

export class CreatePokemonDto {
  @IsNotEmpty()
  name: string;

  type: string;
  imageUrl: string;
}
