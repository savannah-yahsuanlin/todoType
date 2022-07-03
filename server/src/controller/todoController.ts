import { Todo } from '../models/Todo'
import { Request, Response, NextFunction } from "express"
import { getRepository, getConnection, UpdateResult, InsertResult, DeleteResult} from "typeorm"

export interface TokenBody {
  id: string;
  name: string;
	isDone: boolean;
}
export interface ITodoId {
 id:string
}

export const getAllTodo = async(name?: string, id?: string, isDone?: boolean): Promise<Todo[] | undefined> => {
	try {
		const todo = await getConnection().getRepository(Todo).find()
		return todo;
	} catch (error) {
		console.log(error)
	}

}

export const getTodo = async(id?: string ): Promise<Todo | undefined> => {
	try {
		if(id) {
			const todo = await getConnection().getRepository(Todo).findOne({ id })
			return todo	
		}
	} catch (error) {
		console.log(error)
	}
}

export const addTodo = async({id, name, isDone}:TokenBody): Promise<InsertResult | undefined> => {
	try {
		 const todo = await getConnection().createQueryBuilder().insert().into(Todo).values({id, name, isDone}).returning('*')
      .execute();
		return todo
	} catch (error) {
		console.log(error)
	}
}

export const deleteTodo = async(id:string): Promise<DeleteResult | undefined> => {
	try {
		const deleted = await getConnection()
				.createQueryBuilder()
				.delete()
				.from(Todo)
				.where({ id })
				.execute()
    return deleted
	} catch (error) {
		console.log(error)
	}
}

export const updateTodo = async (id: string, name: string, isDone: boolean): Promise<UpdateResult | undefined> => {
  try {
    const updated = await getConnection()
      .createQueryBuilder()
      .update(Todo)
			.set({name, isDone})
      .where({ id })
      .returning('*')
      .execute();
    return updated;
  } catch (error) {
    console.log(error)
  }
}


export const isComplete = async ({id}: ITodoId, isDone: boolean): Promise<UpdateResult | undefined> => {
  try {
    const result = await getConnection()
      .getRepository(Todo)
      .createQueryBuilder()
      .update(Todo)
			.set({ isDone })
      .where({ id })
      .returning('*')
      .execute();
    return result;
  } catch (error) {
    console.log(error)
  }
}

