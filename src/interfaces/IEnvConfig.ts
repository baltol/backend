export interface IEnvConfig {
  jwtSecretKey: string;
  port: number;
  postgresUri: string;
  apiPrefix?: string;
}