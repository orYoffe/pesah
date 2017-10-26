const SET_ROOM_ID = 'SET_ROOM_ID'
export const setRoom = (roomId) => ({
    type: SET_ROOM_ID,
    roomId
})
const initialState = {
    currentRoomId: false,
}

export default (state = initialState, action) => {
    switch (action.type) {
        case 'SET_ROOM_ID':
            return {
                ...state,
                currentRoomId: action.roomId,
            }
        default:
            return state
    }
}
