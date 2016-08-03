import {div, h1, p, strong, pre, code, hr, img, button} from '@cycle/dom'
import xs from 'xstream'
import classes from 'classes'
import action from 'action'
import normalizeHTTPErrors from 'normalizeHTTPErrors'
import Collection from '@cycle/collection';

import UserProfile from 'components/user-list-profile'

function UserList (sources) {

	let getUsers = {
			url: `http://${HOST}/api/users`,
			category: 'user',
			method: 'GET'
		},

		// normalize incoming user responses
		userResponse$ = sources.HTTP.select('user')
			.map(normalizeHTTPErrors)
			.flatten(),

		// response from getting user list
		users$ = userResponse$
			.filter(res => res.request.method == 'GET')
			.map(res => res.body.map(user => ({
				id: user.id,
				user$: user
			})
		)),

		userProfiles$ = Collection.gather(UserProfile, sources, users$)

	return {
		DOM: Collection.pluck(userProfiles$, profile => profile.DOM).map(profiles => {
				if (!profiles.length) {
					return div('Your ORM doesn\'t have any users yet.')
				} else {
					return div([
						p('Your ORM has the following users:'),
						div('.userList', profiles)
					])
				}
			}),
		HTTP: xs.merge(
			xs.of(getUsers),

			Collection.merge(userProfiles$, user => user.HTTP),

			// actions that trigger refreshes
			xs.merge(sources.refresh$, Collection.merge(userProfiles$, user => user.removed$)).mapTo(getUsers)
		)
	}
}

export default UserList
