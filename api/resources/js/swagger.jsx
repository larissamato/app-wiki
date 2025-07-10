import React from 'react'
import ReactDOM from 'react-dom'
import SwaggerUI from 'swagger-ui-react'

import 'swagger-ui-react/swagger-ui.css'

export const complete = function (swaggerUi) {
  const token = decodeURI(/token=(.*);/.exec(document.cookie)[1])
  if (token) {
    swaggerUi.preauthorizeApiKey('bearerAuth', token)
  }
  const spec = swaggerUi.specSelectors.specJson().toJS()
  spec.servers = [
    { url: window.location.origin + '/api', description: window.location.host }
  ]
  swaggerUi.specActions.updateJsonSpec(spec)
}

function App () {
  return (
    <div className='App'>
      <SwaggerUI url='/api.yaml' defaultModelsExpandDepth={-1} onComplete={complete} />
    </div>
  )
}

const rootElement = document.getElementById('root')
ReactDOM.render(<App />, rootElement)
