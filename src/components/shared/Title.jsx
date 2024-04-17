/* eslint-disable react/prop-types */

import { Helmet } from "react-helmet-async";

const Title = ({
  title = "Chat",
  description = "This is Chat App Called FriendMe",
}) => {
  return (
    <Helmet>
      <title>{title}</title>

      <meta name="description" content={description} />
    </Helmet>
  );
};

export default Title;
