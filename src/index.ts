function updateArtifactCategorize(): void {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet()
  const sheet = spreadsheet.getActiveSheet()

  const artifactSheet = spreadsheet.getSheetByName(ARTIFACT_SHEET_NAME)
  if (!artifactSheet) {
    SpreadsheetApp.getUi().alert(`${ARTIFACT_SHEET_NAME} が見つかりません。`)
    return
  }

  const artifactSheetContents = artifactSheet.getDataRange().getDisplayValues()

  const artifactSheetHeaders = artifactSheetContents[ARTIFACT_SHEET_HEADER_ROW - 1]
  const artifactSheetData = artifactSheetContents.slice(ARTIFACT_SHEET_DATA_ROW_START - 1)
  const artifactAttributes = artifactSheetData
    .map(row => Object.fromEntries(row.map((cell, i) => [artifactSheetHeaders[i], cell])))
    .filter(ARTIFACT_PRE_PREDICATE)

  const flattenSchema = (schema: Schema[]): ArtifactPredicate[] => schema.flatMap(([predicate, children]) =>
    children
      ? flattenSchema(children).map(childPredicate => (attr => predicate(attr) && childPredicate(attr)) satisfies ArtifactPredicate)
      : [predicate],
  )

  const categorizeMatrixRowPredicates = flattenSchema(CATEGORIZE_MATRIX_ROW_SCHEMA)
  const categorizeMatrixColPredicates = flattenSchema(CATEGORIZE_MATRIX_COL_SCHEMA)

  const categorizeMatrixRange = sheet.getRange(
    CATEGORIZE_SHEET_MATRIX_ROW_START,
    CATEGORIZE_SHEET_MATRIX_COL_START,
    categorizeMatrixRowPredicates.length,
    categorizeMatrixColPredicates.length,
  )

  const categorizeMatrix = categorizeMatrixRowPredicates.map(rowPredicate =>
    categorizeMatrixColPredicates.map(colPredicate =>
      artifactAttributes.filter(attr => rowPredicate(attr) && colPredicate(attr)).map(attr => `${`0000${attr["id"]}`.slice(-4)} ${attr["name"]}`),
    ),
  )

  categorizeMatrixRange.clearContent()
  categorizeMatrixRange.clearNote()

  categorizeMatrixRange.setValues(categorizeMatrix.map(row => row.map(col => col.length)))
  categorizeMatrixRange.setNumberFormat("0")
  categorizeMatrixRange.setNotes(categorizeMatrix.map(row => row.map(col => col.join("\n"))))

  const scriptButton = sheet.getRange(SCRIPT_BUTTON_LINE2_ROW, SCRIPT_BUTTON_LINE2_COL)
  const updateDateText = new Date().toLocaleString().slice("YYYY/".length)
  scriptButton.setValue(`(最終更新: ${updateDateText})`)
}
