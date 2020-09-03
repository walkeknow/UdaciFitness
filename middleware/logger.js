export default (store) => (next) => (action) => {
  console.group(action.type)
  const value = next(action)
  // console.log(store.getState())
  console.groupEnd()
  return value
}
