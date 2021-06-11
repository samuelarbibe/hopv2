import { deepFreeze } from "grommet/utils"

export default deepFreeze({
  global: {
    font: {
      family: "'Rubik', sans-serif;",
    },
    colors: {
      brand: "",
    }
  },
  heading: {
    extend: "font-family: 'Poppins', sans-serif;",
  },
})
