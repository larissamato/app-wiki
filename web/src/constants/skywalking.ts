const skywalking = {
  service: 'front-dev',
  resourceErrors: false,
  jsErrors: false,
  apiErrors: false,
  collector: 'https://webperf.opendata.center',
  serviceVersion: '1.0.0',
  enableSPA: true,
  traceSDKInternal: true,
  pagePath: window.location.href,
  useFmp: true
}

export default skywalking
