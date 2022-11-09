import { FreeWrite } from "../../types/types";
import FreeWrites from "../../models/FreeWrites";
import {
  Box,
  Button,
  Card,
  Chip,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import { useEffect, useState } from "react";
import EditFreeWritesListItem from "./EditFreeWritesListItem";
import { EventBus } from "../../event-bus/event-bus";
import ConfirmActionModal from "../utils/ConfirmActionModal";
import { Cancel, RecordVoiceOver, Speaker } from "@mui/icons-material";

function FreeWritesListItem({ freeWrite }: { freeWrite: FreeWrite }) {
  const [edit, setEdit] = useState(false);

  const [speech, setSpeech] = useState<SpeechSynthesisUtterance>();

  useEffect(() => {
    EventBus.getInstance().register(`save-free-write-${freeWrite.id}`, () => {
      setEdit(false);
    });
  });

  const textToSpeech = () => {
    const msg = new SpeechSynthesisUtterance(freeWrite.text);
    window.speechSynthesis.speak(msg);

    setSpeech(msg);

    msg.addEventListener("end", (event) => {
      setSpeech(undefined);
    });
  };

  const cancelSpeech = () => {
    window.speechSynthesis.cancel();
    setSpeech(undefined);
  };

  return (
    <>
      {edit ? (
        <EditFreeWritesListItem freeWrite={freeWrite}></EditFreeWritesListItem>
      ) : (
        <Card sx={{ padding: "16px" }}>
          <Stack>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Stack direction="row">
                <Typography sx={{ padding: "16px" }}>
                  {freeWrite?.text}
                </Typography>
              </Stack>
              <Stack direction={{ xs: "column", md: "row" }} spacing={1}>
                <ConfirmActionModal
                  button={
                    <Tooltip title="Delete">
                      <Button
                        variant="contained"
                        color="error"
                        sx={{ height: "32px" }}
                      >
                        <DeleteIcon />
                      </Button>
                    </Tooltip>
                  }
                  callback={() => {
                    FreeWrites.delete(freeWrite!.id!);
                  }}
                />

                <Tooltip title="Edit">
                  <Button
                    onClick={() => setEdit(true)}
                    variant="contained"
                    sx={{ height: "32px" }}
                  >
                    <EditIcon />
                  </Button>
                </Tooltip>
                {speech === undefined ? (
                  <Tooltip title="Read out loud">
                    <Button
                      onClick={() => textToSpeech()}
                      variant="contained"
                      sx={{ height: "32px" }}
                    >
                      <RecordVoiceOver />
                    </Button>
                  </Tooltip>
                ) : (
                  <Tooltip title="Cancel Speech">
                    <Button
                      onClick={() => cancelSpeech()}
                      variant="contained"
                      sx={{ height: "32px" }}
                    >
                      <Cancel />
                    </Button>
                  </Tooltip>
                )}
              </Stack>
            </Box>
            <Stack direction="row">
              {freeWrite?.tags?.map((each, i) => (
                <Chip label={each} key={i} />
              ))}
            </Stack>
          </Stack>
        </Card>
      )}
    </>
  );
}
export default FreeWritesListItem;
