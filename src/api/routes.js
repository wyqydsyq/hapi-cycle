export default [
	{
		method: 'POST',
		path: '/users',
		handler: 'users/create'
	},
	{
		method: 'GET',
		path: '/users',
		handler: 'users/show'
	},
	{
		method: 'DELETE',
		path: '/users',
		handler: 'users/delete'
	}
]
