import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Ingredient } from './ingredient.entity';
import { User } from '../user/user.entity';
import { Instruction } from './instruction.entity';
import { Diet } from './diet.entity';
import { MealType } from './mealType.entity';
import { Review } from '../review/review.entity';
import { Image } from '../images/images.entity';

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToMany(() => Ingredient, (ingredient) => ingredient.recipe)
  ingredients: Ingredient[];

  @ManyToOne(() => User, (user) => user.id)
  user: User;

  @Column()
  verified: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @OneToMany(() => Instruction, (instruction) => instruction.id)
  instructions: Instruction[];

  @ManyToMany(() => Diet, (mealType) => mealType.id)
  diets: Diet[];

  @ManyToMany(() => MealType, (mealType) => mealType.id)
  type: MealType[];

  @ManyToMany(() => Review, (review) => review.id)
  reviews: Review[];

  @OneToMany(() => Image, (image) => image.id)
  images: Image[];
}
