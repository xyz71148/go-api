var ss_server = {
    servs: {},
    init: ({host, port, method, password, name, accessKey, id}) => {
        //"method": "aes-256-cfb",
        ss_server.servs[id] = {
            config: {host, port, method, password, name, accessKey, id},
            serv: null
        };
    },
    connect: (id, callback) => {
        const {config} = ss_server.servs[id]
        // eslint-disable-next-line no-undef
        ss_server.servs[id].serv = new cordova.plugins.outline.Connection(config, id);
        ss_server.servs[id].serv.onStatusChange((status) => {
            switch (status) {
                case 0 :
                    console.log("CONNECTED")
                    callback({id, status: "CONNECTED"})
                    break;
                case 1:
                    console.log("DISCONNECTED")
                    callback({id, status: "DISCONNECTED"})
                    break;
                case 2:
                    console.log("RECONNECTING")
                    callback({id, status: "RECONNECTING"})
                    break;
                default:
                    callback({id, status: "ERROR"})
                    console.warn("Received unknown connection status " + status);
                    return;
            }
        })

    },
    start(id, callback) {
        ss_server.connect(id, callback);
        ss_server.servs[id].serv.start().catch((e) => {
            console.error(e.message)
            callback({id, status: "ERROR", msg: e.message})
        })
    },
    stop(id,callback) {
        ss_server.servs[id].serv.stop().catch((e) => {
            console.error(e.message)
            callback({id, status: "ERROR", msg: e.message})
        })
    },
    check(id, callback) {
        ss_server.servs[id].serv.isRunning().then(function (isRunning) {
            if (!isRunning) {
                console.log("DISCONNECTED")
                callback({id, status: "DISCONNECTED"})
                return;
            }
            ss_server.servs[id].serv.isReachable().then(function (isReachable) {
                if (isReachable) {
                    console.log("CONNECTED")
                    callback({id, status: "CONNECTED"})
                } else {
                    console.log("RECONNECTING")
                    callback({id, status: "RECONNECTING"})
                }
            });
        })
            .catch(function (e) {
                console.error('Failed to sync server connectivity state', e);
                callback({id, status: "ERROR"})
            });
    }
};

window.ss_server = ss_server;
