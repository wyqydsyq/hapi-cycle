export default (req, res) => {
	const Users = req.server.collections().users

	Users.destroy({id: req.payload.id}).then(users => {
		return res(users)
	})
}
