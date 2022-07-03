import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';


@Entity()
export class Todo {
	@PrimaryGeneratedColumn() 
	id: string

  @Column()
  name: string;

  @Column({default: false})
  isDone: boolean;
}