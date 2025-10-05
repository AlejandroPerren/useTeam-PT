export default () => ({
  port: parseInt(process.env.PORT ?? '3000', 10),
  database: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/kanban-board',
  },
  n8nWebhookUrl: process.env.N8N_WEBHOOK_URL,
});
