import { Alert, AlertColor, Snackbar } from "@mui/material";
import React, { useEffect, useState } from "react";
import { EventBus } from "../../event-bus/event-bus";

export type NotificationType = {
  text: string;
  severity: string;
};
const NotificationManager = () => {
  const [notification, setNotification] = useState<NotificationType>();

  const [open, setOpen] = React.useState(true);

  const handleClose = (
    event: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    EventBus.getInstance().register(
      "add-notification",
      (notification: NotificationType) => {
        setNotification(notification);
        setOpen(true);
      }
    );
  }, []);

  return (
    <>
      {notification?.text && (
        <Snackbar
          open={open}
          autoHideDuration={6000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
        >
          <Alert
            severity={notification?.severity as AlertColor}
            onClose={handleClose}
          >
            {notification?.text}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

export default NotificationManager;
