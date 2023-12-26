import React, { useState, useEffect, useRef } from "react";

import Footer from './layout/footer';
import QNav from './layout/nav';

import Badge from 'react-bootstrap/Badge';
import { Container, ListGroup, Navbar, Nav, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import "./demo.css";

import { getCallList, getServerStatus, startServer, stopServer, addNumber, delNumber } from '../api/apis'

import { MagnifyingGlass } from 'react-loader-spinner'

import moment from 'moment';
import 'moment/locale/ko';

function Demo() {
    const [callList, setCallListState] = useState([]);
    const [serverStatus, setServerStatus] = useState({});
    const [isLoding, setLoading] = useState(true);
    const [currentTime, setCurrentTime] = useState();
    const formRef = useRef()
    const sidRef = useRef()

    const webSocketUrl = `ws://52.79.218.211:5064/ws`;
    let ws = useRef(null);
    let polling = useRef(null);

    const pollingSet = () => {
        getServerStatus().then((data) => {
            setServerStatus(data);
        })

        getCallList().then((data) => {
            setCallListState(data);
            setLoading(false);
        })
    }

    const runWs = () => {
        console.log(ws)
        if (!ws.current) {
            ws.current = new WebSocket(webSocketUrl);

            ws.current.onopen = () => {
                console.log("connected to " + webSocketUrl);
                ws.current.send('hello')
                polling.current = setInterval(() => {
                    // pollingSet()
                    ws.current.send('hello')
                    setCurrentTime(moment().format("YYYY년 MM월 DD일 HH:mm:ss"));
                }, 500);
            };
            ws.current.onclose = (error) => {
                console.log("disconnect from " + webSocketUrl);
                console.log(error);
                clearInterval(polling.current);
                ws.current = null;
                setTimeout(() => {
                    runWs();
                }, 1000);
            };
            ws.current.onerror = (error) => {
                console.log("connection error " + webSocketUrl);
                console.log(error);
            };
            ws.current.onmessage = (evt) => {
                const data = JSON.parse(evt.data);
                console.log(data)
                setLoading(false)
                setServerStatus(data.serverStatus)
                setCallListState(data.callList)
            };
        }
    }

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

    useEffect(() => {

    }, [serverStatus])

    useEffect(() => {

    }, [callList])

    const regNumber = () => {
        // input에 번호 저장된거 가져와서 add api 호출
        let sid = sidRef.current.value;
        console.log(sid);
        let v = formRef.current.value;
        if (v == "") return;
        addNumber(sid,v);
    }

    return (
        <Container className="d-flex flex-column min-vh-100">
            <QNav status={serverStatus}></QNav>
            <Row>
                <Container>
                    <Row className="mt-3">
                        <Form>
                            <InputGroup className="mb-3">
                                <Form.Control
                                    className="mw-30"
                                    size="sm"
                                    placeholder="시나리오아이디를 입력하세요."
                                    aria-label="시나리오아이디를 입력하세요."
                                    aria-describedby="basic-addon2"
                                    ref={sidRef}
                                />
                                <Form.Control
                                    size="sm"
                                    placeholder="오토콜 목록에 추가할 전화번호를 입력하세요."
                                    aria-label="오토콜 목록에 추가할 전화번호를 입력하세요."
                                    aria-describedby="basic-addon2"
                                    ref={formRef}
                                />
                                <Button className="mw-20" variant="dark" id="button-addon2" size="sm" onClick={regNumber}>
                                    추가
                                </Button>
                            </InputGroup>
                        </Form>
                    </Row>
                    <Row>
                        <span className="table_title">Auto Call Lists ( {currentTime} )</span>
                    </Row>
                    {
                        isLoding == true ?
                            <MagnifyingGlass
                                visible={true}
                                height="80"
                                width="80"
                                ariaLabel="MagnifyingGlass-loading"
                                wrapperStyle={{}}
                                wrapperClass="MagnifyingGlass-wrapper"
                                glassColor='#c0efff'
                                color='#e15b64'
                            />
                            : callList == undefined || callList.length == 0 ?
                                <>등록 된 전화번호가 없습니다.</>
                                :
                                callList.map((item, idx) => {
                                    return (
                                        <ListGroup key={idx} as="ol">
                                            <ListGroup.Item action variant="light" as="li" className="d-flex justify-content-between align-items-start">
                                                <div className="ms-2 me-auto">
                                                    <div className="fw-bold list_li">
                                                        {item.updDt}
                                                        <span className="phone_number">{item.phnNum.replace(/^(\d{0,3})(\d{0,4})(\d{0,4})$/g, "$1-$2-$3").replace(/\-{1,2}$/g, "")}</span>
                                                        ( SID : {item.sid} )
                                                    </div>
                                                </div>
                                                <Badge
                                                    bg={item.stat == '0' ? 'warning' : item.stat == '3' ? 'success' : item.stat == '4' ? 'secondary' : 'primary'}
                                                    pill
                                                    className={item.stat == '1' || item.stat == '2' ? 'blink' : ''}
                                                >
                                                    {item.stat == 0 ? '대기중' : (item.stat == 1 ? '연결중' : (item.stat == 2 ? '통화중' : (item.stat == 3 ? '정상종료' : '연결실패')))}
                                                </Badge>
                                                <Badge className="delete_btn" bg='danger' pill onClick={() => delNumber(item.seq)}>
                                                    삭제하기
                                                </Badge>

                                            </ListGroup.Item>
                                        </ListGroup>
                                    )
                                })
                    }

                </Container>
            </Row>
            <Footer></Footer>
        </Container>

    )
}

export default Demo;