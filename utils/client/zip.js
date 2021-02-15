/**
 * Takes in a variable number of arrays, and "zips" them together
 * into tuples based on their index
 * ex. [1, 2, 3], [4, 5, 6] -> [[1, 4], [2, 5], [3, 6]]
 * @param {...any} rows Arrays that should be zipped into tuples
 * @return Array.<Array.<any>> An array of tuples zipped from the given rows
 */
export default function zip(...rows) {
  return [...rows[0]].map((_, c) => rows.map((row) => row[c]))
}
