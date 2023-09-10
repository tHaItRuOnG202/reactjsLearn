import { useContext, useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import Apis, { authApi, endpoints } from "../configs/Apis";
import cookie from "react-cookies";
import { MyUserContext } from "../App";
import { Navigate, useSearchParams } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
    const [user, dispatch] = useContext(MyUserContext)
    const [username, setUsername] = useState()
    const [password, setPassword] = useState()
    const [err, setErr] = useState(null);
    const [q] = useSearchParams();
    const noti = (x) => toast(x);

    const login = (evt) => {
        evt.preventDefault();

        const process = async () => {
            try {
                let res = await Apis.post(endpoints['login'], {
                    "username": username,
                    "password": password
                });

                // switch (res.status) {
                //     case 200:
                //         setErr("Đăng nhập thành công");
                //         break;
                //     case 400:
                //         switch (res.data) {
                //             case 'Mật khẩu không chính xác!':
                //                 setErr('Mật khẩu không chính xác!');
                //                 break;
                //             case 'Tài khoản không chính xác!':
                //                 setErr('Tài khoản không chính xác!');
                //                 break;
                //             default:
                //                 setErr('Có lỗi xảy ra!');
                //                 break;
                //         }
                //         break;
                //     default:
                //         setErr('Có lỗi xảy ra!');
                //         break;
                // };

                // if (res.status === 200)
                //     setErr("Đăng nhập thành công!");
                // else
                //     setErr("Có lỗi xảy ra!")

                cookie.save("token", res.data);

                let { data } = await authApi().get(endpoints['current-user']);
                cookie.save("user", data)

                console.info(res.data)

                dispatch({
                    "type": "login",
                    "payload": data
                });

                toast.success("Đăng nhập thành công!")
            } catch (err) {
                if (err.request.responseText === "Mật khẩu không chính xác!")
                    toast.warning("Mật khẩu không chính xác!")
                else if (err.request.responseText === "Tài khoản không chính xác!")
                    toast.warning("Tài khoản không chính xác!")
                else
                    toast.error("Có lỗi xảy ra!")
            }
        }

        process();
    }

    if (user !== null) {
        let next = q.get("next") || "/";
        return <Navigate to={next} />
    }

    return <>
        <h1 className="text-center text-info">ĐĂNG NHẬP NGƯỜI DÙNG</h1>
        <ToastContainer />
        <Form onSubmit={login}>
            {err === null ? "" : <Alert variant="danger">{err}</Alert>}
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Tên đăng nhập</Form.Label>
                <Form.Control value={username} onChange={e => setUsername(e.target.value)} type="text" placeholder="Nhập tên đăng nhập" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Form.Label>Mật khẩu</Form.Label>
                <Form.Control value={password} onChange={e => setPassword(e.target.value)} type="text" placeholder="Nhập mật khẩu" />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                <Button variant="info" type="submit">Đăng nhập</Button>
            </Form.Group>
        </Form>
    </>
}

export default Login;