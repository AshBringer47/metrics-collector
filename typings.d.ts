declare global {
  namespace NodeJS {
    interface ProcessEnv {
      MONGO_DB_URI: string;
      CONSUL_URI: string;
      SEND_NOTIFICATION_FUNCTION_GROUP: 'notifier';
      PROCESS_DATA_FUNCTION_GROUP: 'data_processor';
      MICROSERVICE_ID: string;
      PORT: string;
    }
  }
}

export {};
