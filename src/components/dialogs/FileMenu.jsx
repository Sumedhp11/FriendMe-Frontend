/* eslint-disable react/prop-types */
import { ListItemText, Menu, MenuItem, MenuList } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { setIsFileMenu, setUploadingLoader } from "../../redux/reducers/misc";
import {
  Image as ImageIcon,
  AudioFile as AudioFileIcon,
  VideoFile as VideoFileIcon,
  UploadFile as UploadFileIcon,
} from "@mui/icons-material";
import { useRef } from "react";
import toast from "react-hot-toast";
import { useSendAttachmentsMutation } from "../../redux/api/api";

const FileMenu = ({ anchorE1, chatId }) => {
  const dispatch = useDispatch();
  const ImageRef = useRef(null);
  const AudioRef = useRef(null);
  const VideoRef = useRef(null);
  const FileRef = useRef(null);

  const { isFileMenu } = useSelector((store) => store.misc);
  const [sendattachment] = useSendAttachmentsMutation();
  const selectRef = (ref) => {
    ref.current?.click();
  };
  const fileChangeHandler = async (e, key) => {
    const files = Array.from(e.target.files);
    if (files.length <= 0) return;

    if (files.length > 5)
      return toast.error(`You Can only Send 5 ${key} at A Time`);
    dispatch(setUploadingLoader(true));
    const toastId = toast.loading(`Sending ${key}...`);
    closeHandler();
    try {
      const myForm = new FormData();
      myForm.append("chatId", chatId);
      files.forEach((file) => myForm.append("files", file));
      const res = await sendattachment(myForm);
      if (res.data)
        toast.success(`${key} sent Successfully`, {
          id: toastId,
        });
      else {
        toast.error(`Failed to Send ${key}`, { id: toastId });
      }
    } catch (error) {
      toast.error(error, { id: toastId });
      dispatch(setUploadingLoader(false));
    }
  };

  const closeHandler = () => dispatch(setIsFileMenu(false));
  return (
    <Menu anchorEl={anchorE1} open={isFileMenu} onClose={closeHandler}>
      <div
        style={{
          width: "10rem",
        }}
      >
        <MenuList>
          <MenuItem onClick={() => selectRef(ImageRef)}>
            <ImageIcon />

            <ListItemText style={{ marginLeft: "0.5rem" }}>Image</ListItemText>
            <input
              type="file"
              multiple
              accept="image/png,image/jpg,image/jpeg,image/gif"
              style={{
                display: "none",
              }}
              onChange={(e) => fileChangeHandler(e, "Images")}
              ref={ImageRef}
            />
          </MenuItem>
          <MenuItem onClick={() => selectRef(AudioRef)}>
            <AudioFileIcon />
            <ListItemText style={{ marginLeft: "0.5rem" }}>Audio</ListItemText>
            <input
              type="file"
              multiple
              accept="audio/mpeg,audio/wav"
              style={{
                display: "none",
              }}
              onChange={(e) => fileChangeHandler(e, "Audios")}
              ref={AudioRef}
            />
          </MenuItem>

          <MenuItem onClick={() => selectRef(VideoRef)}>
            <VideoFileIcon />

            <ListItemText style={{ marginLeft: "0.5rem" }}>Video</ListItemText>
            <input
              type="file"
              multiple
              accept="video/mp4,video/webm,video/ogg"
              style={{
                display: "none",
              }}
              onChange={(e) => fileChangeHandler(e, "Videos")}
              ref={VideoRef}
            />
          </MenuItem>
          <MenuItem onClick={() => selectRef(FileRef)}>
            <UploadFileIcon />

            <ListItemText style={{ marginLeft: "0.5rem" }}>File</ListItemText>
            <input
              type="file"
              multiple
              accept="*"
              style={{
                display: "none",
              }}
              onChange={(e) => fileChangeHandler(e, "Files")}
              ref={FileRef}
            />
          </MenuItem>
        </MenuList>
      </div>
    </Menu>
  );
};

export default FileMenu;
