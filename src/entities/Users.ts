import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Sessions } from './Sessions';

export enum Gender {
  M = 'M',
  W = 'W',
}

@Index('email', ['email'], { unique: true })
@Index('nickname', ['nickname'], { unique: true })
@Entity('users', { schema: 'serverless_nest' })
export class Users {
  @PrimaryGeneratedColumn({ type: 'int', name: 'user_id' })
  userId: number;

  @Column({ type: 'varchar', name: 'email', unique: true, length: 50 })
  email: string;

  @Column({
    type: 'varchar',
    name: 'hashed_password',
    length: 255,
    select: false,
  })
  hashedPassword: string;

  @Column({ type: 'varchar', name: 'salt', length: 255, select: false })
  salt: string;

  @Column({ type: 'varchar', name: 'nickname', unique: true, length: 50 })
  nickname: string;

  @Column({ type: 'enum', name: 'gender', enum: Gender })
  gender: Gender;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @UpdateDateColumn({
    type: 'timestamp',
    name: 'updated_at',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @OneToMany(() => Sessions, (sessions) => sessions.user)
  sessions: Sessions[];
}
