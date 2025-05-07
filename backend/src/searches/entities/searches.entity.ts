import { Entity, Column, ManyToOne, PrimaryColumn, JoinColumn } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Recipe } from '../../recipe/entities/recipe.entity';

@Entity('Searches')
export class Searches {
  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  recipe_id: number;

  @ManyToOne(() => User, (user) => user.searches)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Recipe, (recipe) => recipe.searches)
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;

  @Column({ type: 'varchar', length: 255, nullable: true })
  search_query: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  searched_at: Date;
}