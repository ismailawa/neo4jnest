import { Neo4jService } from './neo4j/neo4j.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  constructor(private readonly neo4jService: Neo4jService) {}
  async getHello(): Promise<any> {
    const result = await this.neo4jService.read(
      'MATCH (n) RETURN count(n) AS count',
      {},
    );
    const count = result.records[0].get('count');
    return result.records[0];
  }
}
