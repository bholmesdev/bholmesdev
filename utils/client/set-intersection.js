export default (listA = [], listB = []) => {
  const setA = new Set(listA)
  const intersection = new Set(listB.filter((b) => setA.has(b)))
  return intersection
}
