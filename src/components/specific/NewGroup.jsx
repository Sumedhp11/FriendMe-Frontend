import {
  Button,
  Dialog,
  DialogTitle,
  Skeleton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import UserItem from "../shared/UserItem";
import { useInputValidation } from "6pp";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useAvailableFriendsQuery,
  useNewGroupMutation,
} from "../../redux/api/api";
import { useAsyncMutations, useErrors } from "../../hooks/hook";
import { setIsNewGroup } from "../../redux/reducers/misc";
import toast from "react-hot-toast";

const NewGroup = () => {
  const dispatch = useDispatch();
  const { isNewGroup } = useSelector((store) => store.misc);
  const { isError, isLoading, error, data } = useAvailableFriendsQuery();
  const [newGroup, newGroupLoading] = useAsyncMutations(useNewGroupMutation);
  const [selectedmembers, setselectedmembers] = useState([]);

  const groupName = useInputValidation("");
  const selectMemberHandler = (id) => {
    setselectedmembers((prev) =>
      prev.includes(id)
        ? prev.filter((currentElement) => currentElement !== id)
        : [...prev, id]
    );
  };

  useErrors([{ isError, error }]);
  const submitHandler = () => {
    console.log(selectedmembers);
    if (!groupName.value) return toast.error("Group Name is Required");
    if (selectedmembers.length < 2)
      return toast.error("Please Select Atleast 3 Members ");
    newGroup("Creating New group...", {
      name: groupName.value,
      members: selectedmembers,
    });
    closeHandler();
  };
  const closeHandler = () => dispatch(setIsNewGroup(false));

  return (
    <Dialog open={isNewGroup} onClose={closeHandler}>
      <Stack p={{ xs: "1rem", sm: "3rem" }} width={"25rem"} spacing={"2rem"}>
        <DialogTitle textAlign={"center"} variant="h4">
          New Group
        </DialogTitle>
        <TextField
          label="Group Name"
          value={groupName.value}
          onChange={groupName.changeHandler}
        />
        <Typography variant="body1">Members</Typography>
        <Stack>
          {isLoading ? (
            <Skeleton />
          ) : (
            data?.friends?.map((user) => (
              <UserItem
                user={user}
                key={user._id}
                handler={selectMemberHandler}
                isAdded={selectedmembers.includes(user._id)}
              />
            ))
          )}
        </Stack>
        <Stack direction={"row"} justifyContent={"space-evenly"}>
          <Button
            variant="text"
            color="error"
            size="large"
            onClick={closeHandler}
          >
            Cancel
          </Button>
          <Button
            disabled={newGroupLoading}
            variant="contained"
            size="large"
            onClick={submitHandler}
          >
            Create
          </Button>
        </Stack>
      </Stack>
    </Dialog>
  );
};

export default NewGroup;
