const TimedQueue = require("../structures/TimedQueue");

function inject(bot) {
    const client = bot._client;
    const ChatMessage = require("prismarine-chat")(bot.options.version);

    // Queueing system
    const queue = new TimedQueue(200);


    /**
     * Applies a null header to the message(s) and calls {@link bot:chatWithHeader}
     * @param {string | string[]} message The message(s) to send
     * @returns {void}
     */
    bot.sendChat = message => {
        if (!message) return;
        bot.sendChatWithHeader(null, message);
    }


    /**
     * Sends message packet(s) containing message data from the client
     * to the server
     * @param {string | null} header The header to place before every line
     * @param {string | string[]} message The message(s) to send
     * @returns {void}
     */
    bot.sendChatWithHeader = (header, message) => {
        if (!message) return;
        if (typeof message == "number") message = message.toString();

        if (!header) header = "";
        else header += " ";

        let lines = null;
        if (typeof message != "object") {
            lines = message.split("\n");
        }
        else {
            lines = message
        }

        for (let line of lines) {
            bot.sendChatPacket({ message: `${header}${line}` })
        }
    }


    /**
     * Sends a chat packet from the client to the server
     * @param {minecraft-protocol:ChatPacket} packet The chat packet
     * @returns {void}
     */
    bot.sendChatPacket = packet => {
        if (!packet || typeof packet?.message != "string") return;

        // Queue packet
        queue.enqueue({ callback: sudoSendChatPacket, data: [packet], delay: 500 });
    }


    /**
     * Called whenever the client receives a chat event packet
     * @param {minecraft-protocol:Packet} packet The chat packet
     * @emits chatReceived
     */
    client.on("chat", packet => {
        const message = ChatMessage.fromNotch(packet.message);
        const position = packet.position;
        bot.emit("chatReceived", message, position);
    });


    /**
     * WARNING: These functions bypass queues and can lead to packet spam
     * 
     * SUDO FUNCTIONS
     * Functions designed to resolve errors when using client methods
     * in callbacks
     */

    /**
     * Force sends a chat packet from the client to the server
     * @param {minecraft-protocol:ChatPacket} packet The chat packet
     */
    function sudoSendChatPacket(packet) {
        try {
            client.write("chat", packet);
        } catch (e) {
            throw new Error("ERROR: Failed to send chat packet to server\n", e);
        }
    }
}


module.exports = inject;