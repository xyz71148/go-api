const initialState = {
    toastState: {
        text: "",
        loading: true,
        show:false
    },
    halfScreenDialogState:{
        show:false,
    },
    actionSheetState:{
        show:false,
        menus:[
            {
                label: 'Logout',
                onClick: undefined
            }
        ],
        actions:[
            {
                label: 'Setting',
                onClick: undefined
            }
        ]
    }
};

export default function defaultReducer(
    state = initialState,
    action
) {
    switch (action.type) {
        case "app/setState":
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
}
