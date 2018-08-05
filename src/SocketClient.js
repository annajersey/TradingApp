const { EventEmitter } = require('events');
const Websocket = require('ws');

/**
 * Create a new connection to a websocket feed
 * @param {String[]} [productIDs] - The GDAX products to listen to. Default: ['BTC-USD']
 * @param {String} [websocketURI] - Optional websocket URL. Default: The official GDAX feed.
 */
class SocketClient extends EventEmitter {
    constructor(
        productIDs,
        websocketURI = 'wss://ws-feed.pro.coinbase.com/'
    ) {
        super();
        this.productIDs = productIDs;
        this.websocketURI = websocketURI;

        this.channels = ['full'];
        if (!this.channels.includes('heartbeat')) {
            this.channels.push('heartbeat');
        }
        this.connect();
    }

    connect() {
        if (this.socket) {
            this.socket.close();
        }

        this.socket = new Websocket(this.websocketURI);

        this.socket.on('message', this.onMessage.bind(this));
        this.socket.on('open', this.onOpen.bind(this));
        this.socket.on('close', this.onClose.bind(this));
        this.socket.on('error', this.onError.bind(this));
    }

    // disconnect() {
    //     if (!this.socket) {
    //         throw new Error('Could not disconnect (not connected)');
    //     }
    //     this.socket.close();
    //     this.socket = null;
    // }

    _sendSubscription(type, { product_ids, channels }) {
        console.log(type,product_ids, channels);
        const message = { type };

        if (channels) {
            message.channels = channels;
        }

        if (product_ids) {
            message.product_ids = product_ids;
        }


        this.socket.send(JSON.stringify(message));
    }

    subscribe({ product_ids, channels }) {
        this._sendSubscription('subscribe', { product_ids, channels });
    }

    // unsubscribe({ product_ids, channels }) {
    //     this._sendSubscription('unsubscribe', { product_ids, channels });
    // }
    //
    onOpen() {
        this.emit('open');
        this.subscribe({ product_ids: this.productIDs, channels: this.channels });
    }

    onClose() {
        this.socket = null;
        this.emit('close');
    }

    onMessage(data) {
        //console.log(data);
        const message = JSON.parse(data);
        if (message.type === 'error') {
            this.onError(message);
        } else {
            this.emit('message', message);
        }
    }

    onError(err) {
        if (!err) {
            return;
        }

        console.log(err)
    }
}

export default SocketClient;