export default (req, res) => {
	const Users = req.server.collections().users

	Users.destroy({email: req.payload.email}).then(users => {
		return res(users)
	})
}
