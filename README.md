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

11/30(火)
上記のREADMEの設定に加えて、 ここからハンズオン1
完成系はqueryブランチ

参考URL
https://zenn.dev/mrsung/articles/0c27b767060fec#graphql-%E3%82%AF%E3%82%A8%E3%83%AA%E3%81%AE%E8%BF%BD%E5%8A%A0

12/7(火)
ここからハンズオン2
完成はsubscriptionブランチ

参考URL
https://qiita.com/HorikawaTokiya/items/31c3500a58bcc4285253

12/14(火)
次はFirebaseAuthを組み合わせて、認証周り
https://qiita.com/HorikawaTokiya/items/31c3500a58bcc4285253

