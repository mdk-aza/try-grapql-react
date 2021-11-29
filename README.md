HasuraをDockerコンテナで起動
```
docker-compose up
```
以下でhasuraコンテナにアクセスできる。
http://localhost:8080/console

http://localhost:8080/console/data/manage/connect
上記のURLでデータベース接続ができるようになる。

Database Display Name
適当な名前

Database URL
postgres://postgres:postgrespassword@postgres:5432/postgres


以下のテーブルをまずは作って見ましょう。
value	type	default value
id	UUID	gen_random_uuid()
text	text
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


dockerがすぐに起動できない人はCloud版のHasuraを使う。
https://zenn.dev/mrsung/articles/75cac31621bb6e

以下、React側でトライするサンプル
https://zenn.dev/mrsung/articles/0c27b767060fec