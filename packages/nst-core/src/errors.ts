

const ERRORS: Record<string, string> = {
    'unknown': 'Unknown error. Check that generateError is invoked with an error code and that the error code exists. ',
    'initial_state_bad_type': 'The argument `initialState` must be an object or a StoreInitializer function. ',
    'options_bad_type': 'The argument `options` must be an object. '
}
export default ERRORS