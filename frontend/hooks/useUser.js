import Cookies from "js-cookie";

const useUser = () => {
    const cookieUser = Cookies.get('user');
    const user = cookieUser && JSON.parse(cookieUser);
    return user
}
export default useUser;