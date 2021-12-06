import { ConfigModule } from '@nestjs/config';
import { createDriver } from './../shared/neo4j.util';
import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { NEO4J_CONFIG, NEO4J_DRIVER } from '../shared/constants';
import { Neo4jConfig } from '../shared/neo4j-config.interface';
import { Neo4jService } from './neo4j.service';
@Module({})
export class Neo4jModule {
  static forRoot(config: Neo4jConfig): DynamicModule {
    return {
      module: Neo4jModule,
      global: true,
      providers: [
        { provide: NEO4J_CONFIG, useValue: config },
        {
          provide: NEO4J_DRIVER,
          inject: [NEO4J_CONFIG],
          useFactory: async (config: Neo4jConfig) => createDriver(config),
        },
        Neo4jService,
      ],
      exports: [Neo4jService],
    };
  }

  static forRootAsync(configProvider): DynamicModule {
    return {
      module: Neo4jModule,
      global: true,
      imports: [ConfigModule],

      providers: [
        {
          provide: NEO4J_CONFIG,
          ...configProvider,
        } as Provider<any>,
        {
          provide: NEO4J_DRIVER,
          inject: [NEO4J_CONFIG],
          useFactory: async (config: Neo4jConfig) => createDriver(config),
        },
        Neo4jService,
      ],
      exports: [Neo4jService],
    };
  }
}
