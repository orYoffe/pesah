import { database } from './firebase'

export const pageView = (pageName, eventData) => {
    window.gtag(
        'event',
        'page_view',
        {
            date: new Date().toJSON(),
            url: window.location.href
        }
    )
    window.FB && window.FB.AppEvents.logPageView();
    if (pageName || eventData) {
        sendPageEvent(pageName, eventData)
    }
}

const generateBaseEvent = () => ({ time: new Date().toJSON(), url: window.location.href })

export const sendPageEvent = (pageName, eventData) => {
    const data = generateBaseEvent()
    if (eventData) {
        if (eventData.user) {
            data.user = eventData.user
        }
        if (eventData.page) {
            data.eventData = { pageId: eventData.page, pageName }
            if (pageName) {
                const analytics = database().ref(`analytics/${pageName}/${eventData.page}`).push()
                analytics.set(data)
                .then(newMessage => {
                }).catch(x => {
                    if (x.code === 'PERMISSION_DENIED') {
                        console.error('An error accurd and your message wasn\'t sent')
                    }
                })
            }
        }
        if (eventData.user) {
            const analytics = database().ref(`analytics/${eventData.user}`).push()
            analytics.set(data)
            .then(newMessage => {
            }).catch(x => {
                if (x.code === 'PERMISSION_DENIED') {
                    console.error('An error accurd and your message wasn\'t sent')
                }
            })
            const analytics2 = database().ref(`analytics/${eventData.page}`).push()
            analytics2.set(data)
            .then(newMessage => {
            }).catch(x => {
                if (x.code === 'PERMISSION_DENIED') {
                    console.error('An error accurd and your message wasn\'t sent')
                }
            })
        }

    }

    if (pageName) {
        const analytics = database().ref(`analytics/${pageName}`).push()
        analytics.set(data)
        .then(newMessage => {
        }).catch(x => {
          if (x.code === 'PERMISSION_DENIED') {
            console.error('An error accurd and your message wasn\'t sent')
          }
        })
    }
}

export const sendAudioEvent = (pageName, eventData) => {
    const data = generateBaseEvent()
    if (eventData && eventData.audio) {
        data.audio = eventData.audio
        if (eventData.userId) {
            data.userId = eventData.userId
        }

        if (eventData.page) {
            data.eventData = { pageId: eventData.page, pageName }
            const analytics = database().ref(`analytics/${eventData.page}/audio/${eventData.audio}`).push()
            analytics.set(data)
            .then(newMessage => {
            }).catch(x => {
                if (x.code === 'PERMISSION_DENIED') {
                    console.error('An error accurd and your message wasn\'t sent')
                }
            })
        }
        if (eventData.userId && eventData.audio === 'play') {
            const analytics = database().ref(`analytics/${eventData.userId}/listened`).push()
            analytics.set(data)
            .then(newMessage => {
            }).catch(x => {
                if (x.code === 'PERMISSION_DENIED') {
                    console.error('An error accurd and your message wasn\'t sent')
                }
            })
        }
    }
}


// type AnalyticsObject {
//   time: String,
//   event: String,
//   url: String,
//   eventData: Object | Null
//   user: String | Null
// }


export default {
    pageView
}
