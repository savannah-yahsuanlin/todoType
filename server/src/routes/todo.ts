import express from 'express';
import {	getAllTodo, getTodo, deleteTodo, addTodo, updateTodo, isComplete} from '../controller/todoController'
import { socketServer } from '../app';
const router = express.Router()


router.get('/', async (request, response, next) => {
    try {
      response.send(await getAllTodo())
    } catch (err) {
      next(err);
    }
});

router.get('/:id', async (request, response, next) => {
		const { id }= request.params
    try {
      response.send(await getTodo(id))
    } catch (err) {
      next(err);
    }
});

router.post('/', async (request, response, next) => {
    try {
			socketServer().emit('addTodo', request.body)
      response.send(await addTodo(request.body))
    } catch (err) {
      next(err);
    }
});

router.delete('/:id', async(request, response, next) => {
	try {
		const { id }= request.params
		response.send(await deleteTodo(id))
	} catch (err) {
		next(err)
	}
})

router.put('/:id/updated', async(request, response, next) => {
	const {id, name, isDone} = request.body
	try {
		socketServer().emit('updateTodo', { id, name, isDone })
		response.send(await updateTodo(id, name, isDone))
	} catch (err) {
		next(err)
	}
})

router.put('/:id/updated/done', async(request, response, next) => {
	try {
		const id = request.body.todo.id
		const { isDone} = request.body
		const updatedDone = await isComplete({ id }, isDone)
		socketServer().emit('updatedDone', { id, isDone })
		response.send(updatedDone)
	} catch (err) {
		next(err)
	}
})

export default router;