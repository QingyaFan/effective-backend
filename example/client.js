const axios = require("axios");

for (let i = 0; i < 10; i++) {
    axios.get(`http://localhost:8000/async?idx=${i}`).then((res) => {
        console.log(i)
        // console.log(res)
    })
}