import React, { useState, useEffect, useRef } from "react";

import { Container, ListGroup, Navbar, Nav, Row, Col, Form, Button, InputGroup } from 'react-bootstrap';

import 'bootstrap/dist/css/bootstrap.min.css';
import "../demo.css";

import { startServer, stopServer} from '../../api/apis'

const QNav = ({status}) => {
    
    return (
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
                        status.stat == "1" ?
                            <Button variant="danger" onClick={stopServer}>오토콜 종료</Button>
                            :
                            <Button variant="success" onClick={startServer}>오토콜 시작</Button>
                    }
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
};

export default QNav;