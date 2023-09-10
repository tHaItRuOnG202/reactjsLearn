import { useContext, useEffect, useRef, useState } from "react";
import { MyUserContext } from "../App";
import { Alert, Button, Card, Col, Form, Row, Table } from "react-bootstrap";
import { authApi, endpoints } from "../configs/Apis";
import { Link, useNavigate } from "react-router-dom";
import MySpinner from "../layout/MySpinner";

const RegisterRestaurant = () => {
    const [user,] = useContext(MyUserContext);
    const avatar = useRef();
    const [restaurant, setRestaurant] = useState([]);
    const [loading, setLoading] = useState(false);
    const nav = useNavigate();
    const [reg_restaurant, setRes_restaurant] = useState({
        "restaurantName": "",
        "location": ""
    })

    const loadRestaurant = async () => {
        try {
            let e = `${endpoints['restaurant']}?current_user_UserId=${user.userId}`;
            let { data } = await authApi().get(e);
            setRestaurant(data);
            // console.log(data);
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        loadRestaurant();
    }, [user.userId]);

    const register_restaurant = (evt) => {
        evt.preventDefault();

        setLoading(true);
        const process = async () => {
            try {
                let form = new FormData();

                form.append("restaurantName", reg_restaurant.restaurantName);
                form.append("location", reg_restaurant.location);

                if (avatar.current.files[0] !== undefined) {
                    form.append("avatar", avatar.current.files[0]);
                } else {
                    form.append("avatar", new Blob());
                }

                let data = await authApi().post(endpoints['register-restaurant'], form);

                if (data.status === 201) {
                    loadRestaurant();
                    nav("/registerrestaurant")
                    setLoading(false);
                }
            } catch (ex) {
                console.log(ex);
            }
        }
        process();
    }

    const change = (evt, field) => {
        // setUser({...user, [field]: evt.target.value})
        setRes_restaurant(current => {
            return { ...current, [field]: evt.target.value }
        })
    }

    if (user === null) {
        return <h1><Alert variant="danger">Vui lòng <Link to="/login">đăng nhập</Link> giúp em</Alert></h1>
    }

    return <>
        <Card style={{ width: '18rem', marginLeft: 'auto', marginRight: 'auto' }} className="mt-0 mb-5">
            <Card.Img variant="top" src={user.avatar} />
            <Card.Body>
                <Card.Title>{user.firstname} {user.lastname}</Card.Title>
                <Card.Text>
                    Đăng bán những món ăn của bạn ngay nào...
                </Card.Text>
            </Card.Body>
        </Card>
        <h1 className="text-center text-danger">ĐĂNG KÝ NHÀ HÀNG</h1>
        <Form onSubmit={register_restaurant}>
            <Form.Group className="mb-3">
                <Form.Label>Tên nhà hàng</Form.Label>
                <Form.Control type="text" onChange={(e) => change(e, "restaurantName")} placeholder="Nhập tên nhà hàng" required />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Vị trí</Form.Label>
                <Form.Control type="text" onChange={(e) => change(e, "location")} placeholder="Nhập vị trí" required />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Ảnh đại diện</Form.Label>
                <Form.Control type="file" ref={avatar} />
            </Form.Group>
            <Form.Group className="mb-3">
                {loading === true ? <MySpinner /> : <Button variant="info" type="submit">Đăng ký</Button>}
            </Form.Group>
        </Form>
        <hr />
        <h2 className="text-center text-info mb-2">Danh sách nhà hàng của bạn</h2>
        <Row>
            <Col>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Tên nhà hàng</th>
                            <th>Địa chỉ</th>
                            <th>Trạng thái</th>
                            <th>Chủ nhà hàng</th>
                            <th>Quản lý</th>
                        </tr>
                    </thead>
                    <tbody>
                        {restaurant.map(res => {
                            let url = `/restaurants/${res.restaurantId}`;
                            return (
                                <tr>
                                    <td>{res.restaurantId}</td>
                                    <td>{res.restaurantName}</td>
                                    <td>{res.location}</td>
                                    <td>{(res.confirmationStatus) ? "Đã xác nhận" : "Chưa xác nhận"}</td>
                                    <td>{(res.confirmationStatus) ? `${res.userId.firstname} ${res.userId.lastname}` : "Wait for response"}</td>
                                    <td>
                                        {res.confirmationStatus && (
                                            <Link to={url} className="btn btn-info m-2" variant="primary">&#x1F441;</Link>
                                        )}
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </Col>
        </Row>
    </>
}

export default RegisterRestaurant;