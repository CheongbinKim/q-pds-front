import React, { useState, useEffect, useRef } from "react";

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
        let v = formRef.current.value;
        if (v == "") return;
        addNumber(formRef.current.value);
    }

    return (
        <Container className="d-flex flex-column min-vh-100">
            <Navbar className="bg-body-tertiary">
                <Container>
                    <Navbar.Brand href="#">
                        <img
                            alt=""
                            src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4QAqRXhpZgAASUkqAAgAAAABADEBAgAHAAAAGgAAAAAAAABHb29nbGUAAP/bAIQAAwICAwICAwMDAwQDAwQFCAUFBAQFCgcHBggMCgwMCwoLCw0OEhANDhEOCwsQFhARExQVFRUPDxcYFhQYEg4VFAEDBAQFBAUKBQUKEw4MDRMRExQUFRAQEhISEg8SEhUREBMRDQ8PExUVFRUPDhEQEBIQEBARFBAODQ8QEBAQEBAP/8AAEQgALAAsAwERAAIRAQMRAf/EAB0AAAICAQUAAAAAAAAAAAAAAAcIBAkGAAECAwX/xAA0EAABAwIEBAUBBgcAAAAAAAABAgMEBREABggSBxMhMRQiQWFxURUyQlKBoRclU2JygrP/xAAcAQEAAgMBAQEAAAAAAAAAAAAHBQYAAwgBAgT/xAA2EQABAQYEAwUHAwUAAAAAAAABAgADBAUREgYhMUFRcYEHE0JhsRQVUnKhwdEWMpEXU9Lh8P/aAAwDAQACEQMRAD8AtOkyWojDjzziGWm0la1rUEpSALkknsMegEmg1LfKlBIqosofFvXvGpM6TTchU5irFolBq88nw5UPVptNlLHfzEpHToCLHDFJezx9EID6ZrKAfCKXdSchyoTxoWLprjZDlZdQKbqeI6dANedQwZOuDir4jnGrU4Ng3LQp7fL+L9/3xev0DI7bLVV435/j6NU/1nNrtU8rWMPCXXy1UpsenZ9prNPDpCRV6aDyUn6uNElSR/ckn4AuRSJ12ePIdBfSxZXTwml3QigPIgcy1qlWNkvVB3MEhNfENOoPrVm/hzGZ8VqRHebfYdSFtutqCkrSRcEEdCCPXA0pJQSlQoQymlQUApJqC3fjxvplF17cWpNEpNOyJTniy5VWzLqKkKsrw4O1DfwtQUT7It2UcL/Z7JkRT9cyfiod5J+Y6nmBSnOuzF+NpquHdJgXRoV5q40Gg65/xRomkvSvRZeWIOds4QUVOXPSJFPp0pIUyyyfuOLR2WpY8wBuACOl+27GWLolUSuXQC7UoyUoak7gHYDTLXPZteF8NOPZ0x0Ym5Ss0g6AbGm9dc/Jm5TSISIgiphxxGCdvJDSdlvpttbA7eom6prxZP7pFLaCnJlS1XaU6NIy1UM45Op7dLqUBCpE2nxEbWZLQF1qSgdErSLq8o8wvcXscLeEMXxDqJRAR6ypCiACTmknTPcbZ6bMbYlwy4eOFRkGm1ScyBoRyG/q0PQPxYlVSLU8h1GQp4QWvHU0rVcpZ3BLjXwlSkqH+SvQDG/tEkyHD1Ezcil5tV82yuoBB5V3bRgmarfIVAPTW3NPLcf9xZxcDTKrVy68kODjqsq3WVSIxbufw7nB0/Xdjpbs7p7mNP7ivRLA+Nq+9E1+EepawPKK4zmVqOqGUGIYTJZLf3dmwbbe1rY5wiAoP1h5rU151ZwhykuUW6UHo3r40N+hoVZUwmjzlSikRgwsulfbZtN7+1r42O7r0261Hq2p7Tu1V4Fq5tDaXv48U7lBW37Ok8235Ng7/wC23HS3aDT3Ibtb0ff/AGwPgy73rl8KmsmxzKz6yn68eEcjMmXYGdqayXpNGQpichCbqMUm4X9SG1XJ+gWo+hwt9n06RBxSpe/NEvaW+Sht1H1AG7GmNZWqIcJjnQzRr8vHp9yWxrSfqwpVBy9EyXnWYmnohjl02rPdGeV6NOn8G3slR6bbA2IG6Txhg9+8iFTKWpuCs1JGoPxJG9dwMwanTSPwxid07ciBjVUtySranAn0Om2urepzjQVQvGCt04xNu/niW3s2/Xde1sDXssQFWd2qvyn8Mp+0uKXXinMMp+qvVpSJuXZ+TckzU1J6cgsT6rHO5hDJHmbbV2WVDoVDoATY37L2EcGxPtCZhMk2pTmlJ1JGhI2A1AOZ4UYxxLihwpwqCgVXFWRUNADqBxrx25tK0GcIZNEps/PlTYLK6myIlNS4myvD7gpbvwtSUgeyb9lDGntCnaIp8mWODUOzVXzUyHTOvmabNuwVKVuHao96KFYonlueuVOXmze3GB2rKDcXGkupUlYCkqFiCLgjHu9W8IqKFlQ4u6DqTmOc9UskT2suyHCVqpklJVEUrqfIR5mhf0AUB6AAWwtyXtBiYJIczFPeJHi8XXY/Q8SxpNcFOIkl7Amw55H9tft6DYMGToM4mGVy/wCQ2/reNVt/57v2xev6iye2tHleFo/yp9Wqf6JmgNLk0+Y/hjBwl0GU6gTmKlnmotV51uy00uGlSYu4fnUbKcHtZIPqCOmKPOu0KIi0FxLkd2D4jQqp5DQc8yNiGtMqwU5h1B7HKvI8I/bXnv8AwGxDU7qF4g8NeL9RoGWswfZdHjR45aiohR1hO5pJNitsn9L4nMIYYlM1lQiox1csqVncoaHyUGisTT2Yy6YGHhXlqQBlRJ9QWZzTrmqq544MZZrlclmdVZbTqn5BbSjeQ8tI8qQAOiQOgwUYig3EBNX8NDiiEmgFa0yHFkmRxDyLlzp+/NVKGZy4+TEvFdabbWMbG1jGxtj2xjYw7zdp94fZ+rr1ar+W2ajU3kpQuQt91JUEiyRZKwOg9sT0DP5nL3PcQr4pTUmgpvrs0NFSaXxjzvYh0FK4nybLcrZWpeSqBEolFiJgUuIkpYjoUpQQCoqPVRJ7knqcRETEvot8p+/VcpWp4tIOHDuGdhy5FEjQN//Z"
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                        />{' '}
                        <span className="title_brand">Q-PDS Demo</span> <span className="title_number"></span>
                    </Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav" className='nav_align_right'>
                        {
                            serverStatus.stat == "1" ?
                                <Button variant="danger" onClick={stopServer}>오토콜 종료</Button>
                                :
                                <Button variant="success" onClick={startServer}>오토콜 시작</Button>
                        }

                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Row>
                <Container>
                    <Row className="mt-3">
                        <Form>
                            <InputGroup className="mb-3">
                                <Form.Control
                                    size="sm"
                                    placeholder="오토콜 목록에 추가할 전화번호를 입력하세요."
                                    aria-label="오토콜 목록에 추가할 전화번호를 입력하세요."
                                    aria-describedby="basic-addon2"
                                    ref={formRef}
                                />
                                <Button variant="dark" id="button-addon2" size="sm" onClick={regNumber}>
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
                                                    className={item.stat == '1' || item.stat == '2'? 'blink'  : ''}
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
            <footer className="py-3 bg-light mt-auto">
                <div className="px-5 text-center fs-6">
                    @ 2023 Quantum AI <a href="https://quantum-ai.ai/">https://quantum-ai.ai/</a>
                </div>
            </footer>    
        </Container>
        
    )
}

export default Demo;