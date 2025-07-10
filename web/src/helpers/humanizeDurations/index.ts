const humanizeDurations = (seconds: number | null) => {
  if (seconds ) {
    const absSeconds = Math.abs(seconds)
    const days = Math.floor( absSeconds / 86400 )
    const hours = Math.floor((absSeconds % 86400)/ 3600);
    const minutes = Math.floor((absSeconds % 3600) / 60);
    const remainingSeconds = Math.floor(absSeconds % 60);

    const hh = String(hours).padStart(2, '0');
    const mm = String(minutes).padStart(2, '0');
    const ss = String(remainingSeconds).padStart(2, '0');

    return `
    ${ days ? days + 'd:': ''}
    ${hh}h:${mm}m:${ss}s`;
  } else {
    return `0`;
  }
}

export const humanizeDurationsCompact = (seconds: number) => {
  if ( seconds < 60) { return seconds+'s' }
  else if (seconds < 3600) { return Math.round(seconds/60)+'m'}
  else if (seconds < 86400) { return Math.round(seconds/3600)+'h'} 
  else { return Math.round(seconds/86400)+'d'} 
}
export default humanizeDurations
