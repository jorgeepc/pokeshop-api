import { IsNotEmpty } from 'class-validator';

export class ImportPokemonDto {
  @IsNotEmpty()
  id: string;
}
