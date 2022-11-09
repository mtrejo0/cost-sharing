import { FreeWrite } from "../../types/types";
import FreeWrites from "../../models/FreeWrites";
import { Box, Button, Card, Stack, TextField, Tooltip } from "@mui/material";

import { useEffect, useState } from "react";
import { EventBus } from "../../event-bus/event-bus";

import SaveIcon from "@mui/icons-material/Save";
import TagsInput from "./TagsInput";
import { textValidationSchema } from "./AddFreeWrites";

import { useFormik } from "formik";

function EditFreeWritesListItem({ freeWrite }: { freeWrite: FreeWrite }) {
  const [newTags, setNewTags] = useState(freeWrite.tags);

  const formik = useFormik({
    initialValues: {
      text: freeWrite.text,
    },
    validationSchema: textValidationSchema,
    onSubmit: (values: any) => {
      EventBus.getInstance().dispatch<string[]>(
        `save-free-write-${freeWrite.id}`
      );
      FreeWrites.update(freeWrite, {
        task: formik.values.text,
        tags: newTags,
      });
    },
  });

  useEffect(() => {
    EventBus.getInstance().register(
      `save-free-write-${freeWrite.id}`,
      () => {}
    );
  });

  return (
    <Card sx={{ padding: "16px" }}>
      <Stack>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Stack sx={{ width: { sm: "100%", md: "500px" } }} spacing={1}>
            <TextField
              id="text"
              style={{ textAlign: "left" }}
              multiline
              minRows={4}
              value={formik.values.text}
              onChange={formik.handleChange}
              error={formik.touched.text && Boolean(formik.errors.text)}
              helperText={formik.touched.text && formik.errors.text}
            ></TextField>
            <TagsInput
              placeholder="Edit Tags"
              defaultTags={freeWrite.tags}
              selectedTags={(tags: string[]) => setNewTags(tags)}
              style={{ width: "100%" }}
              variant={"outlined"}
            />
          </Stack>
          <Tooltip title="Save">
            <Button
              type="submit"
              variant="contained"
              sx={{ height: "32px" }}
              onClick={() => formik.handleSubmit()}
            >
              <SaveIcon />
            </Button>
          </Tooltip>
        </Box>
      </Stack>
    </Card>
  );
}
export default EditFreeWritesListItem;
