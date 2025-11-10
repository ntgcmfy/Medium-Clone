import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Article } from '../../article/entities/article.entity';
import { Comment } from '../../comment/entities/comment.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  username: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  bio: string;

  @Column({ nullable: true })
  image: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // User has many articles
  @OneToMany(() => Article, (article) => article.author)
  articles: Article[];

  // User has many comments
  @OneToMany(() => Comment, (comment) => comment.author)
  comments: Comment[];

  // Many-to-many: Users can favorite many articles
  @ManyToMany(() => Article, (article) => article.favoritedBy)
  @JoinTable({
    name: 'user_favorites_article',
    joinColumn: { name: 'user_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'article_id', referencedColumnName: 'id' },
  })
  favorites: Article[];

  // Many-to-many: Users can follow many users (followers)
  @ManyToMany(() => User, (user) => user.following)
  @JoinTable({
    name: 'user_follows_user',
    joinColumn: { name: 'follower_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'following_id', referencedColumnName: 'id' },
  })
  followers: User[];

  // Many-to-many: Users can be followed by many users (following)
  @ManyToMany(() => User, (user) => user.followers)
  following: User[];
}