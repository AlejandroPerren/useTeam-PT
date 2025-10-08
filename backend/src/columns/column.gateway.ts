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
import { ColumnsService } from './column.service';

@WebSocketGateway({ cors: { origin: 'http://localhost:5173' } })
export class ColumnGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private userSockets = new Map<string, string>();

  constructor(private readonly columnService: ColumnsService) {}

  handleConnection(client: Socket) {
    console.log('Cliente conectado a columnas:', client.id);
    const name = client.handshake.auth?.name;

    if (!name || typeof name !== 'string') {
      console.log('Conexión rechazada: nombre de usuario no proporcionado');
      client.disconnect();
      return;
    }

    this.userSockets.set(name, client.id);
    this.server.emit('on-clients-changed', Array.from(this.userSockets.keys()));
  }

  handleDisconnect(client: Socket) {
    console.log('Cliente desconectado de columnas:', client.id);
    for (const [name, socketId] of this.userSockets.entries()) {
      if (socketId === client.id) this.userSockets.delete(name);
    }
    this.server.emit('on-clients-changed', Array.from(this.userSockets.keys()));
  }

  // Unirse a un board
  @SubscribeMessage('joinBoard')
  async handleJoinBoard(
    @MessageBody() boardId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.join(boardId);
    console.log(`Cliente ${client.id} se unió al board ${boardId}`);

    const columns = await this.columnService.findAll(boardId);
    client.emit('on-columns-initial', columns);
  }

  @SubscribeMessage('leaveBoard')
  handleLeaveBoard(
    @MessageBody() boardId: string,
    @ConnectedSocket() client: Socket,
  ) {
    client.leave(boardId);
    console.log(`Cliente ${client.id} salió del board ${boardId}`);
  }

  @SubscribeMessage('createColumn')
  async handleCreateColumn(
    @MessageBody() data: { boardId: string; name: string },
  ) {
    const newColumn = await this.columnService.create(data);
    this.emitToBoard(data.boardId, 'on-column-created', newColumn);
    return newColumn;
  }

  @SubscribeMessage('updateColumn')
  async handleUpdateColumn(
    @MessageBody() data: { id: string; updates: any; boardId: string },
  ) {
    const updated = await this.columnService.update(data.id, data.updates);
    this.emitToBoard(data.boardId, 'on-column-updated', updated);
    return updated;
  }

  @SubscribeMessage('deleteColumn')
  async handleDeleteColumn(
    @MessageBody() data: { id: string; boardId: string },
  ) {
    const deleted = await this.columnService.remove(data.id);
    this.emitToBoard(data.boardId, 'on-column-deleted', deleted);
    return deleted;
  }

  @SubscribeMessage('changeColumnOrder')
  async handleChangeOrder(
    @MessageBody() data: { columnId: string; newOrder: number },
  ) {
    const columns = await this.columnService.changeOrder(
      data.columnId,
      data.newOrder,
    );
    const boardId = columns[0]?.boardId;
    if (boardId)
      this.emitToBoard(boardId.toString(), 'on-columns-reordered', columns);
    return columns;
  }

  private emitToBoard(boardId: string, event: string, data: any) {
    if (!boardId) return;
    this.server.to(boardId).emit(event, data);
  }
}
