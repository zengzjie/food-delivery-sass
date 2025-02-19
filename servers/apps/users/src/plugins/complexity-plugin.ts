import {
  ApolloServerPlugin,
  BaseContext,
  GraphQLRequestListener,
} from '@apollo/server';
import { BadRequestException } from '@nestjs/common';
import { GraphQLSchemaHost } from '@nestjs/graphql';
import {
  fieldExtensionsEstimator,
  getComplexity,
  simpleEstimator,
} from 'graphql-query-complexity';

/**
 * @description 查询复杂度插件
 */
export class ComplexityPlugin implements ApolloServerPlugin {
  constructor(private readonly gqlSchemaHost: GraphQLSchemaHost) {}

  async requestDidStart(): Promise<GraphQLRequestListener<BaseContext>> {
    const { schema } = this.gqlSchemaHost;

    return {
      async didResolveOperation({ request, document }) {
        // 计算查询复杂度
        const complexity = getComplexity({
          schema,
          operationName: request.operationName,
          query: document,
          variables: request.variables,
          estimators: [
            fieldExtensionsEstimator(),
            simpleEstimator({ defaultComplexity: 1 }),
          ],
        });

        console.log(`Query complexity: ${complexity}`);
        // 一个 graphql 字段为一个复杂度，最多不能超过50个字段.
        if (complexity > 50) {
          throw new BadRequestException(
            `GraphQL query is too complex: ${complexity}. Maximum allowed complexity: 50`,
          );
        }
      },
    };
  }
}
