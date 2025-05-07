import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Recipe } from '../../recipe/entities/recipe.entity';
import { User } from '../../user/entities/user.entity';

@Entity('Review')
export class Review {
  @PrimaryGeneratedColumn()
  review_id: number;


  @ManyToOne(() => Recipe, (recipe) => recipe.reviews)
  @JoinColumn({ name: 'recipe_id' })
  @Column({ name: 'recipe_id', type: 'int', nullable: true })
  recipe: Recipe;

  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: 'user_id' })
  @Column({ name: 'user_id', type: 'int', nullable: true })
  user: User;

  @Column({ type: 'int', default: 1 })
  rating: number;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}