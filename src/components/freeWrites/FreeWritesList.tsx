import { Card, Stack, TextField, Typography } from "@mui/material";
import { onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import FreeWrites from "../../models/FreeWrites";
import { FreeWrite } from "../../types/types";
import FreeWritesListItem from "./FreeWritesListItem";
import { auth } from "../../config/firebase";
import AddFreeWrites from "./AddFreeWrites";
import Tags from "./TagsInput";

function FreeWritesList() {
  const [freeWrites, setFreeWrites] = useState<FreeWrite[]>([]);
  const [keyword, setKeyword] = useState<string>("");
  const [searchTags, setSearchTags] = useState<string[]>([]);

  useEffect(() => {
    if (!auth.currentUser || !auth.currentUser?.uid) return;
    const q = query(
      FreeWrites.freeWritesCollection,
      where("uid", "==", auth.currentUser?.uid)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      setFreeWrites(
        querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))
      );
    });
    return () => unsubscribe();
  }, [setFreeWrites]);

  const getDisplayFreeWrites = () => {
    let displayFreeWrites = freeWrites.filter((each) =>
      each.text.includes(keyword)
    );

    if (searchTags.length > 0)
      displayFreeWrites = displayFreeWrites.filter((each) =>
        each.tags.some((tag) => searchTags.includes(tag))
      );

    return displayFreeWrites;
  };

  const getPreviousTags = (): string[] => {
    const previousTags = new Set();

    freeWrites.forEach((each) => {
      each.tags.forEach((tag) => {
        previousTags.add(tag);
      });
    });

    return Array.from(previousTags) as string[];
  };

  return (
    <Stack spacing={1} sx={{ padding: "0 32px" }}>
      <AddFreeWrites autocompleteTags={getPreviousTags()} />
      <Card sx={{ padding: "16px" }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          spacing={1}
          alignItems="center"
        >
          <Typography minWidth={"100px"}>Sort By: </Typography>
          <TextField
            label="Keyword"
            value={keyword}
            onChange={(e: any) => setKeyword(e.target.value)}
            style={{ width: "100%" }}
          />
          <Tags
            selectedTags={(newTags: string[]) => {
              setSearchTags(newTags);
            }}
            autocompleteTags={getPreviousTags()}
            style={{ width: "100%" }}
          ></Tags>
        </Stack>
      </Card>

      <Typography variant="h5">My Free Writes:</Typography>

      {freeWrites.length === 0 ? (
        <Typography>You have no free writes add some!</Typography>
      ) : (
        getDisplayFreeWrites().length === 0 && (
          <Typography>This search has 0 results</Typography>
        )
      )}
      {getDisplayFreeWrites().map((each, i) => (
        <FreeWritesListItem key={i} freeWrite={each}></FreeWritesListItem>
      ))}
    </Stack>
  );
}
export default FreeWritesList;
