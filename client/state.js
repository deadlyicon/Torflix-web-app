import Rx from 'rx-dom'
// import now from './resources/now'
// import { routeStream } from './resources/route'
// // import { transfersStream } from './resources/transfers'


const State = (events, spec) => {
  for (var prop in spec){
    spec[prop] = spec[prop](events)
  }
  return combineLatestAsObject(spec).share()
}

export default State

function combineLatestAsObject(spec){
  var props = []
  var streams = []
  for (var prop in spec){
    props.push(prop)
    streams.push(spec[prop])
  }
  return Rx.Observable.combineLatest(...streams).map((values) => {
    let object = {};
    for (var i = 0; i < props.length; i++) {
      object[props[i]] = values[i];
    }
    return object;
  });
}
