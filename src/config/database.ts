/**
 * Interface for database configuration settings
 *
 * @interface DatabaseConfig
 */
export interface DatabaseConfig {
  pgHost: string;
  pgPort: number;
  pgDB: string;
  pgPassword: string;
  pgUser: string;
}

// default settings are for development environment
const databaseConfig: DatabaseConfig = {
  pgHost: process.env.POSTGRES_HOST || '127.0.0.1',
  pgPort: Number(process.env.POSTGRES_PORT) || 5432,
  pgDB: process.env.POSTGRES_DB || 'cosmoshub',
  pgUser: process.env.POSTGRES_USER || 'root',
  pgPassword: process.env.POSTGRES_PASSWORD || 'admin',
};

export default databaseConfig;
