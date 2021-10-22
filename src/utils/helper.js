// subtract dates to get difference in days
// day in miliseconds
const dayms = 86400000

const subtractDate = function(date1, date2){
    date1 = new Date(date1)
    date2 = new Date(date2)
    const date1Inms = date1.getTime()
    const date2Inms = date2.getTime()
    const total = date2Inms - date1Inms
    console.log(` total = ${total}`)
    const days = Math.round(total/dayms)
    return days
}

// add days to date

const addDaysToDate = function(date1, days){
    date1 = new Date(date1)
    const date1Inms = date1.getTime()
    const dayInms = days*dayms
    const add = new Date(dayInms + date1Inms)
    return new Date(add)
}


function UserException(message) {
    this.message = message;
    this.name = 'UserException';
  }

// add date to convert into desired format 
const formatDate = function(date, format){

    if(format == "YY-MM-DD"){
    const year = date.getFullYear()
    const month = (date.getMonth()+1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    const newDate =  `${year}-${month}-${day}`
    return newDate
    }
    if(format == "YY-MM-DD HH:MM:SS"){
    const year = date.getFullYear()
    const month = (date.getMonth()+1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    const hour = date.getHours().toString().padStart(2, "0")
    const minute = date.getMinutes().toString().padStart(2, "0")
    const seconds = date.getSeconds().toString().padStart(2, "0")
    const newDate =  `${year}-${month}-${day} ${hour}:${minute}:${seconds}`
    return newDate
    }
    throw new UserException('Invalid Date. should be "YY-MM-DD" OR "YY-MM-DD HH:MM:SS"');
}

const isFutureDate = function (date) {
    let currentDate = new Date()
    currentDate= new Date(currentDate.getTime()-dayms)
    date = new Date(date)
    return (date < currentDate)?false:true
 };

const isPastDate = function (date) {
    let currentDate = new Date()
    currentDate= new currentDate(today.getTime()-dayms)
    date = new Date(date)
    return (date > currentDate)?false:true
 };

module.exports = {
    subtractDate,
    addDaysToDate,
    formatDate,
    isFutureDate,
    isPastDate
}