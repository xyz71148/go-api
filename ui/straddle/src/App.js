import React, {Component} from 'react';
import inflateRaw from "inflate-raw";

import './App.css';

class App extends Component {
    state = {}

    componentDidMount() {
        var ws = new WebSocket("wss://okexcomreal.bafang.com:8443/ws/v3");
        window.ws = ws;

        // 连接建立后的回调函数
        ws.onopen = function () {
            // ws.send(JSON.stringify({
            //     "op": "jwt",
            //     "args": "eyJhbGciOiJIUzUxMiJ9.eyJqdGkiOiJleDExMDE1ODI5NjY4ODc4NTFGQjUxRDdENENCOTY0RkZFbFZ3RSIsInVpZCI6ImJsOThLTUJyQVJzWFViTGtsVXQxMmc9PSIsInN0YSI6MCwibWlkIjowLCJpYXQiOjE1ODQzMzU5MjEsImV4cCI6MTU4NDk0MDcyMSwiYmlkIjowLCJkb20iOiJ3d3cub2tleC5jb20iLCJpc3MiOiJva2NvaW4iLCJzdWIiOiI5RjU3NDZFNDJDRjcxMTI1RDhFMzAwNTdFMzNEMkJDQSJ9._21qOM4jaJ5C2S9rVpOuPl1mwKszbCUmNpLglNEESJIMUnl0i57MtndO4LnscZsY64LdpMQStifogsKLiPwErw"
            // }));
        };

        function t(evt) {
            var received_msg = evt.data;
            var fr = new FileReader();
            fr.onload = function (e) {
                if (e.target.readyState === FileReader.DONE) {

                    inflateRaw(e.target.result, function (err, uncompressedBuffer) {
                        var res = new window.TextDecoder("utf-8").decode(uncompressedBuffer)
                        var t = JSON.parse(res)
                        if (t.data) {
                            console.log(t.data[0].instrument_id, t.data[0].last)
                        }
                        if (t.event === "jwt" && t.success === true) {
                            ws.send(JSON.stringify({
                                "op": "subscribe",
                                "args": ["spot/ticker:ETH-USDT"]
                            }));

                            ws.send(JSON.stringify({
                                "op": "subscribe",
                                "args": ["spot/ticker:LINK-USDT"]
                            }));
                            ws.send(JSON.stringify({
                                "op": "subscribe",
                                "args": ["spot/ticker:LINK-ETH"]
                            }));
                        }
                    })

                }
            };
            fr.readAsArrayBuffer(received_msg);

        };
        ws.onmessage = t
        ws.onclose = function () {
            alert("连接已关闭...");
        };
    }

    render() {

        return (
            <div className="App">
                www
            </div>
        );
    }
}

export default App;
