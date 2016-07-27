export default (req, res) => {
	const Users = req.server.collections().users

	Users.find().then(users => {
		return res(users)
	})
}
