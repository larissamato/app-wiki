const Sprite = ({ x }: { x: number }) => {
  const src = localStorage.getItem('sprite')
  return (
    <img
      src={`data:image/png;base64,${src}`}
      style={{
        height: '30px',
        width: '30px',
        objectPosition: `-${x / 4.267}px`
      }}
    />
  )
}

export default Sprite
