import { useContext, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { MyUserContext } from "../App";
import { useNavigate } from "react-router-dom";
import { authApi, endpoints } from "../configs/Apis";
import MySpinner from "../layout/MySpinner";
import { Alert } from "react-bootstrap";

const ChangePassword = () => {
    const [user,] = useContext(MyUserContext);
    const [newPassword, setNewPassword] = useState({
        "username": user.username,
        "password": "",
        "newPassword": "",
        "confirmNewpassword": "",
    })

    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState(null);

    const nav = useNavigate();

    const change = (evt, field) => {
        // setUser({...user, [field]: evt.target.value})
        setNewPassword(current => {
            return { ...current, [field]: evt.target.value }
        })
    }

    const changepassword = (evt) => {
        evt.preventDefault();

        const process = async () => {
            try {
                let form = new FormData();

                form.append("username", newPassword.username);
                form.append("password", newPassword.password);
                form.append("newPassword", newPassword.newPassword);

                setLoading(true);

                let res = await authApi().post(endpoints['change-password'], form);

                setLoading(false);
                if (res.status === 200) {
                    setErr("Đổi mật khẩu thành công!")
                    nav("/profile");
                } else
                    setErr("Hệ thống bị lỗi!");
                setLoading(false);
            } catch (err) {
                setErr(err.request.responseText);
                console.log(err.request.status);
                setLoading(false);
            }
        }
        if (user.newPassword === user.confirmNewpassword)
            process();
        else {
            setErr("Mật khẩu KHÔNG khớp!");
        }
    }


    return <>
        <h1 className="text-center text-info">Thay đổi mật khẩu</h1>
        {err === null ? "" : <Alert variant="danger">{err}</Alert>}
        <Form onSubmit={changepassword}>
            <Form.Group className="mb-3">
                <Form.Label>Nhập mật khẩu hiện tại: </Form.Label>
                <Form.Control type="text" onChange={(e) => change(e, "password")} placeholder="Mật khẩu hiện tại" required />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Nhập mật khẩu mới:</Form.Label>
                <Form.Control type="text" onChange={(e) => change(e, "newPassword")} placeholder="Mật khẩu mới" required />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label>Xác nhận mật khẩu mới:</Form.Label>
                <Form.Control type="text" onChange={(e) => change(e, "confirmNewpassword")} placeholder="Xác nhận mật khẩu mới" required />
            </Form.Group>
            <Form.Group className="mb-3">
                {loading === true ? <MySpinner /> : <Button variant="info" type="submit">Cập nhật</Button>}
            </Form.Group>
        </Form>
    </>
}

export default ChangePassword;