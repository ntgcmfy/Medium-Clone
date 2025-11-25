import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  ManyToMany,
  JoinTable,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Comment } from '../../comment/entities/comment.entity';
import { Tag } from './tag.entity';

@Entity('articles')
export class Article {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  slug: string;

  @Column()
  title: string;

  @Column()
  description: string;

  @Column('text')
  body: string;

  @Column({ name: 'favorites_count', default: 0 })
  favoritesCount: number;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  // Many articles belong to one author (user)
  @ManyToOne(() => User, (user) => user.articles, { eager: true })
  author: User;

  // Article has many comments
  @OneToMany(() => Comment, (comment) => comment.article)
  comments: Comment[];

  // Many-to-many: Articles can be favorited by many users
  @ManyToMany(() => User, (user) => user.favorites)
  favoritedBy: User[];

  // Many-to-many: Articles can have many tags
  @ManyToMany(() => Tag, (tag) => tag.articles, { eager: true })
  @JoinTable({
    name: 'article_tags_tag',
    joinColumn: { name: 'article_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'tag_id', referencedColumnName: 'id' },
  })
  tags: Tag[];

  @BeforeInsert()
  generateSlug() {
    this.slug = this.slugify(this.title);
  }

  @BeforeUpdate()
  updateSlug() {
    this.slug = this.slugify(this.title);
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-') +
      '-' +
      ((Math.random() * Math.pow(36, 6)) | 0).toString(36);
  }
}