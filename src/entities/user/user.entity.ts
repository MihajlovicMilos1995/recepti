import {
  Column,
  DeleteDateColumn,
  Entity,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Roles } from './role-type.eum';
import { Recipe } from '../recipes/recipe.entity';
import { Review } from '../review/review.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: Roles })
  role: Roles;

  @Column({ nullable: true, length: 30 })
  firstName: string;

  @Column({ nullable: true, length: 30 })
  lastName: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @Column({ type: 'timestamp', nullable: true })
  lastLogin: Date;

  @DeleteDateColumn()
  deleatedAt: Date;

  @OneToMany(() => Recipe, (recipe) => recipe.id)
  recipes: Recipe[];

  @OneToMany(() => Review, (review) => review.id)
  reviews: Review[];
  
  async validatePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt
      .compare(password, hashedPassword)
      .then((result) => result);
  }
}
