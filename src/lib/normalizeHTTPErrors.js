export default res$ => res$.replaceError(error => {
	let res = error.res || {body: error, request: {method: null}}
	res.error = true
	return xs.of(res)
})
