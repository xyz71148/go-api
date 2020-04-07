export const namespace = "instance";
const initialState = {
  items: [],
  item:null,
  loading: false,
  error: null,
  showVipLines:false,
  selectedVipType:null,
  showVipLinesActionSheet:false
};

export default function defaultReducer(
  state = initialState,
  action
) {
  switch (action.type) {
    case "instance/setState":
      return {
        ...state,
        ...action.payload
      };
    default:
      return state;
  }
}
