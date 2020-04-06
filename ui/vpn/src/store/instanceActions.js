import axios from "axios";

export function fetchInstances() {
    return dispatch => {
        dispatch(fetchInstancesBegin());
        return axios.get("/compute/list")
            .then(json => {
                debugger
                dispatch(fetchInstancesSuccess(json.data.body));
                return json.data.body;
            })
            .catch(error => {
                    debugger
                    dispatch(fetchInstancesFailure(error))
                }
            );
    };
}

// Handle HTTP errors since fetch won't.
// function handleErrors(response) {
//   if (!response.ok) {
//     throw Error(response.statusText);
//   }
//   return response;
// }

export const FETCH_BEGIN = "FETCH_BEGIN";
export const FETCH_SUCCESS =
    "FETCH_SUCCESS";
export const FETCH_FAILURE =
    "FETCH_FAILURE";

export const fetchInstancesBegin = () => ({
    type: FETCH_BEGIN
});

export const fetchInstancesSuccess = items => ({
    type: FETCH_SUCCESS,
    payload: {items}
});

export const fetchInstancesFailure = error => ({
    type: FETCH_FAILURE,
    payload: {error}
});
