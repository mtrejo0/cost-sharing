import React, { useEffect } from "react";
import TextField from "@material-ui/core/TextField";
import { Autocomplete, AutocompleteRenderInputParams } from "@mui/material";
import { EventBus } from "../../event-bus/event-bus";

export default function Tags({
  selectedTags,
  autocompleteTags,
  defaultTags,
  ...other
}: {
  selectedTags: any;
  autocompleteTags?: string[];
  defaultTags?: string[];
  [x: string]: any;
}) {
  const [value, setValue] = React.useState<string[]>(defaultTags ?? []);

  useEffect(() => {
    selectedTags(value);
  }, [value, selectedTags]);

  useEffect(() => {
    EventBus.getInstance().register("clear-tags", () => {
      setValue([]);
    });
  }, [value, selectedTags]);

  const handleKeyDown = (event: any) => {
    switch (event.key) {
      case ",":
      case " ": {
        event.preventDefault();
        event.stopPropagation();
        if (event.target.value.length > 0) {
          setValue([...value, event.target.value]);
        }
        break;
      }
      default:
    }
  };
  return (
    <div {...other}>
      <Autocomplete
        multiple
        freeSolo
        id="tags-outlined"
        options={autocompleteTags ?? []}
        getOptionLabel={(option) => {
          if (typeof option === "string") {
            return option;
          }
          return "";
        }}
        value={value}
        onChange={(event, newValue) => setValue(newValue as string[])}
        filterSelectedOptions
        renderInput={(params: AutocompleteRenderInputParams) => {
          params.inputProps.onKeyDown = handleKeyDown;
          return (
            <TextField {...params} variant="outlined" label="Add Tags" />
          ) as React.ReactNode;
        }}
      />
    </div>
  );
}
