const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

// Middleware

app.use(cors());
app.use(express.json());


// Changed the username and pass for the third time




app.get('/', (req, res) =>{
    res.send('Clothing Cove server up And running')
})

app.listen(port, ()=>{
    console.log(`Running on PORT: ${port}`);
})