import {div, label, input} from '@cycle/dom';
import isolate from '@cycle/isolate';
import xs from 'xstream';
import classes from 'dependencies/classes';

import styles from '../form/styles.less';

function LabelInput ({props, props$ = xs.of(props), state}) {
	let vtree$ = props$.map(props => {
			return div({class: classes(styles.field)}, [
				input('.label-input', {class: classes(styles.control), props: {type: props.type, name: props.name, id: props.name}}),
				label({class: {[styles.hide]: (typeof state.data[props.name] != 'undefined' && state.data[props.name].length)}, attrs: {for: props.name}}, [props.label])
			])
		});

	return {
		DOM: vtree$,
		props$
	}
};

export default LabelInput;
