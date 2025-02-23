// + - C O L - >
// |
// R
// O
// W
// |
// v

const ARTIFACT_SHEET_NAME = "神器"

const ARTIFACT_SHEET_HEADER_ROW: number = 2
const ARTIFACT_SHEET_DATA_ROW_START: number = 5

const ARTIFACT_PREDICATE_CREATED_ONLY: ArtifactPredicate =
  attr => attr["status"] === "作成済" && attr["is_set"] == "FALSE"
const ARTIFACT_PREDICATE_INCLUDE_MAKING: ArtifactPredicate =
  attr => (attr["status"] === "作成済" || attr["status"] === "作成中") && attr["is_set"] == "FALSE"

const SCRIPT_BUTTON_LINE2_ROW: number = 3
const SCRIPT_BUTTON_LINE2_COL: number = 1

const CATEGORIZE_SHEET_MATRIX_ROW_START: number = 5
const CATEGORIZE_SHEET_MATRIX_COL_START: number = 6

const CATEGORIZE_MATRIX_ROW_SCHEMA: Schema[] = (() => {
  const damageTypes2 = ["none", "fire", "water", "thunder"]
  const dim1 = [
    [attr => damageTypes2.some(s => attr[`type_${s}`] === "TRUE")] satisfies Schema,
    ...damageTypes2.map(s => [attr => attr[`type_${s}`] === "TRUE"] satisfies Schema),
  ]

  const damageTypes1 = ["physical", "magic"]
  const dim2 = [
    [attr => damageTypes1.some(s => attr[`type_${s}`] === "TRUE")] satisfies Schema,
    ...damageTypes1.map(s => [attr => attr[`type_${s}`] === "TRUE", dim1] satisfies Schema),
    [attr => damageTypes1.every(s => attr[`type_${s}`] === "FALSE")] satisfies Schema,
  ]

  const categories = ["レベル1", "レベル2", "レベル3", "レベル4", "チェスト", "MOBドロップ", "取引"]
  const dim3 = [
    [attr => categories.some(s => attr["category"] === s)] satisfies Schema,
    ...categories.map(s => [attr => attr["category"] === s, dim2] satisfies Schema),
  ]

  return dim3
})()

const CATEGORIZE_MATRIX_COL_SCHEMA: Schema[] = (() => {
  const gods = ["flora", "urban", "nyaptov", "wiki", "rumor"]
  const dim1 = [
    [attr => gods.some(s => attr[`can_use_${s}`] === "TRUE")] satisfies Schema,
    ...gods.map(s => [attr => attr[`can_use_${s}`] === "TRUE"] satisfies Schema),
  ]

  const rangeTypes = [["1"], ["2", "3", "4"], ["0"]]
  const dim2 = [
    [attr => rangeTypes.some(rangeType => rangeType.includes(attr["range_type"]))] satisfies Schema,
    ...rangeTypes.map(rangeType => [attr => rangeType.includes(attr["range_type"]), dim1] satisfies Schema),
  ]

  const artifactTypes = ["weak", "strong"]
  const dim3 = [
    [attr => artifactTypes.some(s => attr[`is_${s}_artifact`] === "TRUE")] satisfies Schema,
    ...artifactTypes.map(s => [attr => attr[`is_${s}_artifact`] === "TRUE", dim2] satisfies Schema),
    [attr => artifactTypes.every(s => attr[`is_${s}_artifact`] === "FALSE"), dim2] satisfies Schema,
  ]

  const cooldownTypes = ["1", "2", "3", "4", "0"]
  return [
    [attr => cooldownTypes.some(s => attr["cooldown_type"] === s)] satisfies Schema,
    [attr => attr["cooldown_type"] === "1", dim3],
    [attr => attr["cooldown_type"] === "2", dim3],
    [attr => attr["cooldown_type"] === "3", dim1],
    [attr => attr["cooldown_type"] === "4", dim1],
    [attr => attr["cooldown_type"] === "0", dim1],
  ]
})()
