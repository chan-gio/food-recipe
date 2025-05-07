import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Recipe } from '../../recipe/entities/recipe.entity';

@Entity('Instruction')
export class Instruction {
  @PrimaryGeneratedColumn()
  instruction_id: number;

  @ManyToOne(() => Recipe, (recipe) => recipe.instructions)
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;

  @Column()
  step_number: number;

  @Column({ type: 'text' })
  description: string;
}