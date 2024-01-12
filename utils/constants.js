const IS_URL = /^(https?:\/\/)?([\w-]{1,32}\.[\w-]{1,32})[^\s!"#'()*+,:;<>@[\\\]`{|}~]*$/;
const SECRET_KEY = 'super-strong-secret';
module.exports = { IS_URL, SECRET_KEY };
