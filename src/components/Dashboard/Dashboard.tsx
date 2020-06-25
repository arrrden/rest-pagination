import React, { useState, useEffect, useLayoutEffect, useRef } from 'react'

import { fetchApps, getUsers } from './handlers'

import { UserPage } from './useList'

export const Dashboard = ({ url, currentUser }:{url: string, currentUser: string }) => {
  const [apps, setApps] = useState<any>([])
  const token = () => localStorage.getItem('token') || 'error'

  const getApps = async (url: string) => {
    if (token() === 'error') setApps({ error: token })

    const appArr = await Promise.resolve(fetchApps(url, token()))
    if (appArr === 'error') setApps({ error: appArr })
    setApps(appArr?.apps)
  }

  // useLayoutEffect runs after the initial render so we can avoid resolving a promise _during_ render
  useLayoutEffect(() => {
    getApps(url)
  }, [url])

  return (
    <div data-testid='dashboard'>
      <h1>{currentUser === '' ? `There was an error logging in` : `${currentUser}: Dashboard`}</h1>
      {
        !apps?.error ? apps?.length > 0 ? apps.map((i: any, index: number) => <AppItem key={index} url={url} appId={i.id} name={i.name} picture={i.logo} date={i.date} token={token()}/>) : 'loading...' : 'error fetching data'
      }
    </div>
  )
}

interface IAppItem {
  url: string,
  appId: string,
  name: string,
  picture: string,
  date: string,
  token: string,
}

// APP ITEM
function AppItem({ url, appId, name, picture, date, token }:IAppItem) {
  // TODO: This might be better handled with a more complex state model and reducer...
  const [open, setOpen] = useState(false)
  const [index, setIndex] = useState(0)
  const [list, setList] = useState<any>(null)
  const [NODE, setNODE] = useState<any>(null)

  const page = (() => index + 1)()

  // create list instance
  const createList = () => setList(UserPage)

  const ref = useRef(null)

  // handle list creation on open
  const handleSetUp = () => {
    if (open) return
    createList()
    setIndex(0)
    setOpen(true)
  }

  useEffect(() => {
    // @ts-ignore
    ref.current.hidden = !open
  }, [open])

  // CREATES USERS ARRAY <- requires NODE
  const userArray = (node:any) => {
    if (!node?.value) return <></>
    return node?.value?.users.map(
      (i:any) => <User key={i.id} name={i.name} email={i.email} avatar={i.avatar}/>
      )
  }

  // update page number
  const handlePageChange = (val: number) => setIndex(index + val)

  const handlePageInView = async () => {
    // requires an argument of page as getUsers processes the request relative to the API's pagination
    const handleGet = async (page: number):Promise<any> => {
      const users = await getUsers(url, appId, token, page)
      return Promise.resolve(users)
    }

    if (list?.get(page - 1)?.value === 'LAST') return

    // WHEN the list isn't null and the last item does not have the value of 'LAST' then
    if (list !== null && list?.last?.value !== 'LAST') {
      // if the first item has a null value: GET data
      if (list.first === null) {
        list.addLast(await handleGet(page))
        setNODE(list.first)
      }

      // if the present page is not the first and has data return
      if (index < 1 && NODE !== (undefined || null)) return

      // getUsers returns the next node - if this is the last the next useEffect call will return exit on the first if
      list.addLast(await handleGet(page + 1))
    }
  }

  // handle data fetching depending on page change
  useEffect(() => {
    handlePageInView()
  }, [index, handleSetUp, NODE])

  return (
    <>
      <button data-testid='card' onClick={() => {
        if (list === null) handleSetUp()
        setOpen(!open)
      }}>
        <h3>{name}</h3>
        <span>{date}</span>
        <img height='200' width='200'src={picture} alt={`image of ${name}`}/>
      </button>
      <div ref={ref}>
        <button onClick={() => { setOpen(false) }}>close</button>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {userArray(NODE)}
        </div>

        <button
          onClick={() => {
            if (page > 1) {
              handlePageChange(-1)
              setNODE(list.get(index).getPrevious())
            }
          }
          }>
          back
        </button>
        <button onClick={() => {
          if (list?.get(page)?.value !== 'LAST') {
            handlePageChange(1)
            setNODE(list.get(index).getNext())
          }
        }}>next</button>
        <br />
        {page}
      </div>

    </>
  )
}

// USER ITEM
const User = ({ name, email, avatar }:{name: string, email: string, avatar: string, }) => {
  return (
    <div style={{ padding: '1rem', borderRadius: '8px', margin: '0.2rem', boxShadow: '0 0 2px 0 black' }}>
      <h4>{name}</h4>
      <p>{email}</p>
      <img height='40' width='40'src={avatar} alt={`image of ${name}`} style={{ borderRadius: '50%' }}/>
    </div>
  )
}
