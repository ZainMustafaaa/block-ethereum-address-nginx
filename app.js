const express = require('express');
const app = express();
const addresses = require('./addresses.json');

const Tx = require('ethereumjs-tx');

const bodyParser = require('body-parser');

const router = express.Router();

app.use(bodyParser.json());

router.post('/validate/trx', (req, res) => {

    try {

        const body = req.body;
        
        switch(body.method) {
            case 'eth_sendRawTransaction': {
                const [ rawTx ] = body.params;
                const address = new Tx(rawTx).getSenderAddress().toString('hex').replace('0x', '');
                
                const findIndex = addresses.findIndex(_ => _.toLowerCase() === `0x${address}`.toLowerCase());

                if(findIndex !== -1) {
                    res.status(405).send("Not Allowed!");
                }
            }
            default: {
                if(body.params.length === 1) {
                    if(typeof body.params[0] === 'object') {
                        body.params = Object.keys(body.params[0]).map(key => body.params[0][key]);
                    }
                }

                const index = body.params ?  body.params.findIndex(_ => _.toLowerCase() === '0x70514EE1bE658F77fDdfa19D8830A3193899Ea76'.toLowerCase()) : -1;

                if(index !== -1) return res.status(405).send("Not Allowed!");
            }
        }

    } catch(e) {
        res.status(500).send(e.message)
    }

})

app.use(router);

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is listening on port ${port}`)
})