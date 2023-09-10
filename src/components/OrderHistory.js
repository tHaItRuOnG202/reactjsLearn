import { useContext, useEffect, useState } from "react";
import { Alert, Button, Col, Row, Table } from "react-bootstrap";
import { MyUserContext } from "../App";
import Apis, { authApi, endpoints } from "../configs/Apis";
import MySpinner from "../layout/MySpinner";

const OrderHistory = () => {
    const [user,] = useContext(MyUserContext);
    const [receipts, setReceipts] = useState([]);
    const [receiptDetails, setReceiptDetails] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadReceipts = async () => {
            try {
                setLoading(true);
                let e = `${endpoints['receipt']}?userId=${user.userId}`;
                let { data } = await authApi().get(e);
                setReceipts(data);
                // console.log(data);
                setLoading(false);
            } catch (err) {
                console.log(err);
            }
        };
        loadReceipts();
    }, [user.userId]);

    const loadReceiptDetails = async (receipts) => {
        try {
            setLoading(true);
            // let e = `${endpoints['receipt-details']}?receiptId=${receiptId}`;
            let { data } = await authApi().get(endpoints['receipt-details'](receipts));

            setReceiptDetails(data);
            console.log(data);
            setLoading(false);
        } catch (err) {
            console.log(err);
        }
    };

    // if (receipts.length === 0)
    //     return (
    //         <>
    //             <Alert variant="info" className="mt-2">
    //                 Chưa có đơn hàng nào!
    //             </Alert>
    //             <h1 className="text-center text-danger">
    //                 Muốn ăn gì alo &#x1F4F1; TuanHieu Restaurant lo!
    //             </h1>
    //         </>
    //     );

    return (
        <>
            <h1 className="text-center text-warning mb-2">LỊCH SỬ ĐẶT HÀNG</h1>
            <hr />
            {(receipts.length) === 0 ?
                <>
                    <Alert variant="info" className="mt-2">
                        Chưa có đơn hàng nào!
                    </Alert>
                    <h1 className="text-center text-danger">
                        Muốn ăn gì alo &#x1F4F1; TuanHieu Restaurant lo!
                    </h1>
                </> :
                <>
                    <Row>
                        <Col md={4} xs={6}>
                            <h4 className="text-center mb-2">Danh sách hóa đơn</h4>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Ngày đặt</th>
                                        <th>Tổng tiền</th>
                                        <th>Xem</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {receipts.map((r) => (
                                        <tr key={r.receiptId}>
                                            <td>{r.receiptId}</td>
                                            <td>{r.receiptDate}</td>
                                            <td>{r.totalPayment} VNĐ</td>
                                            <td>
                                                <Button
                                                    variant="warning"
                                                    onClick={() => loadReceiptDetails(r.receiptId)}
                                                >
                                                    &#x1F440;
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </Col>
                        <Col>
                            <h4 className="text-center mb-2">Chi tiết đơn hàng</h4>
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Tên món</th>
                                        <th>Số lượng</th>
                                        <th>Đơn giá</th>
                                        <th>Tổng tiền</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {receiptDetails === null ? (
                                        <>
                                            <MySpinner />
                                        </>
                                    ) : (
                                        <>
                                            {loading === true ? <>
                                                <span>Vui lòng đợi </span> <MySpinner />
                                            </> : <>
                                                {receiptDetails.map((d) => (
                                                    <tr key={d.receiptdetailId}>
                                                        <td>{d.receiptdetailId}</td>
                                                        <td>{d.fooditemId.foodName}</td>
                                                        <td>{d.quantity}</td>
                                                        <td>{d.unitPrice} VNĐ</td>
                                                        <td>{d.amount} VNĐ</td>
                                                    </tr>
                                                ))}
                                            </>}
                                        </>
                                    )}
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                </>
            }
        </>
    );
};

export default OrderHistory;