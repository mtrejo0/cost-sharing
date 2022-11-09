import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import { Stack } from "@mui/material";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { lg: 400, xs: "80%" },
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
};

export default function ConfirmActionModal(props: {
  button: React.ReactNode;
  callback: () => void;
}) {
  const { button, callback } = props;
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Box onClick={handleOpen}>{button}</Box>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Are you sure?
          </Typography>
          <Stack direction={"row"} spacing={2} sx={{ marginTop: "16px" }}>
            <Button
              variant="contained"
              onClick={() => {
                callback();
                handleClose();
              }}
            >
              Confirm
            </Button>
            <Button color="error" variant="contained" onClick={handleClose}>
              Cancel
            </Button>
          </Stack>
        </Box>
      </Modal>
    </div>
  );
}
