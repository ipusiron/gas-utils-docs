/**
 * Google Docsのセクション文字数カウント機能
 *
 * H1-H3の見出しをセクション区切りとして、各セクションの文字数をカウントし、
 * 見出し直後に文字数注記を挿入または更新します。
 *
 * 処理内容：
 * - 見出し（H1, H2, H3）を検出し、次の見出しまでのテキストを1セクションとして扱う
 * - 見出し自体も文字数にカウントする
 * - 段落とリストアイテムのテキストを対象とし、改行文字は除外
 * - 既存の注記があれば更新、なければ新規挿入
 * - 注記形式：「（このセクション：○○文字）」
 * - 注記スタイル：9pt、グレー、右寄せ
 */
function countSectionChars() {
  const body = DocumentApp.getActiveDocument().getBody();
  const headingTypes = [
    DocumentApp.ParagraphHeading.HEADING1,
    DocumentApp.ParagraphHeading.HEADING2,
    DocumentApp.ParagraphHeading.HEADING3
  ];

  let i = 0;
  while (i < body.getNumChildren()) {
    const element = body.getChild(i);

    if (SectionHelper.isHeading(element, headingTypes)) {
      const headingPara = element.asParagraph();
      let sectionCharCount = headingPara.getText().replace(/\n/g, '').length;

      const sectionEndIndex = SectionHelper.findSectionEnd(body, i + 1, headingTypes);
      sectionCharCount += SectionHelper.countSectionText(body, i + 1, sectionEndIndex);

      const annotationText = `（このセクション：${sectionCharCount}文字）`;
      i = SectionHelper.insertOrUpdateAnnotation(body, i, sectionEndIndex, annotationText);
    } else {
      i++;
    }
  }
}

/**
 * セクション文字数注記削除機能
 *
 * countSectionChars()で挿入された文字数注記をすべて削除します。
 *
 * 処理内容：
 * - 文書内の全段落を逆順で走査（インデックス変更による問題を回避）
 * - 「（このセクション：○○文字）」の形式に完全一致する段落を検出
 * - 該当する段落を文書から削除
 *
 * 注意：正規表現による完全一致判定を行うため、形式が異なる場合は削除されません
 */
function clearSectionChars() {
  const body = DocumentApp.getActiveDocument().getBody();
  const paragraphs = body.getParagraphs();

  for (let i = paragraphs.length - 1; i >= 0; i--) {
    const para = paragraphs[i];
    const text = para.getText().trim();

    if (text.match(/^（このセクション：\d+文字）$/)) {
      body.removeChild(para);
    }
  }
}

/**
 * セクション処理のヘルパー関数群
 * オブジェクト内に定義することで関数一覧から除外
 */
const SectionHelper = {
  /**
   * 要素が見出しかどうかを判定
   */
  isHeading: function(element, headingTypes) {
    return element.getType() === DocumentApp.ElementType.PARAGRAPH &&
           headingTypes.includes(element.asParagraph().getHeading());
  },

  /**
   * セクションの終了位置を検索
   */
  findSectionEnd: function(body, startIndex, headingTypes) {
    for (let j = startIndex; j < body.getNumChildren(); j++) {
      const element = body.getChild(j);
      if (this.isHeading(element, headingTypes)) {
        return j;
      }
    }
    return body.getNumChildren();
  },

  /**
   * セクション内のテキスト文字数をカウント
   */
  countSectionText: function(body, startIndex, endIndex) {
    let charCount = 0;
    for (let j = startIndex; j < endIndex; j++) {
      const element = body.getChild(j);
      const elementType = element.getType();

      if (elementType === DocumentApp.ElementType.PARAGRAPH ||
          elementType === DocumentApp.ElementType.LIST_ITEM) {
        const text = element.getText().replace(/\n/g, '');
        charCount += text.length;
      }
    }
    return charCount;
  },

  /**
   * 注記を挿入または更新
   */
  insertOrUpdateAnnotation: function(body, headingIndex, sectionEndIndex, annotationText) {
    const annotationIndex = headingIndex + 1;
    const annotationExists = annotationIndex < body.getNumChildren();

    if (annotationExists) {
      const nextElement = body.getChild(annotationIndex);
      const existingText = nextElement.getText().trim();

      if (existingText.match(/^（このセクション：\d+文字）$/)) {
        if (existingText !== annotationText) {
          this.updateAnnotationStyle(nextElement, annotationText);
        }
        return sectionEndIndex;
      }
    }

    const inserted = body.insertParagraph(annotationIndex, annotationText);
    this.updateAnnotationStyle(inserted, annotationText);
    return sectionEndIndex + 1;
  },

  /**
   * 注記のスタイルを設定
   */
  updateAnnotationStyle: function(paragraph, text) {
    paragraph.setText(text);
    paragraph.setForegroundColor('#888888');
    paragraph.setFontSize(9);
    paragraph.setAlignment(DocumentApp.HorizontalAlignment.RIGHT);
  }
};
