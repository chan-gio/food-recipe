import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Recipe } from '../../recipe/entities/recipe.entity';

@Entity()
export class Ingredient {
  @PrimaryGeneratedColumn()
  ingredient_id: number;

  @Column({ length: 100 })
  ingredient_name: string;

  @Column({ length: 50, nullable: true })
  ingredient_type: string;

  @Column({ length: 50 })
  ing_amount: string;

  @ManyToMany(() => Recipe, recipe => recipe.ingredients)
  recipes: Recipe[];
}
