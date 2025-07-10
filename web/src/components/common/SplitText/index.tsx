interface Split {
  children: any
}
const SplitText = ({ children }: Split) => {
  return (
    <>
      {children
        ? children.split('\n').map((e: string, index: number) => (
            <span key={index}>
              {e}
              <br />
            </span>
          ))
        : null}
    </>
  )
}

export default SplitText
