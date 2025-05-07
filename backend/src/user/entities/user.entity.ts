import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Review } from '../../review/entities/review.entity';
import { Favorite } from '../../favorite/entities/favorite.entity';
import { Searches } from '../../searches/entities/searches.entity';
import { Recipe } from '../../recipe/entities/recipe.entity';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn()
  user_id: number;

  @Column({ unique: true, type: 'varchar', length: 255 })
  signin_account: string;

  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ unique: true, nullable: true, type: 'varchar', length: 255 })
  email: string | null;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  full_name: string | null;

  @Column({ nullable: true, type: 'varchar', length: 255 })
  profile_picture: string | null;

  @Column({ type: 'enum', enum: ['user', 'admin'], default: 'user' })
  role: 'user' | 'admin';

  @OneToMany(() => Recipe, (recipe) => recipe.user)
  recipes: Recipe[];

  @OneToMany(() => Review, (review) => review.user)
  reviews: Review[];

  @OneToMany(() => Favorite, (favorite) => favorite.user)
  favorites: Favorite[];

  @OneToMany(() => Searches, (search) => search.user)
  searches: Searches[];
}