import { useContext, useEffect, useState } from "react";
import { Badge, Button, Col, Container, Dropdown, Form, Nav, NavDropdown, Navbar, Row } from "react-bootstrap";
import Apis, { endpoints } from "../configs/Apis";
import MySpinner from "./MySpinner";
import { Link, useNavigate } from "react-router-dom";
import { MyCartContext, MyUserContext } from "../App";

const Header = () => {
    const [user, dispatch] = useContext(MyUserContext)
    const [cartCounter,] = useContext(MyCartContext)
    const [categories, setCategories] = useState(null)
    const [kw, setKw] = useState("")
    const nav = useNavigate()

    const logout = () => {
        dispatch({
            "type": "logout"
        })
        nav("/")
    }

    const loadCates = async () => {
        // let res = await fetch("http://localhost:8080/SpringFoodPlacesWeb/api/categories")
        // let data = await (res.json)

        let res = await Apis.get(endpoints['categories'])

        setCategories(res.data)
    }

    useEffect(() => {
        loadCates();
    }, [])

    const search = (evt) => {
        evt.preventDefault();
        nav(`/?kw=${kw}`)
    }

    if (categories === null)
        return <MySpinner />

    return (<>
        <Navbar expand="lg" className="bg-body-tertiary">
            <Container>
                <Navbar.Brand href="#home">HUYNHNHU'S WORLD</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link href="/">&#x1F3E0; Trang chủ</Nav.Link>
                        {/* <NavDropdown title="Danh mục" id="basic-nav-dropdown">
                            {categories.map(c => <NavDropdown.Item href="#action/3.1" key={c.categoryfoodId}>{c.categoryname}</NavDropdown.Item>)}
                        </NavDropdown> */}
                        {user === null ?
                            <>
                                <Link className="nav-link text-danger" to="/login">Đăng nhập</Link>
                                <Link className="nav-link text-success" to="/register">Đăng ký</Link>
                            </> :
                            <>
                                <Link className="nav-link text-danger" to="/profile">Chào {user.firstname} {user.lastname}</Link>
                                <Dropdown>
                                    <NavDropdown title="&#9881; Cài đặt" id="basic-nav-dropdown">
                                        <NavDropdown.Item href="/changepassword" >Thay đổi mật khẩu</NavDropdown.Item>
                                        <NavDropdown.Item href="/orderhistory" >Lịch sử đơn hàng</NavDropdown.Item>
                                        <NavDropdown.Item href="/registerrestaurant" >Đăng kí nhà hàng</NavDropdown.Item>
                                        {/* <NavDropdown.Item href="/restaurantdetail" >Quản lí nhà hàng</NavDropdown.Item> */}
                                    </NavDropdown>
                                </Dropdown>
                                <Link className="nav-link text-secondary" to="/">&#x1F514; Thông báo</Link>
                                {/* <div className="vr" style={{ marginRight: ".5rem" }}></div> */}
                                <Button variant="warning" onClick={logout}>Đăng xuất</Button>
                            </>
                        }
                        <Link className="nav-link text-danger" to="/cart">&#128722; <Badge bg="danger">{cartCounter}</Badge></Link>
                        <Link className="nav-link text-danger icon_avatar_link" to="/profile">
                        </Link>
                    </Nav>
                </Navbar.Collapse>
                <Form onSubmit={search} inline>
                    <Row>
                        <Col xs="auto">
                            <Form.Control
                                type="text"
                                value={kw}
                                onChange={e => setKw(e.target.value)}
                                placeholder="Nhập từ khóa để tìm..." name="kw"
                                className=" mr-sm-2"
                            />
                        </Col>
                        <Col xs="auto">
                            <Button type="submit">Tìm kiếm</Button>
                        </Col>
                    </Row>
                </Form>
            </Container>
        </Navbar>
    </>)
}

export default Header;