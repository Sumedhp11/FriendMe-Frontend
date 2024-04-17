/* eslint-disable react/prop-types */
/* eslint-disable react/display-name */
import {
  Avatar,
  Button,
  Dialog,
  DialogTitle,
  ListItem,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import { memo } from "react";
import { setIsNotification } from "../../redux/reducers/misc";
import {
  useAcceptFriendRequestMutation,
  useGetNotificationsQuery,
} from "../../redux/api/api";
import { useErrors } from "../../hooks/hook";
import { useDispatch, useSelector } from "react-redux";
import { transformImage } from "../../lib/Features";
import toast from "react-hot-toast";

const Notification = () => {
  const dispatch = useDispatch();
  const { isNotification } = useSelector((store) => store.misc);
  const { isLoading, data, error, isError } = useGetNotificationsQuery();

  const [acceptRequest] = useAcceptFriendRequestMutation();
  useErrors([{ error, isError }]);

  const closeHandler = () => dispatch(setIsNotification(false));
  const friendRequesthandler = async ({ _id, accept }) => {
    try {
      const res = await acceptRequest({ requestId: _id, accept });
      if (res?.data.success) {
        console.log("Use Socket here");
        toast.success(res?.data.success);
      } else {
        toast.error(res?.data?.message || "Something Went Wrong!");
      }
    } catch (error) {
      toast.error(error.message || "Something Went Wrong!");
    }
    dispatch(setIsNotification(false));
  };
  return (
    <Dialog open={isNotification} onClose={closeHandler}>
      <Stack p={{ xs: "1rem", sm: "2rem" }} maxWidth={"25rem"}>
        <DialogTitle>Notifications</DialogTitle>
        {isLoading ? (
          <Skeleton />
        ) : data?.allRequests.length > 0 ? (
          data?.allRequests.map((i) => (
            <NotificationItem
              key={i._id}
              sender={i.sender}
              _id={i._id}
              handler={friendRequesthandler}
            />
          ))
        ) : (
          <Typography textAlign={"center"}>No Notifications Found</Typography>
        )}
      </Stack>
    </Dialog>
  );
};

const NotificationItem = memo(({ sender, _id, handler }) => {
  const { name, avatar } = sender;
  return (
    <ListItem>
      <Stack
        direction={"row"}
        alignItems={"center"}
        spacing={"1rem"}
        width={"100%"}
      >
        <Avatar src={transformImage(avatar)} />
        <Typography
          variant="body1"
          sx={{
            flexGrow: 1,
            display: "-webkit-box",
            WebkitLineClamp: 1,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            textOverflow: "ellipsis",
            width: "100%",
          }}
        >
          {`${name} sent You a Request`}
        </Typography>
        <Stack
          direction={{
            xs: "column",
            sm: "row",
          }}
        >
          <Button onClick={() => handler({ _id, accept: true })}>Accept</Button>
          <Button color="error" onClick={() => handler({ _id, accept: false })}>
            Reject
          </Button>
        </Stack>
      </Stack>
    </ListItem>
  );
});

export default Notification;
