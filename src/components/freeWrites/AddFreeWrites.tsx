import React, { useEffect, useState } from "react";
import TextField from "@material-ui/core/TextField";
import FreeWrites from "../../models/FreeWrites";
import {
  Button,
  Card,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { EventBus } from "../../event-bus/event-bus";
import Center from "../utils/Center";
import { useFormik } from "formik";
import * as yup from "yup";
import { NotificationType } from "../utils/NotificationManager";
import Tags from "./TagsInput";
import { Refresh } from "@mui/icons-material";
import { defaultPrompts } from "../utils/fakeDb";
import { Prompt } from "../../types/types";
import { query, where, onSnapshot } from "firebase/firestore";
import { auth } from "../../config/firebase";
import Prompts from "../../models/Prompts";
import Countdown from "../utils/Countdown";

export const textValidationSchema = yup.object({
  text: yup.string().required("Free Write is required"),
});

function AddFreeWrites({ ...props }) {
  const { autocompleteTags } = props;

  const [tags, setTags] = useState<string[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const getRandomPrompt = (currentPrompt?: Prompt) => {
    const promptsList: Prompt[] =
      prompts.length > 0 ? prompts : (defaultPrompts as unknown as Prompt[]);
    const temp: Prompt[] = promptsList?.filter(
      (each) => each !== currentPrompt
    );
    return temp[Math.floor(Math.random() * temp.length)];
  };
  const [prompt, setPrompt] = useState<Prompt>(getRandomPrompt());

  useEffect(() => {
    if (!auth.currentUser || !auth.currentUser?.uid) return;
    const q = query(
      Prompts.promptsCollection,
      where("uid", "==", auth.currentUser?.uid)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setPrompts(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });
    return () => unsubscribe();
  }, [setPrompts]);

  const formik = useFormik({
    initialValues: {
      text: "",
    },
    validationSchema: textValidationSchema,
    onSubmit: (values: any) => {
      FreeWrites.add(formik.values.text, tags);
      formik.resetForm();
      setTags([]);
      EventBus.getInstance().dispatch<string>("clear-tags");

      EventBus.getInstance().dispatch<NotificationType>("add-notification", {
        text: "Succesfully added free write!",
        severity: "success",
      });
    },
  });

  useEffect(() => {
    EventBus.getInstance().register("update-tags", (tags: string[]) => {
      setTags(tags);
    });
  }, []);

  return (
    <Center height={"fit-content"}>
      <Card
        sx={{
          padding: "8px",
          margin: "8px",
          width: { xs: "80vw", md: "50vw" },
        }}
      >
        <Stack style={{ width: "100%" }} spacing={1}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent={"space-between"}
          >
            <Stack direction={"row"} spacing={1} alignItems="center">
              <Tooltip title="Get new prompt">
                <IconButton onClick={() => setPrompt(getRandomPrompt(prompt))}>
                  <Refresh />
                </IconButton>
              </Tooltip>
              <Typography>Prompt: {prompt?.prompt}</Typography>
            </Stack>
            <Countdown />
          </Stack>

          <TextField
            id="text"
            label="Free Write"
            placeholder="Start a timer and write until it stops! You should not stop writing and you should write everything you can think of. If you cannot think of anything to write then write 'blah blah blah blah' or anything else!"
            style={{ textAlign: "left" }}
            multiline
            minRows={4}
            variant="outlined"
            value={formik.values.text}
            onChange={formik.handleChange}
            error={formik.touched.text && Boolean(formik.errors.text)}
            helperText={formik.touched.text && formik.errors.text}
          />
          <Tags
            selectedTags={(newTags: string[]) => {
              setTags(newTags);
            }}
            autocompleteTags={[prompt?.prompt, ...autocompleteTags]}
          ></Tags>
          <Button
            variant="contained"
            type="submit"
            sx={{ marginTop: "8px" }}
            onClick={() => formik.handleSubmit()}
          >
            Save Free Write
          </Button>
        </Stack>
      </Card>
    </Center>
  );
}
export default AddFreeWrites;
