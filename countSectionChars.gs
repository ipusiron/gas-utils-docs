function countSectionChars() {
  const body = DocumentApp.getActiveDocument().getBody();

  let i = 0;
  while (i < body.getNumChildren()) {
    const element = body.getChild(i);

    if (
      element.getType() === DocumentApp.ElementType.PARAGRAPH &&
      [DocumentApp.ParagraphHeading.HEADING1,
       DocumentApp.ParagraphHeading.HEADING2,
       DocumentApp.ParagraphHeading.HEADING3].includes(element.asParagraph().getHeading())
    ) {
      const headingPara = element.asParagraph();
      const headingLevel = headingPara.getHeading();

      // 見出し自体の文字数もカウント
      let blockCharCount = headingPara.getText().replace(/\n/g, '').length;

      let j = i + 1;

      while (j < body.getNumChildren()) {
        const nextElem = body.getChild(j);
        const nextType = nextElem.getType();

        if (
          nextType === DocumentApp.ElementType.PARAGRAPH &&
          [DocumentApp.ParagraphHeading.HEADING1,
           DocumentApp.ParagraphHeading.HEADING2,
           DocumentApp.ParagraphHeading.HEADING3].includes(nextElem.asParagraph().getHeading())
        ) {
          break;
        }

        if (
          nextType === DocumentApp.ElementType.PARAGRAPH ||
          nextType === DocumentApp.ElementType.LIST_ITEM
        ) {
          const text = nextElem.getText().replace(/\n/g, '');
          blockCharCount += text.length;
        }

        j++;
      }

      // 見出し1 でも本文がなければ注記スキップしない（見出し含むので0文字にはならない）
      const expectedText = `（このセクション：${blockCharCount}文字）`;

      const nextIndex = i + 1;
      const nextExists = nextIndex < body.getNumChildren();
      const nextPara = nextExists ? body.getChild(nextIndex) : null;

      if (
        nextExists &&
        nextPara.getText().trim().match(/^（このセクション：\d+文字）$/)
      ) {
        if (nextPara.getText().trim() !== expectedText) {
          nextPara.setText(expectedText);
          nextPara.setForegroundColor('#888888');
          nextPara.setFontSize(9);
          nextPara.setAlignment(DocumentApp.HorizontalAlignment.RIGHT);
        }
        i = j;
      } else {
        const inserted = body.insertParagraph(nextIndex, expectedText);
        inserted.setForegroundColor('#888888');
        inserted.setFontSize(9);
        inserted.setAlignment(DocumentApp.HorizontalAlignment.RIGHT);
        i = j + 1;
      }
    } else {
      i++;
    }
  }
}

function clearSectionChars() {
  const body = DocumentApp.getActiveDocument().getBody();
  const paragraphs = body.getParagraphs();

  for (let i = paragraphs.length - 1; i >= 0; i--) {
    const para = paragraphs[i];
    const text = para.getText().trim();

    // 「（このセクション：○○文字）」の形式に完全一致する段落を削除
    if (text.match(/^（このセクション：\d+文字）$/)) {
      body.removeChild(para);
    }
  }
}

