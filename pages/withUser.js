import axios from "axios";
import { Router } from "next/router";
import { API } from "../config";
import { getCookie } from "../helpers/auth";
const withUser = (Page) => {
  const withAuthUser = (props) => <Page {...props}></Page>;
  withAuthUser.getInitialProps = async (context) => {
    const token = getCookie("token", context.req);
    let user = null;
    if (token) {
      try {
        const response = await axios.get(`${API}/user`, {
          headers: {
            authorization: `Bearer ${token}`,
            contentType: "application/json",
          },
        });
        user = response.data;
      } catch (error) {
        if (error.response.status === 401) {
          user = null;
        }
      }
    }

    if (user === null) {
      console.log(context.res);
      context.res.writeHead(302, {
        Location: "/",
      });
      context.res.end();
    } else {
      return {
        ...(Page.getInitialProps ? await Page.getInitialProps(context) : {}),
        user,
        token,
      };
    }
  };
  return withAuthUser;
};
export default withUser;
