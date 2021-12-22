import { useEffect, useRef } from "react";
import 'xterm/css/xterm.css';
import { Terminal } from 'xterm';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { AttachAddon } from 'xterm-addon-attach';
import { FitAddon } from 'xterm-addon-fit';
import { TerminalConnectStatus } from "../interfaces";

const TerminalOptions = {
    fontSize: 15,
    fontFamily: 'Menlo For Powerline,Consolas,Liberation Mono,Menlo,Courier,monospace',
    theme: {
        foreground: '#f1f5f9',
        background: '#111827',
        cursor: '#adadad',
        black: '#000000',
        red: '#991b1b',
        green: '#166534',
        yellow: '#854d0e',
        blue: '#1e40af',
        magenta: '#89658e',
        cyan: '#155e75',
        white: '#dbded8',
        brightBlack: '#686a66',
        brightRed: '#f54235',
        brightGreen: '#99e343',
        brightYellow: '#fdeb61',
        brightBlue: '#84b0d8',
        brightMagenta: '#bc94b7',
        brightCyan: '#37e6e8',
        brightWhite: '#f1f1f0',
    }
}

interface ITerminal {
    namespace: string
    pod: string
    container: string
    changeStatus: (status: TerminalConnectStatus) => void
}

export default ({ namespace, pod, container, changeStatus, ...props }: ITerminal & React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>) => {

    const terminalRef = useRef<HTMLDivElement>(null)

    const terminal = new Terminal(TerminalOptions)
    const webLinksAddon = new WebLinksAddon()
    const fitAddon = new FitAddon()

    const resize = (socket: WebSocket) => socket.readyState == WebSocket.OPEN && socket.send(`C4 ${fitAddon.proposeDimensions().rows} ${fitAddon.proposeDimensions().cols}`)

    useEffect(() => {
        if (!(namespace && pod && container)) {
            changeStatus(TerminalConnectStatus.CLOSED)
            return
        }

        const socket = new WebSocket(`ws://127.0.0.1:8080/api/k8s/terminal/${namespace}/${pod}/${container}`)
        const attachAddon = new AttachAddon(socket)

        // Socket Events
        socket.onopen = () => {
            socket.send(`C4 ${fitAddon.proposeDimensions().rows} ${fitAddon.proposeDimensions().cols}`)
            changeStatus(TerminalConnectStatus.CONNECTED)
        };
        socket.onerror = (err) => {
            console.error(err)
            changeStatus(TerminalConnectStatus.CLOSED)
        };
        socket.onclose = () => {
            changeStatus(TerminalConnectStatus.CLOSED)
        }

        // Attach Remote TTY
        if (terminalRef && terminalRef.current) {
            terminal.onResize(() => resize(socket))
            terminal.loadAddon(webLinksAddon)
            terminal.loadAddon(fitAddon)
            terminal.loadAddon(attachAddon)
            terminal.open(terminalRef.current)
            fitAddon.fit()
            terminal.focus()
        }

        // Listen for Window resize
        const resizeObserver = new ResizeObserver(() => {
            fitAddon.fit()
            resize(socket)
        })
        resizeObserver.observe(document.body)

        // Clear all
        return () => {
            resizeObserver.unobserve(document.body)
            socket.close()
            terminal.dispose()
        }
    }, [namespace, pod, container])

    return (
        <div className={props.className} ref={terminalRef} />
    );

}
