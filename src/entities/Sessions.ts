import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Users } from './Users';

@Index('user_id', ['userId'], {})
@Entity('sessions', { schema: 'serverless_nest' })
export class Sessions {
  @Column('char', { primary: true, name: 'session_id', length: 36 })
  sessionId: string;

  @Column({ type: 'int', name: 'user_id' })
  userId: number;

  @Column({ type: 'varchar', name: 'refresh_token', length: 255 })
  refreshToken: string;

  @Column({ type: 'varchar', name: 'user_agent', length: 255 })
  userAgent: string;

  @Column({ type: 'varchar', name: 'client_ip', length: 255 })
  clientIp: string;

  @Column({
    type: 'tinyint',
    name: 'is_blocked',
    width: 1,
    default: () => 0,
  })
  isBlocked: boolean;

  @CreateDateColumn({
    type: 'timestamp',
    name: 'created_at',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createdAt: Date;

  @ManyToOne(() => Users, (users) => users.sessions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn([
    {
      name: 'user_id',
      referencedColumnName: 'userId',
      foreignKeyConstraintName: 'fk_user_id',
    },
  ])
  user: Users;
}
