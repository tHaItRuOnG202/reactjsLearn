import { useContext, useState } from "react";
import { Alert, Button, Form, Table } from "react-bootstrap";
import cookie from "react-cookies";
import { Link } from "react-router-dom";
import { MyCartContext, MyUserContext } from "../App";
import { authApi, endpoints } from "../configs/Apis";
import MySpinner from "../layout/MySpinner";

const Cart = () => {

    const [loading, setLoading] = useState(false);
    const [carts, setCarts] = useState(cookie.load("cart") || null);
    const [user,] = useContext(MyUserContext);
    const [, cartDispatch] = useContext(MyCartContext);

    const updateItem = () => {
        cookie.save("cart", carts);

        cartDispatch({
            "type": "update",
            "payload": Object.values(carts).reduce((init, current) => init + current["quantity"], 0)
        })
    }

    const deleteItem = (item) => {
        cartDispatch({
            "type": "dec",
            "payload": item.quantity
        });

        if (item.foodId in carts) {
            setCarts(current => {
                delete current[item.foodId];
                cookie.save("cart", current);

                return current;
            });
        }
    }

    const pay = () => {
        const process = async () => {
            setLoading(true);
            let res = await authApi().post(endpoints['pay'], carts);
            if (res.status === 200) {
                console.log(carts);
                cookie.remove("cart");

                cartDispatch({
                    "type": "update",
                    "payload": 0
                });

                setCarts([]);
            }
            else {
                alert("Thanh toán thất bại!!!")
            }
        }
        process();
    }

    let regex = /^\d+$/;

    if (carts === null)
        return <Alert variant="info" className="mt-2">Không có sản phẩm trong giỏ!</Alert>


    if (carts.length === 0)
        return <Alert variant="success" className="mt-2">Thanh toán thành công!</Alert>

    return <>
        <h1 className="text-center text-info">Giỏ Hàng</h1>
        {carts === null ? <Alert variant="info" className="mt-2">Không có sản phẩm trong giỏ!</Alert> :
            <>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Tên sản phẩm</th>
                            <th>Đơn giá</th>
                            <th>Số lượng</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.values(carts).map(c => {
                            return <> <tr>
                                <td>{c.foodId}</td>
                                <td>{c.foodName}</td>
                                <td>{c.unitPrice}</td>
                                <td>{c.quantity} </td>
                                <td>
                                    <Form.Control type="number" value={carts[c.foodId]["quantity"]} onBlur={updateItem}
                                        onChange={(e) => setCarts({ ...carts, [c.foodId]: { ...carts[c.foodId], "quantity": parseInt(regex.test(e.target.value) === true ? e.target.value : 0) } })} />
                                </td>
                                <td>
                                    <Button variant="danger" onClick={() => deleteItem(c)}>&times;</Button>
                                </td>
                            </tr>
                            </>
                        })}
                    </tbody>
                </Table>
                {/* {console.log(user)} */}
                {user === null ? <p>Vui lòng <Link to="/login?next=/cart">đăng nhập</Link> để thanh toán! </p> :
                    <>  {loading === true ? <MySpinner /> : <Button variant="danger" onClick={pay} className="mt-2 mb-2">&#x1F4B2; Thanh toán</Button>} </>
                }
            </>}
    </>
}
export default Cart;