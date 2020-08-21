const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()


  return [year, month, day].map(formatNumber).join('-')
}

const filterNum= (num, bit) => {
  console.log(num, bit)
  if (bit == 5) {
    if (num > 99999) {
      num = "99999+"
    }
  } else if (bit == 9) {
    if (num > 999999999) {
      num = "999999999+"
    }
  }
  return num;
}

module.exports = {
  formatTime: formatTime,
  filterNum: filterNum,
  formatDate: formatDate
}
