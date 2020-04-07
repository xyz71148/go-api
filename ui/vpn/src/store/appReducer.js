export const namespace = "app";
const initialState = {
    loading:true,
    access_token:null,
    toastState: {
        text: "",
        loading: true,
        show:false
    },
    halfScreenDialogState:{
        show:false,
        height:"50vh",
        onClose:()=>{}
    },
    actionSheetState:{
        show:false,
        menus:[
            {
                label: 'label',
                onClick: ()=>{}
            }
        ],
        actions:[
            {
                label: 'label',
                onClick: ()=>{}
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

        case "app/showToast":
            return {
                ...state,
                toastState:{
                    show:true,
                    ...action.payload
                }
            };
        case "app/hideToast":
            return {
                ...state,
                toastState:{
                    show:false
                }
            };
        case "app/hideActionSheet":
            return {
                ...state,
                actionSheetState:{
                    show:false
                }
            };
        case "app/showActionSheet":
            return {
                ...state,
                actionSheetState:{
                    show:true,
                    ...action.payload
                }
            };
        case "app/hideHalfScreenDialog":
            return {
                ...state,
                halfScreenDialogState:{
                    show:false
                }
            };
        case "app/showHalfScreenDialog":
            return {
                ...state,
                halfScreenDialogState:{
                    show:true,
                    ...action.payload
                }
            };
        case "app/logged":
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
}
