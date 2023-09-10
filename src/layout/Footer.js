import { Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import { FaFacebook } from "react-icons/fa"

const Footer = () => {
    return (<>
        <Alert variant="primary" className="mt-5">
            <Alert.Heading>QUỲNH NHƯ VÀ NHỮNG NGƯỜI BẠN</Alert.Heading>
            <p>
                <em>Nữ Hoàng Giao Diện from Đồng Tháp</em>
            </p>
            <hr />
            <p className="mb-0">
                &copy; NhuJS 26/07/2002 By Duong Huu Thanh
                <span>
                    <Link className="nav-link text-success" to="https://www.facebook.com/hnhuu.267"><FaFacebook />  Quỳnh Như UX/UI</Link>
                </span>
            </p>
        </Alert>
    </>)
}

export default Footer;