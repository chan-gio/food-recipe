import { Column, Entity, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { Recipe } from '../../recipe/entities/recipe.entity';

@Entity('Ingredient')
export class Ingredient {
  @PrimaryGeneratedColumn()
  ingredient_id: number;

  @Column()
  ingredient_name: string;

  @Column({ nullable: true })
  ingredient_type: string;

  @Column({ type: 'float', nullable: true })
  amount: number;

  @Column({ nullable: true })
  unit: string;

  @ManyToMany(() => Recipe, (recipe) => recipe.ingredients)
  recipes: Recipe[];
}

