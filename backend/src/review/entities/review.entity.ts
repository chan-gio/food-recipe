import { Column, Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Recipe } from '../../recipe/entities/recipe.entity';
import { User } from '../../user/entities/user.entity';

@Entity('Review')
export class Review {
  @PrimaryGeneratedColumn()
  review_id: number;

  @ManyToOne(() => Recipe, (recipe) => recipe.reviews)
  @JoinColumn({ name: 'recipe_id' })
  recipe: Recipe;

  @ManyToOne(() => User, (user) => user.reviews)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'int', nullable: true })
  rating: number | null;

  @Column({ type: 'text', nullable: true })
  comment: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @ManyToOne(() => Review, (review) => review.replies, { nullable: true })
  @JoinColumn({ name: 'parent_review_id' })
  parent: Review | null;

  @OneToMany(() => Review, (review) => review.parent)
  replies: Review[];
}