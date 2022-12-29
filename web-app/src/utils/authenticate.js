import axios from "axios";

const withAuth = (Component) => {
  const AuthRoute = () => {
    let isAuth = false;
    (async () => {
      await axios({
        method: "get",
        url: `${process.env.REACT_APP_API_URL}/auth/profile`,
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
        .then((res) => {
          isAuth = true;
          console.log(isAuth);
          return <Component show={true} />;
        })
        .catch((err) => {
          isAuth = false;
          return <Component show={false} />;
        });
    })();
  };

  return AuthRoute;
};

export default withAuth;
