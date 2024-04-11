import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Recipe } from './recipe.entity';

@Entity()
export class Instruction {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  stepNumber: number;

  @Column()
  instruction: string;

  @ManyToOne(() => Recipe, (recipe) => recipe.id)
  recipe: Recipe;
}
