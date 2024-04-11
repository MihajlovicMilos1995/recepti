import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Recipe } from '../recipes/recipe.entity';
import { User } from '../user/user.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToMany(() => Recipe, (recipe) => recipe.id)
  recipes: Recipe[];

  @ManyToMany(() => User, (user) => user.id)
  user: User[];

  @CreateDateColumn()
  createdAt: Date;

  @Column()
  review: string;
}
