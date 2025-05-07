import { Column, Entity, PrimaryGeneratedColumn, ManyToMany, JoinTable, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from '../../category/entities/category.entity';
import { Ingredient } from '../../ingredient/entities/ingredient.entity';
import { Instruction } from '../../instruction/entities/instruction.entity';
import { Review } from '../../review/entities/review.entity';
import { Favorite } from '../../favorite/entities/favorite.entity';
import { Searches } from '../../searches/entities/searches.entity';
import { User } from '../../user/entities/user.entity';

@Entity('Recipe')
export class Recipe {
  @PrimaryGeneratedColumn()
  recipe_id: number;

  @Column()
  recipe_name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  recipe_type: string;

  @Column({ nullable: true })
  servings: number;

  @Column({ nullable: true })
  prep_time: number;

  @Column({ nullable: true })
  cook_time: number;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', nullable: true })
  created_at: Date | null;

  @Column({ type: 'json', nullable: true })
  images: string[];

  @Column({ type: 'json', nullable: true })
  videos: string[];

  @ManyToOne(() => User, (user) => user.recipes, { onDelete: 'SET NULL', nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User | null;

  @ManyToMany(() => Ingredient, (ingredient) => ingredient.recipes, { cascade: true })
  @JoinTable({
    name: 'Has',
    joinColumn: { name: 'recipe_id', referencedColumnName: 'recipe_id' },
    inverseJoinColumn: { name: 'ingredient_id', referencedColumnName: 'ingredient_id' },
  })
  ingredients: Ingredient[];

  @ManyToMany(() => Category, (category) => category.recipes, { cascade: true })
  @JoinTable({
    name: 'RecipeCategory',
    joinColumn: { name: 'recipe_id', referencedColumnName: 'recipe_id' },
    inverseJoinColumn: { name: 'category_id', referencedColumnName: 'category_id' },
  })
  categories: Category[];

  @OneToMany(() => Instruction, (instruction) => instruction.recipe, { cascade: true })
  instructions: Instruction[];

  @OneToMany(() => Review, (review) => review.recipe, { cascade: true })
  reviews: Review[];

  @OneToMany(() => Favorite, (favorite) => favorite.recipe, { cascade: true })
  favorites: Favorite[];

  @OneToMany(() => Searches, (search) => search.recipe, { cascade: true })
  searches: Searches[];
}