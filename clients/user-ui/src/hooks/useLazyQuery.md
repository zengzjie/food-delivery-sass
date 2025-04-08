### 使用 useLazyQuery 手动执行

当 `React` 渲染调用 `useQuery` 的组件时，`Apollo Client` 会自动执行相应的查询。但是，如果您希望响应除组件渲染之外的不同事件来执行查询，比如用户点击按钮？
`useLazyQuery` 钩子非常适合在除组件渲染之外的事件响应中执行查询。与 `useQuery` 不同，当您调用 `useLazyQuery` 时，它不会立即执行其关联的查询。相反，它在其结果元组中返回一个查询函数，您可以在准备好执行查询时调用该函数。

```tsx
import React from "react";
import { useLazyQuery } from "@apollo/client";

function DelayedQuery() {
  const [getDog, { loading, error, data }] = useLazyQuery(GET_DOG_PHOTO);

  if (loading) return <p>Loading ...</p>;
  if (error) return `Error! ${error}`;

  return (
    <div>
      {data?.dog && <img src={data.dog.displayImage} />}
      <button onClick={() => getDog({ variables: { breed: "bulldog" } })}>
        Click me!
      </button>
    </div>
  );
}
```

`useLazyQuery` 返回元组的第一项是查询函数，第二项是 `useQuery` 返回的相同结果对象。
如上所示，您可以像将它们传递给 `useLazyQuery` 本身一样，将选项传递给查询函数。如果您同时向两者传递一个特定选项，传递给查询函数的值优先。这是一种方便的方式，将默认选项传递给 `useLazyQuery`，然后在查询函数中自定义这些选项。

❗️ 注意

变量通过获取传递给钩子的变量并将它们与传递给查询函数的变量合并来合并。如果您没有向查询函数传递变量，则只在查询执行中使用传递给钩子的变量。

### 设置获取策略（fetching policy）

默认情况下，`useQuery` 钩子在执行时首先检查 `Apollo Client` 缓存，以查看您请求的所有数据是否已经在本地可用。如果所有数据都在本地可用，`useQuery` 返回这些数据，并且不会查询您的 `GraphQL` 服务器。这种 `cache-first` 策略是 `Apollo Client` 的默认获取策略。
您可以为给定查询指定不同的获取策略。要这样做，请在调用 `useQuery` 时包含 `fetchPolicy` 选项：

您可以为给定查询指定不同的获取策略。要这样做，请在调用 `useQuery` 时包含 `fetchPolicy` 选项：

```tsx
const { loading, error, data } = useQuery(GET_DOGS, {
  fetchPolicy: "network-only", // 不检查缓存就发送网络请求
});
```

`nextFetchPolicy` 自 3.1 起 您还可以指定查询的`nextFetchPolicy` 。如果您这样做，`fetchPolicy` 用于查询的第一次执行，`nextFetchPolicy` 用于确定如何响应以后的缓存更新：

```tsx
const { loading, error, data } = useQuery(GET_DOGS, {
  fetchPolicy: "network-only", // 用于第一次执行
  nextFetchPolicy: "cache-first", // 用于后续执行
});
```

例如，这在您希望查询始终先进行初始网络请求，但之后您满意从缓存中读取的情况下很有帮助。

`nextFetchPolicy` 函数 如果您希望通过默认应用单个 `nextFetchPolicy`，因为您发现自己手动为大多数查询提供 `nextFetchPolicy`，您可以在创建 `ApolloClient` 实例时配置 `defaultOptions.watchQuery.nextFetchPolicy`

```tsx
new ApolloClient({
  link,
  client,
  defaultOptions: {
    watchQuery: {
      nextFetchPolicy: "cache-only",
    },
  },
});
```

这种配置适用于所有 `client.watchQuery` 调用和未另行配置`nextFetchPolicy` 的 `useQuery` 调用。
如果您希望对 `nextFetchPolicy` 的行为有更多控制权，可以提供一个函数而不是 `WatchQueryFetchPolicy` 字符串：

```tsx
new ApolloClient({
  link,
  client,
  defaultOptions: {
    watchQuery: {
      nextFetchPolicy(currentFetchPolicy) {
        if (
          currentFetchPolicy === "network-only" ||
          currentFetchPolicy === "cache-and-network"
        ) {
          // 在第一次请求后将网络策略（除了"no-cache"）降级为"cache-first"
          return "cache-first";
        }
        // 保留所有其他获取策略不变。
        return currentFetchPolicy;
      },
    },
  },
});
```

这个 `nextFetchPolicy` 函数将在每次请求后调用，并使用 `currentFetchPolicy` 参数来决定如何修改获取策略。
除了每次请求后调用外，当变量更改时也会调用您的 `nextFetchPolicy` 函数，这通常会将 `options.fetchPolicy` 重置为其初始值，这对于触发以 `cache-and-network` 或 `network-only` 获取策略开始的查询的新网络请求很重要。
要拦截并处理变量更改的情况，您可以使用作为第二参数传递给 `nextFetchPolicy` 函数的 `NextFetchPolicyContext` 对象：

```tsx
new ApolloClient({
  link,
  client,
  defaultOptions: {
    watchQuery: {
      nextFetchPolicy(
        currentFetchPolicy,
        {
          // 为"after-fetch"或"variables-changed"，表示为何调用`nextFetchPolicy`函数。
          reason,
          // 其余选项（currentFetchPolicy === options.fetchPolicy）。
          options,
          // `options.fetchPolicy`首次应用`nextFetchPolicy`之前的原始值。
          initialPolicy,
          // 与此`client.watchQuery`调用关联的`ObservableQuery`。
          observable,
        }
      ) {
        // 当变量更改时，默认行为是将`options.fetchPolicy`重置为`context.initialPolicy`。如果省略这个逻辑，
        // 您的`nextFetchPolicy`函数可以覆盖此默认行为以防止`options.fetchPolicy`在这种情况下改变。
        if (reason === "variables-changed") {
          return initialPolicy;
        }

        if (
          currentFetchPolicy === "network-only" ||
          currentFetchPolicy === "cache-and-network"
        ) {
          // 在第一次请求后将网络策略（除了"no-cache"）降级为"cache-first"。
          return "cache-first";
        }

        // 保留所有其他获取策略不变。
        return currentFetchPolicy;
      },
    },
  },
});
```

为了调试这些 `nextFetchPolicy` 转换，向函数体中添加 `console.log` 或 `debugger` 语句会很有用，以了解何时以及为何调用该函数。

支持的获取策略：

`cache-first`

`Apollo Client` 首先对缓存执行查询。如果所有请求的数据都在缓存中，该数据被返回。否则， `Apollo Client` 会对 `GraphQL` 服务器执行查询，并在缓存它之后返回该数据。
优先考虑最小化您的应用程序发送的网络请求数量。
这是默认的获取策略。

`cache-only`

`Apollo Client` 只对缓存执行查询。在这种情况下，它从不查询服务器。
如果缓存不包含所有请求字段的数据，则只有缓存查询会抛出错误。

`cache-and-network`

`Apollo Client` 对缓存和 `GraphQL` 服务器同时执行完整查询。如果服务器端查询的结果修改了缓存字段，查询会自动更新。
在提供快速响应的同时，也有助于保持缓存数据与服务器数据一致。

`network-only`

`Apollo Client` 不检查缓存，而是直接对 `GraphQL` 服务器执行完整查询。查询结果存储在缓存中。

优先考虑与服务器数据的一致性，但无法在缓存数据可用时提供几乎即时的响应。

`no-cache` 与 `network-only` 类似，但查询结果不存储在缓存中。

`standby` 使用与 `cache-first` 相同的逻辑，除了该查询不会在底层字段值更改时自动更新。您仍然可以通过 `refetch` 和 `updateQueries` 手动更新此查询。
