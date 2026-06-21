import { BaseEntity } from '@shared/abstracts/base.entity';
import { GenderEnum } from '@shared/enums/gender.enum';
import { Roles } from '@shared/enums/role-app.enum';
import { Column, Entity, Index } from 'typeorm';

@Entity()
export class User extends BaseEntity {
  @Column({ length: 100, nullable: true })
  @Index()
  fullname?: string;

  @Column({ length: 11, unique: true, nullable: true })
  phone?: string;

  @Column({ nullable: true, select: false })
  password?: string;

  @Column({
    type: 'enum',
    enum: Roles,
    default: Roles.USER,
  })
  role: Roles;

  @Column({ unique: true, nullable: true })
  email?: string;

  @Column({
    type: 'enum',
    enum: GenderEnum,
    nullable: true,
  })
  gender: GenderEnum;

  @Column({ nullable: true })
  refreshToken?: string;
}
