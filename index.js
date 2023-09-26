/**
 * @typedef {Object} state_object
 * @property {*} value - The initial value
 * @property {Function} set - Function to set the state value.
 * @property {Function} update - Function to update the state value using a callback.
 * @property {Function} subscribe - Function to subscribe to state changes.
 * @property {Function} get - Function to get the current state value.
 * @property {Function} reset - Function to reset the state value to its initial value.
 * @property {*} value - The current state value.
 * @param {any} init_value - The initial value of the state.
 **/
export function State(init_value) {
		let value = init_value;
    let subscribe_functions = [];

    function set(new_value) {
        let old_value = value;
        value = new_value;
        subscribe_functions.forEach((func) => func(new_value, old_value));
    }

    function update(callback) {
        set(callback(value));
    }

    function subscribe(callback, immediate = true) {
        subscribe_functions.push(callback);
        if (immediate) {
            callback(value);
        }

        return function () {
            subscribe_functions = subscribe_functions.filter(() => func !== callback);
        };
    }

    function get() {
        return value;
    }

    function reset() {
        set(init_value);
    }

    return {
        set,
        update,
        subscribe,
        get,
        reset,
        get value() {
            return value;
        },
        set value(new_value) {
            set(new_value);
        },
    };
}

export function watch_spates(state_objects, callback) {
    const new_state_values = state_objects.map((state) => state.get());
    let old_state_values = [...new_state_values]; // Copy initial state values

    const unsubscribe_functions = state_objects.map((state, index) =>
        state.subscribe((new_value, old_value) => {
            old_state_values = [...new_state_values];
            new_state_values[index] = new_value;
            callback(new_state_values, old_state_values);
        }, false)
    );

    return function () {
        unsubscribe_functions.forEach((unsubscribe) => unsubscribe());
    };
}

