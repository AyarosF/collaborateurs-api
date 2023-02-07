const monthsFr = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"]

const getBirthdate = (date) => {
  const birthdate = new Date(date)
  return `${birthdate.getDate()} ${monthsFr[birthdate.getMonth()].toLowerCase()}`
}

const getAge = (date) => {
  var today = new Date()
  var birthdate = new Date(date)

  var ecartTimestamp = today - birthdate.getTime()
  var ageDate = new Date(ecartTimestamp)

  return Math.abs(ageDate.getUTCFullYear() - 1970)
}

export default { getBirthdate, getAge }