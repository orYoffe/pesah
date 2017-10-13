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