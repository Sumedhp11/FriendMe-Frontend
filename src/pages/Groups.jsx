/* eslint-disable react/display-name */
/* eslint-disable react/prop-types */
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  Done as DoneIcon,
  Edit as EditIcon,
  KeyboardBackspace as KeyboardBackspaceIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import {
  Backdrop,
  Box,
  Button,
  CircularProgress,
  Drawer,
  Grid,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Suspense, lazy, memo, useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AvatarCard from "../components/shared/AvatarCard";
import { Link } from "../components/styles/StyledComponents";
import { bgGradient, mateBlack } from "../constants/color";
const ConfirmDeleteDialog = lazy(() =>
  import("../components/dialogs/ConfirmDeleteDialog")
);
const AddMemberDialog = lazy(() =>
  import("../components/dialogs/AddMemberDialog")
);

import { useDispatch, useSelector } from "react-redux";
import { LayoutLoader } from "../components/layout/Loaders";
import UserItem from "../components/shared/UserItem";
import { useAsyncMutations, useErrors } from "../hooks/hook";
import {
  useChatDetailsQuery,
  useDeleteChatMutation,
  useMyGroupsQuery,
  useRemoveGroupMemberMutation,
  useRenameGroupMutation,
} from "../redux/api/api";
import { setIsAddMember } from "../redux/reducers/misc";

const Groups = () => {
  const [isMobileOpen, setisMobileOpen] = useState(false);
  const dispatch = useDispatch();
  const chatId = useSearchParams()[0].get("group");
  const navigate = useNavigate();
  const { isAddMember } = useSelector((store) => store.misc);
  const navigateBack = () => {
    navigate("/");
  };

  const myGroups = useMyGroupsQuery();
  const groupDetails = useChatDetailsQuery(
    { chatId, populate: true },
    { skip: !chatId }
  );
  const [renameGroup, isLoadingGroupName] = useAsyncMutations(
    useRenameGroupMutation
  );
  const [removeGroupMember, isLoadingremoveGroup] = useAsyncMutations(
    useRemoveGroupMemberMutation
  );
  const [deleteChat] = useAsyncMutations(useDeleteChatMutation);

  const handleMobile = () => {
    setisMobileOpen((prev) => !prev);
  };
  const handleMobileClose = () => {
    setisMobileOpen(false);
  };
  const [members, setMembers] = useState([]);
  const [groupname, setgroupName] = useState("");
  const [groupNameupdated, setgroupNameupdated] = useState("");
  const [confirmDeleteDialog, setconfirmDeleteDialog] = useState(false);

  useErrors([
    { isError: myGroups.isError, error: myGroups.error },
    { isError: groupDetails.isError, error: groupDetails.error },
  ]);

  useEffect(() => {
    if (groupDetails.data) {
      setgroupName(groupDetails.data.chat.name);
      setgroupNameupdated(groupDetails.data.chat.name);
      setMembers(groupDetails.data.chat.members);
    }
    () => {
      setgroupName("");
      setgroupNameupdated("");
      setMembers([]);
      setisEdit(false);
    };
  }, [groupDetails.data]);
  const updateGroupNamehandler = () => {
    setisEdit(false);
    renameGroup("Updating group Name", { chatId, name: groupNameupdated });
  };
  const openconfirmDeletehandler = () => {
    setconfirmDeleteDialog(true);
  };
  const closeconfirmDeletehandler = () => {
    setconfirmDeleteDialog(false);
  };

  const openAddMemberhandler = () => dispatch(setIsAddMember(true));
  const deleteHandler = () => {
    deleteChat("Deleting Group...", chatId);
    closeconfirmDeletehandler();
    navigate("/");
  };
  // useEffect(() => {
  //   if (chatId) {
  //     setgroupName("Group Name" + chatId);
  //     setgroupNameupdated("Group Name" + chatId);
  //   }
  //   return () => {
  //     setgroupName("");
  //     setgroupNameupdated("");
  //     setisEdit(false);
  //   };
  // }, [chatId]);
  const removeMemberHandler = (userId) => {
    removeGroupMember("Removing Member", { chatId, userId });
  };
  const IconBtns = (
    <>
      <Box
        sx={{
          display: {
            xs: "block",
            sm: "none",
            position: "fixed",
            right: "1rem",
            top: "1rem",
          },
        }}
      >
        <Tooltip title="menu">
          <IconButton onClick={handleMobile}>
            <MenuIcon />
          </IconButton>
        </Tooltip>
      </Box>
      <Tooltip title="back">
        <IconButton
          sx={{
            position: "absolute",
            top: "2rem",
            left: "2rem",
            bgcolor: mateBlack,
            color: "white",
            ":hover": {
              bgcolor: "rgba(0,0,0,0.7)",
            },
          }}
          onClick={navigateBack}
        >
          <KeyboardBackspaceIcon />
        </IconButton>
      </Tooltip>
    </>
  );

  const ButtonGroup = (
    <Stack
      direction={{
        sm: "row",
        xs: "column-reverse",
      }}
      spacing={"1rem"}
      p={{
        xs: "0",
        sm: "1rem",
        md: "1rem 4rem",
      }}
    >
      <Button
        size="large"
        color="error"
        startIcon={<DeleteIcon />}
        onClick={openconfirmDeletehandler}
      >
        Delete Group
      </Button>
      <Button
        size="large"
        variant="contained"
        startIcon={<AddIcon />}
        onClick={openAddMemberhandler}
      >
        Add Member
      </Button>
    </Stack>
  );
  const [isEdit, setisEdit] = useState(false);
  const GroupName = (
    <Stack
      direction={"row"}
      alignContent={"center"}
      justifyContent={"center"}
      spacing={"1rem"}
      padding={"3rem"}
    >
      {isEdit ? (
        <>
          <TextField
            value={groupNameupdated}
            onChange={(e) => setgroupNameupdated(e.target.value)}
          />
          <IconButton
            onClick={updateGroupNamehandler}
            disabled={isLoadingGroupName}
          >
            <DoneIcon />
          </IconButton>
        </>
      ) : (
        <>
          <Typography variant="h4">{groupname}</Typography>
          <IconButton onClick={() => setisEdit(true)}>
            <EditIcon />
          </IconButton>
        </>
      )}
    </Stack>
  );

  return myGroups.isLoading ? (
    <LayoutLoader />
  ) : (
    <Grid container height={"100vh"}>
      <Grid
        item
        sm={4}
        sx={{
          display: {
            xs: "none",
            sm: "block",
            overflow: "auto",
          },
        }}
      >
        <GroupsList myGroups={myGroups.data?.chat} chatId={chatId} />
      </Grid>
      <Grid
        item
        xs={12}
        sm={8}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          position: "relative",
          padding: "1rem 3rem",
        }}
      >
        {IconBtns}

        {groupname && (
          <>
            {GroupName}
            <Typography
              margin={"2rem"}
              alignSelf={"flex-start"}
              variant="body1"
            >
              Members
            </Typography>
            <Stack
              maxWidth={"45rem"}
              width={"100%"}
              boxSizing={"border-box"}
              padding={{
                sm: "1rem",
                xs: "0",
                md: "1rem 4rem",
              }}
              spacing={"2rem"}
              bgcolor={"bisque"}
              height={"50vh"}
              overflow={"auto"}
            >
              {isLoadingremoveGroup ? (
                <CircularProgress />
              ) : (
                members.map((i) => (
                  <UserItem
                    key={i._id}
                    user={i}
                    isAdded
                    styling={{
                      boxShadow: "0 0 0.5rem rgba(0,0,0,0.2)",
                      padding: "1rem 2rem",
                      borderRadius: "1rem",
                    }}
                    handler={() => removeMemberHandler(i._id)}
                  />
                ))
              )}
            </Stack>
            {ButtonGroup}
          </>
        )}
      </Grid>

      {isAddMember && (
        <Suspense fallback={<Backdrop open />}>
          <AddMemberDialog chatId={chatId} />
        </Suspense>
      )}
      {confirmDeleteDialog && (
        <Suspense fallback={<Backdrop open />}>
          <ConfirmDeleteDialog
            open={confirmDeleteDialog}
            handleClose={closeconfirmDeletehandler}
            deleteHandler={deleteHandler}
          />
        </Suspense>
      )}
      <Drawer
        sx={{
          display: {
            xs: "block",
            sm: "none",
          },
        }}
        open={isMobileOpen}
        onClose={handleMobileClose}
      >
        <GroupsList myGroups={myGroups.data?.chat} w={"50%"} chatId={chatId} />
      </Drawer>
    </Grid>
  );
};

const GroupsList = ({ w = "100%", myGroups = [], chatId }) => (
  <Stack
    width={w}
    sx={{
      backgroundImage: bgGradient,
      height: "100vh",
      overflow: "auto",
    }}
  >
    {myGroups.length > 0 ? (
      myGroups.map((group) => {
        return <GroupListItem group={group} chatId={chatId} key={group._id} />;
      })
    ) : (
      <Typography textAlign={"center"} padding={"1rem"}>
        No Groups
      </Typography>
    )}
  </Stack>
);

const GroupListItem = memo(({ group, chatId }) => {
  const { name, avatar, _id } = group;

  return (
    <Link
      to={`?group=${_id}`}
      onClick={(e) => {
        if (chatId === _id) e.preventDefault();
      }}
    >
      <Stack direction={"row"} spacing={"1rem"} alignItems={"center"}>
        <AvatarCard avatar={avatar} />
        <Typography>{name}</Typography>
      </Stack>
    </Link>
  );
});

export default Groups;
