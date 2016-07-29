function action (type, data = {}) {
	return {
		type,
		effect: data
	}
}
export default action
