export const events = [
    {
        name: "best event ever",
        location: "Tel Aviv, Buxa",
        price: 50,
        artists: [1],
        venues: [1],
        fundsRaised: 1000,
        goal: 3000,
        date: "2017-09-30T15:56:49.647Z",
        id: 1,
    },
    {
        name: "almost best event ever",
        location: "Tel Aviv, Levontin",
        price: 57,
        artists: [2],
        fundsRaised: 2500,
        goal: 3000,
        venues: [2],
        date: "2017-09-30T15:58:10.792Z",
        id: 2,
    },
]

export const artists = [
    {
        name: "Kiss",
        location: "Berlin",
        youtubeVideo: "https://www.youtube-nocookie.com/embed/5bLUUOhffsk",
        events: [1],
        id: 1,
    },
    {
        name: "Yudaya Gaijin",
        location: "Tel Aviv",
        bandcamp: "https://yudaya-gaijin.bandcamp.com/",
        bandcampText: "Yudaya Gaijin by Yudaya Gaijin",
        bandcampLink: "http://yudaya-gaijin.bandcamp.com/album/yudaya-gaijin",
        bandcampVideo: "https://bandcamp.com/EmbeddedPlayer/album=2698605111/size=large/bgcol=ffffff/linkcol=0687f5/tracklist=false/transparent=true/",
        // bandcampVideo: "https://bandcamp.com/EmbeddedPlayer/album=2698605111/size=large/bgcol=ffffff/linkcol=7137dc/transparent=true/", // example with tracklist
        youtubeVideo: "https://www.youtube.com/embed/ScSgMW4MzpU",
        events: [2],
        id: 2,
    },
]

export const venues = [
    {
        name: "Buxa",
        location: "Tel Aviv, Name of street",
        openDates: [1,2,13],
        events: [1],
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

export const fans = [
    {
        name: "Or",
        location: "Berlin, Name of street",
        events: [1],
        id: 1,
    },
    {
        name: "Sefi",
        location: "Tel Aviv, Name of street",
        events: [2],
        id: 2,
    },
]
