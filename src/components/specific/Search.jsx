import { useInputValidation } from "6pp";
import {
  Dialog,
  DialogTitle,
  InputAdornment,
  List,
  Stack,
  TextField,
} from "@mui/material";
import { Search as SearchIcon } from "@mui/icons-material";
import UserItem from "../shared/UserItem";
import { useEffect, useState } from "react";
import { sampleUsers } from "../../constants/sampleData";
import { useDispatch, useSelector } from "react-redux";
import { setIsSearch } from "../../redux/reducers/misc";
import {
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
} from "../../redux/api/api";

import { useAsyncMutations } from "../../hooks/hook";
import toast from "react-hot-toast";

const Search = () => {
  const { isSearch } = useSelector((state) => state.misc);
  const [searchUser] = useLazySearchUserQuery();

  const [sendFriendRequest, isLoadingSendFriendRequest] = useAsyncMutations(
    useSendFriendRequestMutation
  );
  const search = useInputValidation("");

  const dispatch = useDispatch();
  const addFriendHandler = async (id) => {
    await sendFriendRequest("Sending Friend Request", { userId: id });
  };

  const [users, setUsers] = useState([]);
  const searchClosehandler = () => dispatch(setIsSearch(false));

  useEffect(() => {
    const TimeoutId = setTimeout(() => {
      searchUser(search.value)
        .then(({ data }) => setUsers(data?.data))
        .catch(() => toast.error("Something went Wrong"));
    }, 1000);
    return () => clearTimeout(TimeoutId);
  }, [search.value, searchUser]);
  return (
    <Dialog open={isSearch} onClose={searchClosehandler}>
      <Stack p={"2rem"} direction={"column"} height={"25rem"} width={"25rem"}>
        <DialogTitle textAlign={"center"}>Find People</DialogTitle>
        <TextField
          label=""
          value={search.value || ""}
          onChange={search.changeHandler}
          variant="outlined"
          placeholder="Search Users.."
          size="small"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
        <List
          sx={{
            overflowY: "scroll",
          }}
        >
          {users.map((user) => (
            <UserItem
              user={user}
              key={user._id}
              handler={addFriendHandler}
              handlerIsLoading={isLoadingSendFriendRequest}
            />
          ))}
        </List>
      </Stack>
    </Dialog>
  );
};

export default Search;
