/**
 * countSectionChars.gsのテスト用スクリプト
 * 
 * 使用方法：
 * 1. このファイルをGASプロジェクトに追加
 * 2. testCountSectionChars()を実行してテスト実行
 * 3. 実行ログとGoogle Docsの両方で結果を確認
 */

/**
 * テスト用：サンプルドキュメント構造を作成してcountSectionChars()をテスト
 *
 * 処理内容：
 * - 既存の文書内容をクリア
 * - H1〜H3の見出しと本文を含むテストドキュメントを作成
 * - countSectionChars()を実行
 * - 結果をログ出力で確認
 *
 * 注意：既存のドキュメント内容は削除されます
 */
function testCountSectionChars() {
  const doc = DocumentApp.getActiveDocument();
  const body = doc.getBody();
  
  // 既存内容をクリア
  body.clear();
  
  console.log('=== テストドキュメント作成開始 ===');
  
  // テストドキュメント構造を作成
  TestHelper.createTestDocument(body);
  
  console.log('=== countSectionChars実行前の状態 ===');
  TestHelper.logDocumentStructure(body);
  
  // countSectionCharsを実行
  console.log('=== countSectionChars実行 ===');
  countSectionChars();
  
  console.log('=== countSectionChars実行後の状態 ===');
  TestHelper.logDocumentStructure(body);
  
  console.log('=== テスト完了 ===');
  console.log('Google Docsを確認して、各セクションに文字数注記が追加されているかチェックしてください。');
}

/**
 * テスト用：clearSectionChars()の動作確認
 * 
 * 注記削除機能のテスト用。testCountSectionChars()実行後に使用。
 */
function testClearSectionChars() {
  console.log('=== clearSectionChars実行前の状態 ===');
  const body = DocumentApp.getActiveDocument().getBody();
  TestHelper.logDocumentStructure(body);
  
  console.log('=== clearSectionChars実行 ===');
  clearSectionChars();
  
  console.log('=== clearSectionChars実行後の状態 ===');
  TestHelper.logDocumentStructure(body);
  
  console.log('=== 削除テスト完了 ===');
  console.log('Google Docsを確認して、文字数注記がすべて削除されているかチェックしてください。');
}

/**
 * テスト用ヘルパー関数群
 */
const TestHelper = {
  /**
   * テスト用ドキュメント構造を作成
   */
  createTestDocument: function(body) {
    // H1セクション
    const h1 = body.appendParagraph('第1章 はじめに');
    h1.setHeading(DocumentApp.ParagraphHeading.HEADING1);
    body.appendParagraph('これは第1章の内容です。このセクションには約50文字程度のテキストが含まれています。');
    
    // H2セクション
    const h2 = body.appendParagraph('1.1 概要');
    h2.setHeading(DocumentApp.ParagraphHeading.HEADING2);
    body.appendParagraph('概要セクションの説明文です。');
    body.appendParagraph('複数の段落を含むセクションのテストです。');
    
    // リストアイテムを含むセクション
    const listItem1 = body.appendListItem('リストアイテム1');
    const listItem2 = body.appendListItem('リストアイテム2');
    const listItem3 = body.appendListItem('リストアイテム3');
    
    // H3セクション
    const h3 = body.appendParagraph('1.1.1 詳細');
    h3.setHeading(DocumentApp.ParagraphHeading.HEADING3);
    body.appendParagraph('詳細セクションの内容。短いテキスト。');
    
    // 別のH1セクション
    const h1_2 = body.appendParagraph('第2章 応用編');
    h1_2.setHeading(DocumentApp.ParagraphHeading.HEADING1);
    body.appendParagraph('第2章では応用的な内容を扱います。ここにはより長いテキストが配置されており、文字数カウント機能の動作を確認するためのサンプル文章となっています。');
    
    console.log('テストドキュメント構造を作成しました');
    console.log('- H1セクション: 2個');
    console.log('- H2セクション: 1個');
    console.log('- H3セクション: 1個');
    console.log('- 通常段落: 5個');
    console.log('- リストアイテム: 3個');
  },
  
  /**
   * ドキュメント構造をログ出力
   */
  logDocumentStructure: function(body) {
    const numChildren = body.getNumChildren();
    console.log(`ドキュメント要素数: ${numChildren}`);
    
    let annotationCount = 0;
    for (let i = 0; i < numChildren; i++) {
      const element = body.getChild(i);
      const type = element.getType();
      const text = element.getText().replace(/\n/g, '').substring(0, 50);
      
      // 注記かどうかチェック
      const isAnnotation = text.match(/^（このセクション：\d+文字）$/);
      if (isAnnotation) annotationCount++;
      
      if (type === DocumentApp.ElementType.PARAGRAPH) {
        const heading = element.asParagraph().getHeading();
        const headingName = this.getHeadingName(heading);
        const annotationFlag = isAnnotation ? ' ★注記★' : '';
        console.log(`[${i}] ${type} ${headingName}: "${text}${text.length >= 50 ? '...' : ''}" (${element.getText().replace(/\n/g, '').length}文字)${annotationFlag}`);
      } else {
        console.log(`[${i}] ${type}: "${text}${text.length >= 50 ? '...' : ''}" (${element.getText().replace(/\n/g, '').length}文字)`);
      }
    }
    console.log(`文字数注記の数: ${annotationCount}`);
  },
  
  /**
   * 見出しタイプを文字列に変換
   */
  getHeadingName: function(heading) {
    switch (heading) {
      case DocumentApp.ParagraphHeading.HEADING1: return '(H1)';
      case DocumentApp.ParagraphHeading.HEADING2: return '(H2)';
      case DocumentApp.ParagraphHeading.HEADING3: return '(H3)';
      case DocumentApp.ParagraphHeading.NORMAL: return '(通常)';
      default: return '(その他)';
    }
  }
};
