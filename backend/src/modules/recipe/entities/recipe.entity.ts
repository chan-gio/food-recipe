import { Entity, PrimaryGeneratedColumn, Column, ManyToMany, JoinTable } from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { Ingredient } from '../../ingredient/entities/ingredient.entity';

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn()
  recipe_id: number;

  @Column({ length: 100 })
  recipe_name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 50 })
  recipe_type: string;

  @Column()
  quantity: number;

  @ManyToMany(() => Category, category => category.recipes)
  @JoinTable({ name: 'RecipeCategory' })
  categories: Category[];

  @ManyToMany(() => Ingredient, ingredient => ingredient.recipes)
  @JoinTable({ name: 'Has' })
  ingredients: Ingredient[];
}
