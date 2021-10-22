const subtractDate = function(date1, date2){
    const date1Inms = date1.getTime()
    const date2Inms = date2.getTime()
    const days = (date2Inms - date1Inms)/(1000*3600*24)
    return days
}

// rename to addDays
const addDate = function(date1, days){
    const date1Inms = date1.getTime()
    const dayInms = days*86400000
    const add = new Date(dayInms + date1Inms)
    return new Date(add)
}

const formatDateYMD = function(date){
    const year = date.getFullYear()
    const month = (date.getMonth()+1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    const newDate =  `${year}-${month}-${day}`
    return newDate
}

const formatDateYMDHMS = function(date){
    const year = date.getFullYear()
    const month = (date.getMonth()+1).toString().padStart(2, "0")
    const day = date.getDate().toString().padStart(2, "0")
    const hour = date.getHours().toString().padStart(2, "0")
    const minute = date.getMinutes().toString().padStart(2, "0")
    const seconds = date.getSeconds().toString().padStart(2, "0")
    const newDate =  `${year}-${month}-${day} ${hour}:${minute}:${seconds}`
    return newDate
}

module.exports = {
    subtractDate,
    addDate,
    formatDateYMD,
    formatDateYMDHMS
}