import computedStyle from 'computed-style'

export let animationStart = 'animationstart webkitAnimationStart oanimationstart MSAnimationStart'
export let animationTick = 'animationiteration webkitAnimationIteration oanimationiteration MSAnimationIteration'
export let animationEnd = 'animationend webkitAnimationEnd oanimationend MSAnimationEnd'

export function transitionHeight (old, vnode) {
	let oldChildren = Array.from(old.children),
		newChildren = Array.from(vnode.children)

	// an item is being added
	if (oldChildren.length < newChildren.length) {
		vnode.elm.style.transitionDelay = '.25s'
		newChildren.forEach(child => {
			child.elm.style.animationDelay = '.75s'
			child.elm.style.transitionProperty = 'height, margin'
			child.elm.style.transitionDuration = '.5s'
		})
	}

	// an item is being removed
	else if (oldChildren.length > newChildren.length) {
		vnode.elm.style.transitionDelay = '.75s'
		oldChildren.forEach(child => {
			child.elm.style.animationDelay = '.25s'
			child.elm.style.transitionProperty = 'height, margin'
			child.elm.style.transitionDuration = '.5s'
		})
	}

	vnode.elm.style.height = newChildren.reduce((acc, child) =>
		Number.parseInt(acc)
		+ Number.parseInt(computedStyle(child.elm, 'height'))
		+ Number.parseInt(computedStyle(child.elm, 'marginTop'))
		+ Number.parseInt(computedStyle(child.elm, 'marginBottom'))
	, 0) + 'px'
}
