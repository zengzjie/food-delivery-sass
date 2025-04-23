import { Module } from '@nestjs/common';
import { AppService } from './app.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose } from '@apollo/gateway';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      gateway: {
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            {
              name: 'users',
              url: 'http://localhost:4001/graphql',
            },
            // {
            //   name: 'products',
            //   url: 'http://localhost:4002/graphql',
            // },
            // {
            //   name: 'orders',
            //   url: 'http://localhost:4003/graphql',
            // },
          ],
        }),
      },
    }),
  ],
  providers: [AppService],
})
export class AppModule {}
