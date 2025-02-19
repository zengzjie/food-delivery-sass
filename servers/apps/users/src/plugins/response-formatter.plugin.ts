import { ApolloServerPlugin, GraphQLRequestListener } from '@apollo/server';
import { Plugin } from '@nestjs/apollo';

@Plugin()
export class ResponseFormatterPlugin implements ApolloServerPlugin {
  async requestDidStart(): Promise<GraphQLRequestListener<any>> {
    return {
      async willSendResponse({ response }) {
        // 判断 response.body 是 'single' 还是 'incremental'
        if (response.body.kind === 'single') {
          const data = response.body.singleResult.data;
          const errors = response.body.singleResult.errors;

          console.log('Single Response Data:', data); // 打印响应数据
          if (errors) {
            console.log('Single Response Errors:', errors); // 打印响应的错误信息（如果有）
          }

          // 在这里你可以格式化或修改响应数据
          if (data) {
            console.log(
              response.body.singleResult,
              data,
              'response.body.singleResult',
            );

            response.body = {
              kind: 'single',
              singleResult: {
                ...response.body.singleResult,
                data: {
                  ...data,
                },
              },
            };
          }
        } else if (response.body.kind === 'incremental') {
          // 如果是增量响应（非常少见，但如果使用了增量查询就需要处理）
          const initialData = response.body.initialResult.data;
          console.log('Incremental Initial Response Data:', initialData);

          // 对增量响应结果进行处理
          // 这里你可能需要处理 subsequentResults，这个是一个 AsyncIterable
          for await (const result of response.body.subsequentResults) {
            console.log('Incremental Subsequent Result:', result);
          }
        }
      },
    };
  }
}
