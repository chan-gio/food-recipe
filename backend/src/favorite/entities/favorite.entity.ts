import { Entity, ManyToOne, Column, PrimaryColumn, JoinColumn } from 'typeorm';
import { Recipe } from '../../recipe/entities/recipe.entity';
import { User } from '../../user/entities/user.entity';

@Entity('Favorite')
export class Favorite {
  @PrimaryColumn()
  user_id: number;

  @PrimaryColumn()
  recipe_id: number;

  @ManyToOne(() => User, (user) => user.favorites)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Recipe, (recipe) => recipe.favorites)
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  favorited_at: Date;
}