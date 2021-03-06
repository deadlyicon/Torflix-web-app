import React from 'react'
import ReactDOM from 'react-dom'
import Page from '../page.js'
import Layout from '../components/layout.jsx'
import SearchResults from '../components/search_results.jsx'

export default class TorrentDownloadPage extends Page {

  onStateChange(props){
    const torrentId = props.route.params.torrentId
    if (this.torrentId !== torrentId){
      this.torrentId = torrentId
      this.emit({
        type: 'download-torrent',
        torrentId: torrentId,
      })
    }else{
      const downloadState = props.torrentDownload[torrentId] || {}
      if (downloadState.complete){
        this.emit({
          type: 'transfers:reload'
        })
        this.emit({
          type: 'setLocation',
          location: {
            path: '/transfers',
          },
          replace: true,
        })
      }
    }
  }

  render(props) {
    const torrentId = this.torrentId
    const downloadState = props.torrentDownload[torrentId] || {}
    const torrentName = downloadState.torrentName || downloadState.name || torrentId
    const stateDescription = (
      downloadState.error ? 'ERROR '+downloadState.error :
      downloadState.magnetLink ? 'Adding magnet link to Put.io' :
      downloadState.trackers ? 'Searching for magnet link' :
      'Searching for trackers'
    )

    return <Layout>
      <h1>Downloading {torrentName}</h1>
      <h2>{stateDescription}</h2>
    </Layout>
  }

}
