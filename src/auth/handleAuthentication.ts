// TODO: handle authentication w/ simple backend server (probably a redis cache):
// https://medium.com/@benjamin.botto/secure-access-token-storage-with-single-page-applications-part-2-921fce24e1b5

// TODO: DO NOT LEAVE IN LOCAL STORAGE. At bare min it should perssist in a singleton

// making a post request to /login will return an 'accessToken' that which can be used to authenticate
// other requests. N.B. the token has an option expiry param (60s etc.) which can be used to test re-auth
export const handleLogin = async (url: string, email:string, password:string): Promise<string> => {
  checkLoginStatus('LOGGED_OUT')
  const result = await fetch(`${url}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: `{"email":"${email}","password":"${password}"}`
  })
    .then(res => {
      if (res.status === 200) return res.json()
      if (res.status !== 200) return res.status
      throw new Error('Unable to login 😢')
    })
    .then(data => {
      if (data.accessToken) {
        setLocalStorage(data.accessToken)
        return 'success'
      }
      return 'failure'
    }).catch(e => {
      throw new Error(`Something went wrong 😥: ${e}`)
    })
  return result
}

export const checkLoginStatus = (reqStatus: 'LOGGED_IN' | 'LOGGED_OUT') => {
  if ((reqStatus === 'LOGGED_IN') && (localStorage.key(0) !== 'token' || !undefined)) {
    throw new Error('⚠️ you must be logged in to continue')
  }
  if ((reqStatus === 'LOGGED_OUT') && localStorage.key(0) === 'token') throw new Error('⚠️ you are already logged in')
}

const setLocalStorage = (token: any) => {
  if (localStorage.key(0) === 'token') console.log('you are already logged in')
  localStorage.setItem('token', token)
  console.log('token set')
}
