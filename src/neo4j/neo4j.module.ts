import { createDriver } from './../shared/neo4j.util';
import { DynamicModule, Module } from '@nestjs/common';
import { NEO4J_CONFIG, NEO4J_DRIVER } from 'src/shared/constants';
import { Neo4jConfig } from 'src/shared/neo4j-config.interface';
import { Neo4jService } from './neo4j.service';

@Module({})
export class Neo4jModule {
  static forRoot(config: Neo4jConfig): DynamicModule {
    return {
      module: Neo4jModule,
      providers: [
        Neo4jService,
        { provide: NEO4J_CONFIG, useValue: config },
        {
          provide: NEO4J_DRIVER,
          inject: [NEO4J_CONFIG],
          useFactory: async (config: Neo4jConfig) => createDriver(config),
        },
      ],
      exports: [Neo4jService],
    };
  }
}
