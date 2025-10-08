import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { TasksService } from './tasks.service';

@WebSocketGateway({ cors: { origin: 'http://localhost:5173' } })
export class TasksGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets = new Map<string, string>();

  constructor(private readonly tasksService: TasksService) {}

  handleConnection(client: Socket) {
    console.log('Cliente conectado a Tareas:', client.id);
    const { name } = client.handshake.auth;

    if (!name) {
      client.disconnect();
      return;
    }

    this.userSockets.set(name, client.id);
    this.server.emit('on-clients-changed', Array.from(this.userSockets.keys()));
  }

  handleDisconnect(client: Socket) {
    console.log('Cliente desconectado de Tareas:', client.id);
    for (const [name, socketId] of this.userSockets.entries()) {
      if (socketId === client.id) this.userSockets.delete(name);
    }
    this.server.emit('on-clients-changed', Array.from(this.userSockets.keys()));
  }

  @SubscribeMessage('joinBoard')
  async handleJoinBoard(
    @MessageBody() boardId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(boardId);
    console.log(`Cliente ${client.id} se unió al board ${boardId} en tareas`);

    const tasks = await this.tasksService.findAll(boardId);
    client.emit('on-tasks-initial', tasks);
  }

  @SubscribeMessage('leaveBoard')
  handleLeaveBoard(
    @MessageBody() data: { boardId: string },
    @ConnectedSocket() client: Socket,
  ) {
    const room = `board-${data.boardId}`;
    client.leave(room);
    console.log(`Cliente ${client.id} salió de ${room}`);
  }

  @SubscribeMessage('createTask')
  async handleCreateTask(@MessageBody() data: any) {
    const newTask = await this.tasksService.create(data);
    this.emitToBoard(data.boardId, 'on-task-created', newTask);
    return newTask;
  }

  @SubscribeMessage('updateTask')
  async handleUpdateTask(@MessageBody() data: any) {
    const updated = await this.tasksService.update(data.id, data.updates);
    this.emitToBoard(data.boardId, 'on-task-updated', updated);
    return updated;
  }

  @SubscribeMessage('deleteTask')
  async handleDeleteTask(@MessageBody() data: any) {
    const deleted = await this.tasksService.remove(data.id);
    this.emitToBoard(data.boardId, 'on-task-deleted', deleted);
    return deleted;
  }

  @SubscribeMessage('changeTaskOrder')
  async handleChangeOrder(@MessageBody() data: any) {
    const tasks = await this.tasksService.changeOrder(
      data.taskId,
      data.columnId,
      data.newOrder,
    );
    const boardId = tasks[0]?.boardId;
    if (boardId) this.emitToBoard(boardId, 'on-tasks-reordered', tasks);
    return tasks;
  }

  private emitToBoard(boardId: string, event: string, data: any) {
    const room = `board-${boardId}`;
    this.server.to(room).emit(event, data);
  }
}
