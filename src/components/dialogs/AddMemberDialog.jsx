import {
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutations, useErrors } from "../../hooks/hook";
import {
  useAddGroupMemberMutation,
  useAvailableFriendsQuery,
} from "../../redux/api/api";
import { setIsAddMember } from "../../redux/reducers/misc";
import UserItem from "../shared/UserItem";

const AddMemberDialog = ({ chatId }) => {
  const { isAddMember } = useSelector((store) => store.misc);
  const [addmember, addmemberIsLoading] = useAsyncMutations(
    useAddGroupMemberMutation
  );
  const { isLoading, data, error, isError } = useAvailableFriendsQuery(chatId);
  const dispatch = useDispatch();

  const [selectedmembers, setselectedmembers] = useState([]);
  const selectMemberHandler = (id) => {
    setselectedmembers((prev) =>
      prev.includes(id)
        ? prev.filter((currentElement) => currentElement !== id)
        : [...prev, id]
    );
  };
  const closehandler = () => {
    dispatch(setIsAddMember(false));
  };
  const addMemberSumbitHandler = () => {
    addmember("Adding Members...", { members: selectedmembers, chatId });
  };
  useErrors([{ isError, error }]);
  return (
    <Dialog open={isAddMember} onClose={closehandler}>
      <Stack p={"2rem"} width={"20rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"}>Add Member</DialogTitle>
        <Stack spacing={"1rem"}>
          {isLoading ? (
            <Skeleton />
          ) : data?.friends?.length > 0 ? (
            data?.friends?.map((i) => (
              <UserItem
                key={i._id}
                user={i}
                handler={selectMemberHandler}
                isAdded={selectedmembers.includes(i._id)}
              />
            ))
          ) : (
            <Typography textAlign={"center"}>No Friends Found</Typography>
          )}
        </Stack>
        <Stack
          direction={"row"}
          alignItems={"center"}
          justifyContent={"space-evenly"}
        >
          <Button color="error" onClick={closehandler}>
            Cancel
          </Button>
          <Button
            onClick={addMemberSumbitHandler}
            variant="contained"
            disabled={addmemberIsLoading}
          >
            Submit Changes
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default AddMemberDialog;
