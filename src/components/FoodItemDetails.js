import { useContext, useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MySpinner from "../layout/MySpinner";
import Apis, { authApi, endpoints } from "../configs/Apis";
import { Button, Col, Form, Image, ListGroup, Row } from "react-bootstrap";
import Moment from "react-moment";
import { MyUserContext } from "../App";

const FoodItemDetails = () => {
    const [user,] = useContext(MyUserContext);
    const { foodId } = useParams();
    const [foodItems, setFoodItems] = useState(null)
    const [comment, setComment] = useState(null)
    const avatar = useRef();
    const [newComment, setNewComment] = useState({
        "foodId": "",
        "restaurantId": "",
        "comment": "",
        "avatar": ""
    })

    useEffect(() => {
        const loadFoodItems = async () => {
            try {
                let { data } = await Apis.get(endpoints['detail'](foodId));
                setFoodItems(data);

            } catch (err) {
                console.log(err);
            }
        }

        const loadComments = async () => {
            try {
                let { data } = await Apis.get(endpoints['comments'](foodId));
                setComment(data);

            } catch (err) {
                console.log(err);
            }
        }

        loadFoodItems();
        loadComments();
    }, [foodId]);

    // Lỗi xử lý avatar => đã fix
    const addComment = () => {
        const process = async () => {
            try {
                let form = new FormData();

                // console.log(newComment.comment);

                form.append("foodId", foodItems.foodId);
                form.append("restaurantId", foodItems.restaurantId.restaurantId);
                form.append("comment", newComment.comment);

                if (avatar.current.files[0] !== undefined) {
                    form.append("avatar", avatar.current.files[0]);
                } else {
                    form.append("avatar", new Blob());
                }

                try {
                    let { data } = await authApi().post(endpoints['add-comment'], form, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    });
                    setComment([...comment, data]);
                    // setLoading(false);
                } catch (ex) {
                    console.log(ex);
                }

                // let { data } = await authApi().post(endpoints['add-comment'], {
                //     "comment": content,
                //     "foodId": foodItems.foodId,
                // });
                // setComment(...comment, data);
            } catch (err) {
                console.log(err);
            }
        }
        process();
    }

    if (foodItems === null || comment === null)
        return <MySpinner />;

    let url = `/login?next=/fooddetails/${foodId}`

    return <>
        <h1 className="text-center text-info">CHI TIẾT SẢN PHẨM ({foodItems.foodName})</h1>
        <Row >
            <Col md={5} xs={6}>
                <Image src={foodItems.avatar} rounded fluid />
            </Col>
            <Col md={5} xs={6}>
                <h2>{foodItems.foodName}</h2>
                <p>{foodItems.description}</p>
                <h3>{foodItems.price} đ</h3>
            </Col>
        </Row>
        <hr />
        {user === null ? <p>Vui lòng <Link to={url}>đăng nhập</Link> để bình luận! </p> :
            <>  <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Label>Để lại bình luận của bạn</Form.Label>
                {/* <Form.Control as="textarea" aria-label="With textarea" value={newcomment} onChange={e => setNewcomment(e.target.value)} placeholder="Nội dung bình luận..." /> */}
                {/* <Form.Control as="textarea" aria-label="With textarea" value={newcomment.comment} onChange={e => setNewcomment(e.target.value)} placeholder="Nội dung bình luận" /> */}
                <Form.Control as="textarea" aria-label="With textarea" value={newComment.comment} onChange={e => setNewComment({ ...newComment, ["comment"]: e.target.value })} placeholder="Nội dung bình luận" />
                <Form.Control accept=".jpg, .jpeg, .png, .gif, .bmp" type="file" ref={avatar} />
                {/* <Form.Control type="file" ref={avatar} /> */}
            </Form.Group>
                <Button onClick={addComment} className="mt-2" variant="info">Bình luận</Button>  </>
        }
        <hr />
        <h2>Bình luận</h2>
        <ListGroup>
            {comment.map(c => (
                <ListGroup.Item id={c.id}>
                    <div>
                        <Image src={c.userId.avatar} roundedCircle />
                    </div>
                    <div>
                        {c.userId.firstname} {c.userId.lastname}
                    </div>
                    <Moment locale="vi" fromNow>{c.createdDate}</Moment>
                    <hr />
                    {c.comment}
                    <div>
                        <Image src={c.avatar} rounded fluid />
                    </div>
                </ListGroup.Item>
            ))}
        </ListGroup>
    </>
}

export default FoodItemDetails;