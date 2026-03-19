import { containerProps } from '../../types/queueTypes'

const Container = ({style, children}: containerProps) => {
  return (
    <div className={style}>{children}</div>
  )
}

export default Container