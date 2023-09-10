import { useEffect, useState } from "react";
// import { MyUserContext } from "../App";
import Apis, { endpoints } from "../configs/Apis";
import { useParams } from "react-router-dom";
import { Form, Alert, Card } from "react-bootstrap";
import MySpinner from "../layout/MySpinner";

const RestaurantDetails = () => {
    const [loading, setLoading] = useState(false);
    const { restaurantId } = useParams();
    const [err, setErr] = useState(null);
    // const [current_user,] = useContext(MyUserContext);
    const [restaurant, setRestaurant] = useState(null)

    useEffect(() => {
        const loadRestaurant = async () => {
            try {
                let res = await Apis.get(endpoints['restaurant-detail'](restaurantId));

                console.log(res.data);
                setRestaurant(res.data);

            } catch (err) {
                console.log(err);
            }
        }
        loadRestaurant();
    }, [restaurantId])

    console.log(restaurant)

    return <>
        <h1 className="text-center text-success">THÔNG TIN NHÀ HÀNG</h1>
        {restaurant === null ? <MySpinner /> :
            <>
                <Form>
                    {/* <h1 className="text-success text-center">Nhà hàng của {current_user.lastname}</h1> */}
                    {err === null ? "" : <Alert variant="danger">{err}</Alert>}
                    <Card style={{ width: '18rem', marginLeft: 'auto', marginRight: 'auto' }} className="mt-0 mb-0">
                        <Card.Img variant="top" src={restaurant.avatar} />
                        <Card.Body>
                            <Card.Title>{restaurant.restaurantName}</Card.Title>
                        </Card.Body>
                    </Card>
                    <hr />
                    <h2 className="text-info text-center">Thông tin chi tiết</h2>

                    <Form.Group className="mb-3">
                        <Form.Label>Tên nhà hàng</Form.Label>
                        <Form.Control defaultValue={restaurant.restaurantName} readOnly type="text" placeholder="Tên nhà hàng" />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Địa chỉ</Form.Label>
                        <Form.Control defaultValue={restaurant.location} readOnly type="text" placeholder="Địa chỉ" />
                    </Form.Group>
                </Form>

            </>
        }

    </>
}

export default RestaurantDetails;