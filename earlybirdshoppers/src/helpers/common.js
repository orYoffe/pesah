export const isDev = process.env.NODE_ENV !== 'production'

export const ifLessThanTen = num => num < 10 ? `0${num}` : num

export const stopPropogation = e => {
    if (e.keyCode === 13 || e.target.key === 'Enter') {
        e.stopPropagation()
        e.preventDefault()
    }
}

export function readFile(files, callback) {
  if (files && files[0]) {
    const FR = new FileReader();
    FR.addEventListener('load', callback); 
    FR.readAsDataURL( files[0] );
  }
}

export const howManyTickets = (price, goal) => {
  let numberOfTickets = goal / price
  if (numberOfTickets % 1 !== 0) {
    numberOfTickets++
  }
  return numberOfTickets
}

const defaultLocationPhotoOptions = {
  maxHeight: 100,
  maxWidth: 100,
}
export const getLocationImage = (location, photoOps) => {
  try {
    return location.photos[0].getUrl(photoOps ? photoOps : defaultLocationPhotoOptions)
  } catch (error) {
    return false
  }
}
export const getLocation = (location, photoOps) => {
  if (!location || !location.address_components || !location.formatted_address) {
    return false
  }
  let photo = null
  try {
    const country = location.address_components
    .find(prop => prop.types.indexOf('country') !== -1).long_name
    const countryShortName = location.address_components
    .find(prop => prop.types.indexOf('country') !== -1).short_name
    const city = location.address_components
    .find(prop => prop.types.indexOf('locality') !== -1).long_name
    const district = location.address_components
      .find(prop => prop.types.indexOf('administrative_area_level_1') !== -1).long_name
    const lat = location.geometry.location.lat()
    const lng = location.geometry.location.lng()
    try{
      photo = location.photos[0].getUrl(photoOps ? photoOps : defaultLocationPhotoOptions)
    } catch (err) { }

    if (!country || !countryShortName || !city) {
      return false
    }
    return {
      city,
      country,
      countryShortName,
      district,
      address: location.formatted_address,
      intphone: location.international_phone_number,
      phone: location.formatted_phone_number,
      name: location.name,
      icon: location.icon,
      photo,
      lat,
      lng,
      website: location.website,
    }
  } catch (error) {
    return false
  }
}

export const scrollToTop = () => window.scrollTo(0, 0)