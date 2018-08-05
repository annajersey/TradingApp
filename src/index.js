import express from 'express';

const app = express();
app.get('/', (req, res) => {
    res.send('Hello World')
})
app.listen(4000, () => {
    console.log('Listening');
});

//const GDAX = require("gdax");
//const publicClient = new GDAX.PublicClient();

const callback = (error, response, data) => {
    if (error)
        return console.dir(error);

    return console.dir(data);
}
//publicClient.getProducts(callback);
//publicClient.getCurrencies(callback);
// publicClient.getProductHistoricRates('BTC-USD', callback);
//
// publicClient.getProductHistoricRates(
//     'BTC-USD',
//     { granularity: 3600 },
//     callback
// );
import SocketClient from './SocketClient'
import {saveToDb} from './DBClient'

const websocket = new SocketClient(['BTC-USD','ETH-USD','LTC-USD']);

const websocketCallback = (data) => {

    if (!(data.type === 'done' && data.reason === 'filled'))

        return;
    //console.dir(data);
    saveToDb(data.product_id,data.price)

}
websocket.on('message', websocketCallback);