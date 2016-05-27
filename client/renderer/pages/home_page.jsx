import React from 'react';
import ReactDOM from 'react-dom';
import Layout from '../components/Layout.jsx';

export default class HomePage extends React.Component {

  render() {
    return <Layout auth={this.props.auth}>
      <h1>Home Page</h1>
      <pre>{JSON.stringify(this.props)}</pre>
    </Layout>
  }

}