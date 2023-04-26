import { useState } from "react";
import {
  Button,
  Checkbox,
  FormControl,
  IconButton,
  FormControlLabel,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  FormGroup,
} from "@mui/material";
import { Add, Clear, RemoveCircle } from "@mui/icons-material";
import CurrencyTextField from "@unicef/material-ui-currency-textfield";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const buttonStyle = { width: { md: "150px", xs: "100%" } };

const inputStyle = { width: { md: "150px", xs: "100%" } };

const paperStyle = { padding: "16px" };

const gridSpacing = 4;

function App() {
  const initialItem = {
    name: "Item 1",
    cost: 10.5,
    people: [],
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [newItemIndex, setNewItemIndex] = useState(2);

  const personTotal = (name) => {
    let sum = 0;
    items.forEach((each) => {
      if (each.people.includes(name)) {
        const n = each.people.length;
        const costPer = each.cost / n;
        sum += costPer;
      }
    });
    return sum;
  };

  const [names, setNames] = useState(["Myself", "Person 1"]);

  const [items, setItems] = useState([initialItem]);

  const [total, setTotal] = useState(0);

  const itemsSubtotal = items.reduce((a, s) => a + parseFloat(s.cost), 0);

  const peopleSubtotal = names
    .reduce((a, s) => a + personTotal(s), 0)
    .toFixed(2);
  const peopleSubtotalPlusTax = names
    .reduce((a, s) => a + (total / itemsSubtotal - 1) * personTotal(s), 0)
    .toFixed(2);

  const peopleSubtotalPlusTaxTip = names
    .reduce((a, s) => a + (total / itemsSubtotal) * personTotal(s), 0)
    .toFixed(2);



  return (
    <Stack sx={{ padding: "16px" }}>
      <p>
        <b>1) Add people</b>
      </p>
      <p style={{ marginTop: "-8px" }}>List everyone who joined on the bill! Separated by commas</p>

      <TextField multiline rows={2} sx={{width: isMobile ? "100%" : "50vw"}} onChange={(e) => {
          const newNames = e.target.value; 
          setNames(newNames.split(","))
      }} value={names.join(",")}/>



      {/* <Stack spacing={1}>
        {names.map((name, i) => (
          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            key={`name_${i}`}
          >
            <TextField
              sx={inputStyle}
              value={name}
              label="Person Name"
              onChange={(e) => {
                const newName = e.target.value;

                setNames((s) => {
                  const copyState = [...s];

                  copyState[i] = newName;

                  return copyState;
                });
              }}
              InputProps={{
                endAdornment: (
                  <IconButton
                    sx={{ visibility: name ? "visible" : "hidden" }}
                    onClick={() => {
                      setNames((s) => {
                        const copyState = [...s];

                        copyState[i] = "";

                        return copyState;
                      });
                    }}
                  >
                    <Clear />
                  </IconButton>
                ),
              }}
            ></TextField>

            <Button
              color="error"
              onClick={() => {
                setNames((s) => s.filter((_, j) => i !== j));

                setItems((s) =>
                  s.map((each) => {
                    const copyState = { ...each };
                    copyState.people = copyState.people.filter(
                      (p) => p !== name
                    );
                    return copyState;
                  })
                );
              }}
            >
              <Delete />
            </Button>
          </Stack>
        ))}

        <Button
          sx={buttonStyle}
          variant="outlined"
          startIcon={<Add />}
          onClick={() => {
            setNames((s) => {
              const newPerson = `Person ${newPersonIndex}`;
              return [...s, newPerson];
            });
            setNewPersonIndex((v) => v + 1);
          }}
        >
          Person
        </Button>
      </Stack> */}

      <p>
        <b>2) Add items</b>{" "}
      </p>
      <p style={{ marginTop: "-8px" }}>
        Add each item from the bill and who joined for each item. eg: pasta:
        moises, salad: marco, breadsticks: moises + marco
      </p>

      <Stack spacing={1}>
        {items.map((item, i) => (
          <Paper style={paperStyle} elevation={4} key={`item_${i}`}>
            <Stack spacing={1}>
              <Stack direction="row" spacing={1}>
                <TextField
                  sx={inputStyle}
                  value={item.name}
                  label="Item Name"
                  onChange={(e) => {
                    const newName = e.target.value;
                    setItems((s) => {
                      const copyState = [...s];

                      copyState[i].name = newName;

                      return copyState;
                    });
                  }}
                  InputProps={{
                    endAdornment: (
                      <IconButton
                        sx={{
                          visibility: item.name ? "visible" : "hidden",
                        }}
                        onClick={() => {
                          setItems((s) => {
                            const copyState = [...s];

                            copyState[i].name = "";

                            return copyState;
                          });
                        }}
                      >
                        <Clear />
                      </IconButton>
                    ),
                  }}
                ></TextField>
                <CurrencyTextField
                  style={{ width: isMobile ? "100%" : "150px" }}
                  label="Item Cost"
                  variant="outlined"
                  value={item.cost}
                  currencySymbol="$"
                  outputFormat="string"
                  onChange={(event, value) => {
                    setItems((s) => {
                      const copyState = [...s];

                      copyState[i].cost = value;

                      return copyState;
                    });
                  }}
                />

                <Button
                  color="error"
                  onClick={() => {
                    setItems((s) => s.filter((_, j) => i !== j));
                  }}
                >
                  <RemoveCircle />
                </Button>
              </Stack>

              <FormControl sx={{ width: { xs: "100%", md: 310 } }}>
                <p>Who joined?</p>

                <FormGroup row>
  {names.map((name) => (
    <FormControlLabel
      key={name}
      control={
        <Checkbox
          checked={item.people.includes(name)}
          onChange={(e) => {
            const checked = e.target.checked;

            setItems((s) => {
              const copyState = [...s];
              const index = copyState.findIndex((i) => i.id === item.id);
              const people = copyState[index].people;

              if (checked) {
                copyState[index].people = [...people, name];
              } else {
                copyState[index].people = people.filter((p) => p !== name);
              }

              return copyState;
            });
          }}
          name={name}
        />
      }
      label={name}
    />
  ))}
</FormGroup>

                {/* <Select
                  labelId="demo-multiple-checkbox-label"
                  id="demo-multiple-checkbox"
                  multiple
                  value={item.people}
                  error={item.people.length === 0}
                  onChange={(e) => {
                    const value = e.target.value;

                    const names =
                      typeof value === "string" ? value.split(",") : value;

                    setItems((s) => {
                      const copyState = [...s];

                      copyState[i].people = names;

                      return copyState;
                    });
                  }}
                  input={<OutlinedInput label="Who joined?" />}
                  renderValue={(selected) => selected.join(", ")}
                  MenuProps={MenuProps}
                >
                  {names.map((name) => (
                    <MenuItem key={name} value={name}>
                      <Checkbox checked={item.people.indexOf(name) > -1} />
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </Select> */}
              </FormControl>
            </Stack>
          </Paper>
        ))}
        <Button
          sx={buttonStyle}
          variant="outlined"
          startIcon={<Add />}
          onClick={() => {
            setItems((s) => {
              const newItem = {
                ...initialItem,
                name: `Item ${newItemIndex}`,
              };
              return [...s, newItem];
            });
            setNewItemIndex((s) => s + 1);
          }}
        >
          Item
        </Button>
      </Stack>

      <b>
        <p>Subtotal: ${itemsSubtotal}</p>
      </b>

      <b>
        <p>3) How much was the final bill (subtotal + tax + tip)?</p>
      </b>
      <Stack direction="row" spacing={gridSpacing}>
        <CurrencyTextField
          style={{ width: isMobile ? "100%" : "150px" }}
          label="Final Amount"
          variant="outlined"
          value={total}
          currencySymbol="$"
          outputFormat="string"
          onChange={(event, value) => {
            setTotal(value);
          }}
          error={total < itemsSubtotal}
        />
      </Stack>

      <p>
        <b>4) Breakdown</b>{" "}
      </p>
      <p style={{ marginTop: "-8px" }}>
        Each person pays this amount:{" "}
        <code style={{ color: "blue" }}>
          individual_items_total * (subtotal + tax + tip) / subtotal
        </code>
      </p>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Cost</TableCell>
            <TableCell align="right">Tax+Tip</TableCell>
            <TableCell align="right">Owes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {names.map((name) => (
            <TableRow
              key={name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {name}
              </TableCell>
              <TableCell align="right">
                ${personTotal(name).toFixed(2)}
              </TableCell>
              <TableCell align="right">
                ${((total / itemsSubtotal - 1) * personTotal(name)).toFixed(2)}
              </TableCell>
              <TableCell align="right">
                ${((total / itemsSubtotal) * personTotal(name)).toFixed(2)}
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
          </TableRow>
          <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
            <TableCell component="th" scope="row">
              Total
            </TableCell>
            <TableCell align="right">${peopleSubtotal}</TableCell>
            <TableCell align="right">${peopleSubtotalPlusTax}</TableCell>
            <TableCell align="right">${peopleSubtotalPlusTaxTip}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Stack>
  );
}

export default App;
