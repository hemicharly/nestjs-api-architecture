import { Column, Entity, Index, ObjectIdColumn } from 'typeorm';
import { ObjectId } from 'mongodb';

@Entity({ name: 'orders' })
@Index(['employeeId', 'schedulingDate'])
export class OrderEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column()
  employeeId: string;

  @Column()
  serviceDescription: string;

  @Column()
  companyName: string;

  @Column()
  companyAddressLatitude: string;

  @Column()
  companyAddressLongitude: string;

  @Column()
  schedulingDate: string;

  @Column({ nullable: true })
  startDatetime?: string;

  @Column({ nullable: true })
  endDatetime?: string;

  @Column({ nullable: true })
  endComment?: string;

  @Column({ nullable: true })
  recordedLatitude?: string;

  @Column({ nullable: true })
  recordedLongitude?: string;

  @Column()
  status: string;

  @Column()
  createdAt: string;

  @Column({ nullable: true })
  updatedAt?: string;
}
