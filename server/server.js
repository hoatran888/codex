import express from 'express';
import * as dotenv from 'dotenv';
import cors from 'cors';
import { Configuration, OpenAIApi } from 'openai';

dotenv.config();

console.log(process.env.OPENAPI_API_KEY);

const configuration = new Configuration({
    apikey: process.env.OPENAPI_API_KEY,

})

const openai = new OpenAIApi(configuration);

// init express app

const app = express();
app.use(cors());
app.use(express.json());

// set default route
app.get('/', async(req, res) => {
    res.status(200).send({
        message: 'Hello from Codex',
    })
})

// now prepare to creat post route

app.post('/', async(req, res) => {
    try {
        const prompt = req.body.prompt;

        const response = await openai.createCompletion({
            model:"text-davinci-003",
            promt:`${prompt}`,
            temperature:0,  // higher is more risk
            max_tokens:3000,
            top_p:1,
            frequency_penalty:0.5,  // less likely to ßsay samething with given prompt
            presence_penalty:0,
            // stop=["\"\"\""] // no stop
        })

        res.status(200).send({
            bot: response.data.choices[0].text
        })

    }catch (error){
        console.log(error);
        res.status(500).send({error});
    }
})

// now let server listening on port 5500

app.listen(5500, () => {
    console.log('Server is running on port http://localhost:5500');

})

