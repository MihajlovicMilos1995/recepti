import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Recipe } from '../recipes/recipe.entity';
import { User } from '../user/user.entity';

@Entity()
export class Raiting {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToMany(() => Recipe, (recipe) => recipe.id)
  recipes: Recipe[];

  @ManyToMany(() => User, (user) => user.id)
  user: User[];

  @Column()
  raiting: number;
}
