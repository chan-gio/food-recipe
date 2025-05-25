import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Recipe } from '../../recipe/entities/recipe.entity';

@Entity('Category')
export class Category {
  @PrimaryGeneratedColumn()
  category_id: number;

  @Column({ unique: true })
  category_name: string;

  @ManyToMany(() => Recipe, (recipe) => recipe.categories)
  recipes: Recipe[];
}