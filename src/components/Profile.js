import { useContext, useRef, useState } from "react";
// import { MyUserContext } from "../App";
import cookie from "react-cookies";
import { Alert, Button, Card } from "react-bootstrap";
import { Form } from "react-bootstrap";
import { authApi, endpoints } from "../configs/Apis";
import { MyUserContext } from "../App";
import MySpinner from "../layout/MySpinner";
import { Link } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {

    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(null);
    const [current_user, dispatch] = useContext(MyUserContext);
    const avatar = useRef();
    const noti = (x) => toast(x);
    const [current_avatar, setCurrent_Avatar] = useState(current_user.avatar);
    const [user, setUser] = useState({
        "firstname": "",
        "lastname": "",
        "userId": current_user.userId,
        "username": current_user.username,
        "password": current_user.password,
        "email": "",
        "phonenumber": "",
        "location": "",
        "avatar": current_user.avatar
    })

    const updateUser = (evt) => {
        evt.preventDefault();

        const process = async () => {
            try {
                let form = new FormData();

                for (let field in user) {
                    if (field !== "avatar")
                        form.append(field, user[field]);
                    // console.log(user[field])
                }

                if (avatar.current.files[0] !== undefined) {
                    form.append("avatar", avatar.current.files[0]);
                } else {
                    form.append("avatar", new Blob());
                }

                setLoading(true);

                try {
                    let { data } = await authApi().post(endpoints['update-user'], form, {
                        headers: {
                            "Content-Type": "multipart/form-data",
                        },
                    });

                    let update_User = await authApi().get(endpoints['current-user'])
                    // console.log(user1.data);
                    // cookie.remove('user');
                    cookie.save('user', update_User.data);

                    dispatch({
                        "type": "login",
                        "payload": update_User.data
                    });

                    toast.success("Cập nhật thành công!")

                    // setUser(data);
                    setLoading(false);
                } catch (err) {
                    // if (err.request.responeText === "Cập nhật thành công!")
                    //     setErr("Cập nhật thành công");
                    // else if (err.request.responeText === "Số điện thoại đã được đăng ký!")
                    //     setErr("Số điện thoại đã được đăng ký!");
                    // else if (err.request.responeText === "Email đã được đăng ký!")
                    //     setErr("Email đã được đăng ký!");
                    // else
                    //     setErr("Có lỗi xảy ra!")
                    toast.error(err.request.responseText);
                    // console.log(err.request.status);
                    setLoading(false);
                }
            } catch (ex) {
                console.log(ex)
            }
        }

        process();
    }

    // const updateAvatar = (current_avatar) => {
    //     setCurrent_Avatar.current_avatar(current_avatar.current.files[0]);
    // }

    const change = (evt, field) => {
        // setUser({...user, [field]: evt.target.value})
        setUser(current => {
            return { ...current, [field]: evt.target.value }
        })
    }

    if (current_user === null) {
        return <h1><Alert variant="danger">Vui lòng <Link to="/login">đăng nhập</Link> giúp em</Alert></h1>
    }

    return <>
        <Form>
            <h1 className="text-success text-center">Trang cá nhân của {current_user.lastname}</h1>
            {/* {err === null ? "" : <Alert variant="danger">{err}</Alert>} */}
            <Card style={{ width: '18rem', marginLeft: 'auto', marginRight: 'auto' }} className="mt-0 mb-0">
                <Card.Img variant="top" src={current_user.avatar} style={{ width: "60%", marginLeft: 'auto', marginRight: 'auto' }} />
                <Card.Body>
                    <Card.Title>{current_user.firstname} {current_user.lastname}</Card.Title>
                    <Card.Text>
                        Ngày hôm nay của bạn thế nào...
                    </Card.Text>
                    <Form.Label>Chọn ảnh đại diện</Form.Label>
                    <Form.Control type="file" ref={avatar} />
                </Card.Body>
            </Card>
            <hr />
            <h2 className="text-info text-center">Thông tin chi tiết</h2>

            <Form.Group className="mb-3">
                <Form.Label>Tên</Form.Label>
                <Form.Control defaultValue={current_user.firstname} onChange={(e) => change(e, "firstname")} type="text" placeholder="Tên" required />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Họ và tên đệm</Form.Label>
                <Form.Control defaultValue={current_user.lastname} onChange={(e) => change(e, "lastname")} type="text" placeholder="Họ và tên đệm" required />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control defaultValue={current_user.email} onChange={(e) => change(e, "email")} type="email" placeholder="Email" required />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Điện thoại</Form.Label>
                <Form.Control defaultValue={current_user.phonenumber} onChange={(e) => change(e, "phonenumber")} type="tel" placeholder="Điện thoại" required />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Địa chỉ</Form.Label>
                <Form.Control defaultValue={current_user.location} onChange={(e) => change(e, "location")} type="text" placeholder="Địa chỉ" required />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Tên đăng nhập</Form.Label>
                <Form.Control defaultValue={current_user.username} readOnly onChange={(e) => change(e, "username")} type="text" placeholder="Tên đăng nhập" />
            </Form.Group>
            <Form.Group className="mb-3">
                {loading === true ? <MySpinner /> : <Button variant="info" onClick={updateUser}>Cập nhật</Button>}
            </Form.Group>
        </Form>
        <ToastContainer autoClose={3000} />
    </>
}

export default Profile;