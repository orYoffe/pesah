export const pageView = () => {
    window.gtag(
        'event',
        'page_view',
        {
            date: new Date(),
            url: window.location.href
        }
    )

    window.FB && window.FB.AppEvents.logPageView();
}

export default {
    pageView
}
