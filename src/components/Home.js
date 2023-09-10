import { useContext, useEffect, useState } from "react";
import MySpinner from "../layout/MySpinner";
import Apis, { endpoints } from "../configs/Apis";
import { Alert, Button, Card, Col, Row, Carousel } from "react-bootstrap";
import { Link, useSearchParams } from "react-router-dom";
import { MyCartContext } from "../App";
import cookie from "react-cookies";

const Home = () => {
    const [foodItems, setFoodItems] = useState(null)
    const [restaurant, setRestaurant] = useState(null)
    const [, cartDispatch] = useContext(MyCartContext);

    const [q] = useSearchParams()

    useEffect(() => {
        const loadFoodItems = async () => {
            try {
                let e = endpoints['foodItems'];
                let kw = q.get('kw');

                if (kw !== null)
                    e = `${e}?kw=${kw}`

                let res = await Apis.get(e)
                setFoodItems(res.data)
            } catch (ex) {
                console.error(ex)
            }
        }

        const loadRestaurant = async () => {
            try {
                let e = endpoints['restaurant'];
                let kw = q.get('kw');

                if (kw !== null)
                    e = `${e}?kw=${kw}`

                let res = await Apis.get(e)
                setRestaurant(res.data)
            } catch (ex) {
                console.error(ex)
            }
        }

        loadFoodItems();
        loadRestaurant();
    }, [q])


    const order = (foodItems) => {
        cartDispatch({
            "type": "inc",
            "payload": 1
        })

        let cart = cookie.load("cart") || null;
        if (cart == null)
            cart = {};

        if (foodItems.foodId in cart) {
            cart[foodItems.foodId]["quantity"] += 1;
        } else {
            cart[foodItems.foodId] = {
                "foodId": foodItems.foodId,
                "foodName": foodItems.foodName,
                "quantity": 1,
                "unitPrice": foodItems.price
            }
        }

        cookie.save("cart", cart);
    }

    if (foodItems === null)
        return <MySpinner />

    if (foodItems.length === 0)
        return <Alert variant="info" className="mt-2">Không có sản phẩm nào!</Alert>

    return (
        <>
            <div>
                <Carousel data-bs-theme="dark" className="carousel_edit">
                    {restaurant.map(r => {
                        let url = `/restaurant_detail/${r.restaurantId}`
                        return <Carousel.Item className="carosel_item">
                            <h1 className="text-center text-danger">{r.restaurantName}</h1>
                            <Link to={url}>
                                <img style={{ marginLeft: 'auto', marginRight: 'auto' }}
                                    className="d-block w-70"
                                    src={r.avatar}
                                    alt={r.restaurantName}
                                /></Link>
                            <Carousel.Caption style={{ width: "30%", background: "black", marginLeft: 'auto', marginRight: 'auto' }}>
                                <div style={{ color: "white" }}>
                                    <h5>{r.restaurantName}</h5>
                                    <p>{r.location}</p>
                                </div>
                            </Carousel.Caption>
                        </Carousel.Item>
                    })}
                </Carousel>
            </div>
            <h1 className="text-center text-info">Danh mục sản phẩm</h1>
            <Row>
                {foodItems.map(f => {
                    let url = `/fooddetails/${f.foodId}`;
                    return <Col xs={12} md={3} className="mt-1 mb-1">
                        <Card style={{ width: '18rem' }}>
                            <Card.Img variant="top" src={f.avatar} />
                            <Card.Body>
                                <Card.Title>{f.foodName}</Card.Title>
                                <Card.Text>{f.price} VNĐ</Card.Text>
                                <Link to={url} className="btn btn-info m-2" variant="primary">Xem chi tiết</Link>
                                <Button variant="success" onClick={() => { order(f) }}>Thêm vào giỏ</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                })}

            </Row>
        </>
    )
}

export default Home;