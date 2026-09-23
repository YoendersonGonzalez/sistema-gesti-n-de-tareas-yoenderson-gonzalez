import dotenv from 'dotenv';

dotenv.config();

/**
 * Clase Singleton que centraliza el acceso a las variables de entorno.
 * Se carga una sola vez y queda disponible en toda la aplicación.
 */
class EnvConfig {
  private static instance: EnvConfig;

  public readonly port: number;
  public readonly nodeEnv: string;

  public readonly dbHost: string;
  public readonly dbPort: number;
  public readonly dbName: string;
  public readonly dbUser: string;
  public readonly dbPassword: string;

  public readonly jwtSecret: string;
  public readonly jwtExpiresIn: string;

  private constructor() {
    this.port = Number(process.env.PORT) || 3000;
    this.nodeEnv = process.env.NODE_ENV || 'development';

    this.dbHost = process.env.DB_HOST || 'localhost';
    this.dbPort = Number(process.env.DB_PORT) || 5432;
    this.dbName = process.env.DB_NAME || '';
    this.dbUser = process.env.DB_USER || '';
    this.dbPassword = process.env.DB_PASSWORD || '';

    this.jwtSecret = process.env.JWT_SECRET || '';
    this.jwtExpiresIn = process.env.JWT_EXPIRES_IN || '1d';

    this.validate();
  }

  public static getInstance(): EnvConfig {
    if (!EnvConfig.instance) {
      EnvConfig.instance = new EnvConfig();
    }
    return EnvConfig.instance;
  }

  private validate(): void {
    if (!this.dbName || !this.dbUser) {
      throw new Error('Faltan variables de entorno de la base de datos. Revisa tu archivo .env');
    }
    if (!this.jwtSecret) {
      throw new Error('Falta la variable JWT_SECRET en el archivo .env');
    }
  }
}

export default EnvConfig.getInstance();