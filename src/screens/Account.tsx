import {
  Box,
  Button,
  Card,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ResponsiveAppBar from "../components/NavBar";

import { useNavigate } from "react-router-dom";
import { auth } from "../config/firebase";
import { signOut } from "firebase/auth";
import { defaultPrompts } from "../components/utils/fakeDb";
import { useFormik } from "formik";
import { onSnapshot, query, where } from "firebase/firestore";
import * as yup from "yup";
import { Prompt } from "../types/types";
import { useState, useEffect } from "react";
import Prompts from "../models/Prompts";
import { Delete } from "@mui/icons-material";

export const promptValidationSchema = yup.object({
  prompt: yup.string().required("Prompt is required"),
});

const Account = () => {
  const navigate = useNavigate();

  const [prompts, setPrompts] = useState<Prompt[]>();

  const logout = () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        console.error(error);
      });
  };

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
      prompt: "",
    },
    validationSchema: promptValidationSchema,
    onSubmit: (values: any) => {
      Prompts.add(values.prompt);
      formik.resetForm();
    },
  });

  return (
    <div>
      <ResponsiveAppBar></ResponsiveAppBar>
      <Box width="100%" display="flex" justifyContent={"flex-end"}>
        <Button onClick={logout} variant={"contained"} sx={{ margin: "16px" }}>
          Logout
        </Button>
      </Box>
      <Box sx={{ padding: "16px" }}>
        <form onSubmit={formik.handleSubmit}>
          <Stack direction="row" spacing={1}>
            <TextField
              id="prompt"
              label="Add a prompt"
              placeholder="Add a new prompt for your writing"
              sx={{ width: "300px" }}
              value={formik.values.prompt}
              onChange={formik.handleChange}
              error={formik.touched.prompt && Boolean(formik.errors.prompt)}
              helperText={formik.touched.prompt && formik.errors.prompt}
            ></TextField>
            <Button type={"submit"} variant="contained">
              Add Prompt
            </Button>
          </Stack>
        </form>
        <Typography variant={"h6"} sx={{ marginTop: "16px" }}>
          List of Prompts
        </Typography>
        <Stack spacing={1}>
          {prompts?.length === 0 && (
            <>
              <Typography>
                You have 0 prompts saved! Add a new prompt above.
              </Typography>
              <Typography>
                For now we will display the default prompts:{" "}
                <b>{defaultPrompts.map((each) => each.prompt).join(", ")}</b>
              </Typography>
            </>
          )}
          {prompts?.map((each, i) => (
            <Card sx={{ padding: "16px" }} key={i}>
              <Stack
                spacing={1}
                direction={"row"}
                justifyContent="space-between"
              >
                {each.prompt}
                <IconButton onClick={() => Prompts.delete(each.id ?? "")}>
                  <Delete></Delete>
                </IconButton>
              </Stack>
            </Card>
          ))}
        </Stack>
      </Box>
    </div>
  );
};

export default Account;
