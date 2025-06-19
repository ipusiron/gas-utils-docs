function exportIndentedHeadingsToNewDocument() {
  const srcDoc = DocumentApp.getActiveDocument(); // 現在開いているドキュメント
  const body = srcDoc.getBody();
  const paragraphs = body.getParagraphs();

  // 見出しタイプごとの全角スペースによるインデント設定
  const indentMap = {
    HEADING1: "",
    HEADING2: "　",
    HEADING3: "　　",
    HEADING4: "　　　",
    HEADING5: "　　　　",
    HEADING6: "　　　　　",
  };

  // 新しいドキュメントを作成
  const newDoc = DocumentApp.create("見出しインデント付き一覧");
  const newBody = newDoc.getBody();

  // ヘッダー
  newBody.appendParagraph("見出し一覧").setHeading(DocumentApp.ParagraphHeading.HEADING1);
  newBody.appendParagraph(""); // 空行

  // 元ドキュメントから見出しを抽出して整形
  for (let i = 0; i < paragraphs.length; i++) {
    const p = paragraphs[i];
    const headingType = p.getHeading();
    if (headingType !== DocumentApp.ParagraphHeading.NORMAL) {
      const headingKey = headingType.toString();  // 例: HEADING2
      const indent = indentMap[headingKey] || "";
      const text = indent + p.getText();
      newBody.appendParagraph(text).setHeading(DocumentApp.ParagraphHeading.NORMAL);
    }
  }

  Logger.log("新しいドキュメントのURL: " + newDoc.getUrl());
}
