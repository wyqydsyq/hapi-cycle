function classes (...args) {
  return args.reduce((acc, x) => {
    acc[x] = true
    return acc
  }, {})
}

export default classes;
