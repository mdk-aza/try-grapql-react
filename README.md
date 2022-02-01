HasuraをDockerコンテナで起動
```
docker-compose up
```

Web側の実装に必要なので、ライブラリもインストールしておく
```
yarn install
```

以下でhasuraコンテナにアクセスできる。
http://localhost:8080/console

以下を求められるので、
HASURA_GRAPHQL_ADMIN_SECRET=「myadminsecretkey」を入力。

http://localhost:8080/console/data/manage/connect
上記のURLでデータベース接続ができるようになる。

Database Display Name
適当な名前

Database URL
postgres://postgres:postgrespassword@postgres:5432/postgres

最後にconnect databaseボタンを押す

以下のテーブルをまずは作って見ましょう。
テーブル名 todos

value	type	default value
id	UUID	gen_random_uuid()
text	Text
done	boolean	false

以下のクエリを実行できるかを確認。
```
query getTodos {
 todos {
   id
   text
   done
  }
}
```

```
# GraphiQL上で実行するクエリの一例
mutation addTodo {
  insert_todos(objects: { text: "apple" }) {
    returning {
      done
      id
      text
    }
  }
}

# 変数で書く場合
mutation addTodo($text: String!) {
  insert_todos(objects: { text: $text }) {
    returning {
      done
      id
      text
    }
  }
}
```

dockerがすぐに起動できない人はCloud版のHasuraを使う。
https://zenn.dev/mrsung/articles/75cac31621bb6e

以下、React側でトライするサンプル
https://zenn.dev/mrsung/articles/0c27b767060fec

ここからハンズオン。
https://zenn.dev/mrsung/articles/0c27b767060fec#graphql-%E3%82%AF%E3%82%A8%E3%83%AA%E3%81%AE%E8%BF%BD%E5%8A%A0


JWT 
https://hasura.io/jwt-config/

FirebaseProjectを作成し、ここでprojectIDを入れてJWT Configを生成し、docker-compose.yamlに環境変数の追加を行う
JWT_SECRET:  '{"type":"RS256","jwk_url": "https://www.googleapis.com/service_accounts/v1/jwk/erviceaccount.com", "audience": "hasura-examfc", "issuer": "https://securetoken.gora-example-1d0fc"}"'
↑参考なので、一部文字列変更などを行っている


Firebase-cliのインストールを行う
https://hawksnowlog.blogspot.com/2021/12/how-to-install-firebase-cli-into-macos.html