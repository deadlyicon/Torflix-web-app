import Rx from 'rx-dom'
import putio from '../putio'

export default function(events){
  const POLLING_FREQUENCY = 1000 // miliseconds

  let state = {}
  let stateStream = new Rx.ReplaySubject(1)
  let pollingStream = null

  events.subscribe( event => {
    if (event.type === 'files:load')         return loadFile(event.fileId)
    if (event.type === 'files:reload')       return reloadFile(event.fileId)
    if (event.type === 'files:startPolling') return startPolling(event.fileId)
    if (event.type === 'files:stopPolling')  return stopPolling(event.fileId)
  })

  const loadFile = (fileId) => {
    if (!state[fileId]) reloadFile(fileId)
  }

  const reloadFile = (fileId) => {
    if (state[fileId] && state[fileId].loading) return
    state[fileId] = {loading: true}
    publish()
    putio.getFile(fileId).subscribe(
      file => {
        console.log('file loaded', file);
        state[fileId] = file
        if (file.isDirectory && !file.directoryContentsLoaded && !file.loadingDirectoryContents){
          file.loadingDirectoryContents = true
          loadDirectoryContents(fileId)
        }
        publish()

      },

      error => {
        state[fileId] = {error: error}
        publish()
      }
    )
  }

  const loadDirectoryContents = (fileId) => {
    putio.getDirectoryContents(fileId).subscribe(
      ({parent, files}) => {
        state[fileId] = parent
        files.forEach( file => {
          state[file.id] = file
        })
        publish()
      },

      error => {
        throw error
        // state[fileId] = {error: error}
        // publish()
        debugger
      }
    )
  }

  // const startPolling = () => {
  //   if (pollingStream) return
  //   pollingStream = Rx.Observable.interval(POLLING_FREQUENCY).forEach(reloadFiles)
  //   reloadFiles()
  // }

  // const stopPolling = () => {
  //   pollingStream.dispose()
  //   pollingStream = null
  // }

  const publish = () => stateStream.onNext(state)
  publish()
  return stateStream;
}
