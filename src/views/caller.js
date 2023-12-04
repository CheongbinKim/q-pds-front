import React, { useState, useEffect, useRef } from "react";

import Badge from 'react-bootstrap/Badge';
import { Container, ListGroup, Navbar, Nav, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./demo.css";

import { getCallList, getServerStatus, startServer, stopServer, addNumber, delNumber } from '../api/apis'

import { MagnifyingGlass } from 'react-loader-spinner'

import moment from 'moment';
import 'moment/locale/ko';

function Caller() {
    const [currentTime, setCurrentTime] = useState();

    const webSocketUrl = `ws://52.79.218.211:5064/caller`;
    let ws = useRef(null);
    let polling = useRef(null);

    useEffect(() => {
        console.group("useEffect() Init")

        runWs();

        console.groupEnd()

        // 페이지에 벗어날 경우 polling X
        return () => {
            if (!polling) {
                clearInterval(polling.current);
            }
            if (ws.current.readyState === 1) {
                ws.current.close();
            }
        };
    }, [])

    const runWs = () => {
        console.log(ws)
        if (!ws.current) {
            console.log(webSocketUrl);
            ws.current = new WebSocket(webSocketUrl);

            ws.current.onopen = () => {
                console.log("connected to " + webSocketUrl);

                polling.current = setInterval(() => {
                    // pollingSet()
                    setCurrentTime(moment().format("YYYY년 MM월 DD일 HH:mm:ss"));
                }, 1000);
            };

            ws.current.onclose = (error) => {
                console.log("disconnect from " + webSocketUrl);
                console.log(error);
                ws.current = null;
            };

            ws.current.onerror = (error) => {
                console.log("connection error " + webSocketUrl);
                console.log(error);
            };
            ws.current.onmessage = (evt) => {
                const data = JSON.parse(evt.data);
                console.log(data)
            };
        }
    }
 
    return <>
    <span>( {currentTime} )</span>
    </>
}

export default Caller;