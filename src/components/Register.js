import { useContext, useRef, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import MySpinner from "../layout/MySpinner";
import Apis, { endpoints } from "../configs/Apis";
import { Navigate, useNavigate } from "react-router-dom";
import { MyUserContext } from "../App";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {

    const [loading, setLoading] = useState(false);
    const [current_user,] = useContext(MyUserContext);
    const noti = (x) => toast(x);
    const avatar = useRef();
    const nav = useNavigate();
    const [err, setErr] = useState(null);
    const [user, setUser] = useState({
        "username": "",
        "password": "",
        "firstname": "",
        "lastname": "",
        "email": "",
        "phonenumber": "",
        "confirmPass": "",
        "avatar": ""
    });

    if (current_user !== null) {
        return <Navigate to="/" />
    }

    const change = (evt, field) => {
        // setUser({...user, [field]: evt.target.value})
        setUser(current => {
            return { ...current, [field]: evt.target.value }
        })
    }

    const register = (evt) => {
        evt.preventDefault();

        const process = async () => {
            let form = new FormData();

            for (let field in user)
                if (field !== "confirmPass" || field !== "avatar")
                    form.append(field, user[field]);


            if (avatar.current.files[0] !== undefined)
                form.append("avatar", avatar.current.files[0]);

            setLoading(true);

            let res = await Apis.post(endpoints['register'], form);
            if (res.status === 201) {
                toast.success("Đăng ký thành công")
                nav("/login");
            } else
                toast.error("Hệ thống bị lỗi!");
        }
        if (user.password === user.confirmPass)
            process();
        else {
            toast.error("Mật khẩu KHÔNG khớp!");
        }
    }

    return <>
        <h1 className="text-center text-success">ĐĂNG KÝ NGƯỜI DÙNG</h1>
        <ToastContainer />

        {/* {err === null ? "" : <Alert variant="danger">{err}</Alert>} */}
        <Form onSubmit={register}>
            <Form.Group className="mb-3">
                <Form.Label>Tên</Form.Label>
                <Form.Control type="text" onChange={(e) => change(e, "firstname")} placeholder="Tên" required />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Họ và tên đệm</Form.Label>
                <Form.Control type="text" onChange={(e) => change(e, "lastname")} placeholder="Họ và tên đệm" required />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" onChange={(e) => change(e, "email")} placeholder="Email" />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Điện thoại</Form.Label>
                <Form.Control type="tel" required onChange={(e) => change(e, "phonenumber")} placeholder="Điện thoại" />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Tên đăng nhập</Form.Label>
                <Form.Control value={user.username} required onChange={(e) => change(e, "username")} type="text" placeholder="Tên đăng nhập" />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Mật khẩu</Form.Label>
                <Form.Control value={user.passWord} required onChange={(e) => change(e, "password")} type="password" placeholder="Mật khẩu" />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Xác nhận mật khẩu</Form.Label>
                <Form.Control value={user.confirmPass} required onChange={(e) => change(e, "confirmPass")} type="password" placeholder="Xác nhận mật khẩu" />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Ảnh đại diện</Form.Label>
                <Form.Control type="file" ref={avatar} />
            </Form.Group>
            <Form.Group className="mb-3">
                {loading === true ? <MySpinner /> : <Button variant="info" type="submit">Đăng ký</Button>}
            </Form.Group>
        </Form>
    </>
}
export default Register;