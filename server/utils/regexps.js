const regexps = {
  email: /^[\.a-zA-Z_-\d]+@[a-zA-Z_-\d\.]+?\.[a-zA-Z]{2,5}$/,
  handlername: /^[a-zA-Z\/\d_]+$/,
  url: /^https?:\/\/.+\.[A-Za-zА-Яа-я]{2,5}((\/|\?).*)?$/,
  handlername_args: /^[a-zA-Z_\/]+(\s.+)?$/,
}

export default regexps;
