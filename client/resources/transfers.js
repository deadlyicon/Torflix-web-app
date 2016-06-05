import Rx from 'rx-dom'
import putio from '../putio'

export default function(events){
  const POLLING_FREQUENCY = 3000 // miliseconds

  let state = {}
  let stateStream = new Rx.ReplaySubject(1)
  // .subscribeOnCompleted( () => {
  //   if (pollingStream) pollingStream.dispose()
  //   pollingStream = null
  // })
  let pollingStream = null

  events.subscribe( event => {
    if (event.type === 'transfers:load')         return loadTransfers()
    if (event.type === 'transfers:reload')       return reloadTransfers()
    if (event.type === 'transfers:startPolling') return startPolling()
    if (event.type === 'transfers:stopPolling')  return stopPolling()
  })

  const loadTransfers = () => {
    if (!state.loaded) reloadTransfers()
  }

  const reloadTransfers = () => {
    putio.getTransfers().subscribe( transfers => {
      state.transfers = transfers
      state.loaded = true
      publish()
    })
    publish()
  }

  const startPolling = () => {
    if (pollingStream) return
    pollingStream = Rx.Observable.interval(POLLING_FREQUENCY).forEach(reloadTransfers)
    reloadTransfers()
  }

  const stopPolling = () => {
    pollingStream.dispose()
    pollingStream = null
  }

  const publish = () => stateStream.onNext(state)
  publish()
  return stateStream;
}
