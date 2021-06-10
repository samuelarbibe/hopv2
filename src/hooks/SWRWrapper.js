import axios from "axios"
import { SWRConfig } from "swr"

const fetcher = (...args) => axios.get(...args).then(res => res.data)

const SWRWrapper = ({ children }) => {
  return (
    <SWRConfig
      value={{
        fetcher
      }}
    >
      {children}
    </SWRConfig>
  )
}

export default SWRWrapper