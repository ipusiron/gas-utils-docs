# GAS Utils for Google Docs

このリポジトリには、Googleドキュメントでの執筆時に個人的に活用している Google Apps Script（GAS）スクリプトを収録しています。

## スクリプト一覧

### `countSectionChars.gs`

現在開いているGoogleドキュメントにおいて、Heading 1～3 の見出しを起点に、それぞれのセクションの文字数をカウントし、注記として文中に挿入します。  
注記を削除する `clearSectionChars` 関数も含まれています。

詳しい仕様や使い方は、以下の記事をご参照ください：  
[**Googleドキュメントで「セクションごとの文字数」を自動で数える方法【GAS活用編】**](https://akademeia.info/?p=42130)

### exportHeadingsToNewDocument.gs

現在開いているGoogleドキュメントの「見出し」だけを階層インデント付きで抽出し、新しいGoogleドキュメントに出力します。
出力されたGoogleドキュメントのURLは、実行ログに表示されます。

## 使い方

1. Googleドキュメントに対象の文書を用意します。
2. Google Apps Script に本リポジトリ内のコードを貼り付けます。
3. スクリプトを実行し、注記が挿入されたことを確認します。

## ライセンス

MIT License
