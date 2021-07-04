import axios from 'axios'
import { mutate } from 'swr'

export const updateConst = async (id, value) => {
  mutate('/api/consts', (consts) => ({
    ...consts,
    [id]: value
  }), false)

  try {
    await axios.put('/api/consts', { _id: id, value })
    mutate('/api/consts')
    return true
  } catch (err) {
    console.log('Error!!!')
    mutate('/api/consts')
    return false
  }
}
