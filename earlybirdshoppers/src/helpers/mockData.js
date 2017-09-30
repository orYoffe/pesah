export const events = [
    {
        name: "best event ever",
        location: "Tel Aviv, Buxa",
        price: 50,
        artists: [1],
        venues: [1],
        date: "2017-09-30T15:56:49.647Z",
        id: 1,
    },
    {
        name: "almost best event ever",
        location: "Tel Aviv, Levontin",
        price: 57,
        artists: [2],
        venues: [2],
        date: "2017-09-30T15:58:10.792Z",
        id: 2,
    },
]

export const artists = [
    {
        name: "Best Band",
        location: "Tel Aviv",
        events: [1],
        id: 1,
    },
    {
        name: "almost Best Band",
        location: "Tel Aviv",
        events: [2],
        id: 2,
    },
]

export const venues = [
    {
        name: "Buxa",
        location: "Tel Aviv, Name of street",
        openDates: [1,2,13],
        events: [2],
        id: 1,
    },
    {
        name: "Levontin",
        location: "Tel Aviv, Name of street",
        openDates: [1, 2, 13],
        events: [2],
        id: 2,
    },
]
