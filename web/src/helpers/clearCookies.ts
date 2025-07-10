export const clearCookies = () => {
  const allCookies = document.cookie.split(';')
  // The "expire" attribute of every cookie is
  // Set to "Thu, 01 Jan 1970 00:00:00 GMT"
  for (let i of allCookies)
    document.cookie = i + '=;expires=' + new Date(0).toUTCString()
}
