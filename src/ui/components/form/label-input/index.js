import {div, label, input} from '@cycle/dom'
import isolate from '@cycle/isolate'
import xs from 'xstream'
import classes from 'classes'

import styles from '../styles.less'

function LabelInput ({props$, state$}) {
	let vtree$ = xs.combine(props$, state$).map(([props, state]) => {
			let value = (typeof state.data[props.name] != 'undefined') ? state.data[props.name] : ''
			
			return div({class: classes(styles.field)}, [
				input('.label-input', {class: classes(styles.control), props: {type: props.type, name: props.name, id: props.name, value}}),
				label({class: {[styles.hide]: (typeof state.data[props.name] != 'undefined' && state.data[props.name].length)}, attrs: {for: props.name}}, [props.label])
			])
		});

	return {
		DOM: vtree$,
		props$
	}
}

export default sources => isolate(LabelInput)(sources)
