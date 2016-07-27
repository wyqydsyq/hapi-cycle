export default (req, res) => {
	const Users = req.server.collections().users

	Users.create([{
		email: req.payload.email,
		password: req.payload.password,
	}]).then(user => res(user))
}
