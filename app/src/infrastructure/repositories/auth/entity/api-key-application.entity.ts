import { Column, Entity, Index, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity({ name: 'api_key_application' })
export class ApiKeyApplication {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({ length: 36 })
  @Index()
  apiKey: string;

  @Column({ length: 36 })
  userId: string;

  @Column()
  description: string;

  @Column()
  createdAt: string;
}
