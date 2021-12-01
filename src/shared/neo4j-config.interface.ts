export type Neo4jSchema =
  | 'neo4j'
  | 'neo4j+s'
  | 'neo4j+ssc'
  | 'bolt'
  | 'bolt+s'
  | 'bolt+ssc';
export interface Neo4jConfig {
  schema: Neo4jSchema;
  host: string;
  port: number | string;
  username: string;
  password: string;
  database?: string;
}
