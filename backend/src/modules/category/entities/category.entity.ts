import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Recipe } from '../../recipe/entities/recipe.entity';

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  category_id: number;

  @Column({ length: 100 })
  category_name: string;

  @ManyToMany(() => Recipe, recipe => recipe.categories)
  recipes: Recipe[];
}
