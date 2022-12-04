import { useState } from "react";
import {
  Button,
  Checkbox,
  FormControl,
  IconButton,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import {
  Add,
  Clear,
  Delete,
  RemoveCircle,
} from "@mui/icons-material";

interface Item {
  name: string;
  cost: number;
  people: string[];
}

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

  const [newPersonIndex, setNewPersonIndex] = useState(2);
  const [newItemIndex, setNewItemIndex] = useState(2);

  const personTotal = (name: string) => {
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

  const [names, setNames] = useState<string[]>(["Myself", "Person 1"]);

  const [items, setItems] = useState<Item[]>([initialItem]);

  const [total, setTotal] = useState(0)

  const itemsSubtotal = items.reduce((a, s) => a + s.cost, 0);

  const peopleSubtotal = names.reduce((a, s) => a + personTotal(s), 0).toFixed(2);
  const peopleSubtotalPlusTax = names
    .reduce((a, s) => a + ((total/itemsSubtotal - 1) * personTotal(s)), 0)
    .toFixed(2);

  const peopleSubtotalPlusTaxTip = names
  .reduce((a, s) => a + (total/itemsSubtotal * personTotal(s)), 0)
  .toFixed(2);


  const ITEM_HEIGHT = 48;
  const ITEM_PADDING_TOP = 8;
  const MenuProps = {
    PaperProps: {
      style: {
        maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
        width: 250,
      },
    },
  };

  return (
    <Stack sx={{ padding: "16px" }}>
      
        <p><b>1) Add people</b></p>
        <p style={{marginTop: "-8px"}}>List everyone who joined on the bill!</p>
      
      <Stack spacing={1}>
        {names.map((name, i) => (
          <Stack direction="row" spacing={1} alignItems="center">
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

                setItems((s) => s.map(each => {
                    
                    const copyState = {...each}
                    copyState.people = copyState.people.filter(p => p !== name)
                    return copyState
                  })
                )
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
      </Stack>

      
      <p><b>2) Add items</b> </p>
      <p style={{marginTop: "-8px"}}>Add each item from the bill and who joined for each item.  eg: pasta: moises, salad: marco, breadsticks: moises + marco</p>

      <Stack spacing={1}>
        {items.map((item, i) => (
          <Paper style={paperStyle} elevation={4}>
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
                <TextField
                  sx={inputStyle}
                  value={item.cost}
                  label="Item Cost"
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                  onChange={(e) => {
                    setItems((s) => {
                      const copyState = [...s];

                      copyState[i].cost = parseFloat(e.target.value);

                      return copyState;
                    });
                  }}
                ></TextField>

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
                <InputLabel id="demo-multiple-checkbox-label">
                  Who joined?
                </InputLabel>
                <Select
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
                </Select>
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

      <b><p>Subtotal: ${itemsSubtotal}</p></b>

      <b>
        <p>3) How much was the final bill (subtotal + tax + tip)?</p>
      </b>
      <Stack direction="row" spacing={gridSpacing}>
        <TextField
          sx={inputStyle}
          label="in $"
          value={total}
          type="number"
          InputProps={{ inputProps: { min: 0 } }}
          onChange={(e) => {
            const v = parseFloat(e.target.value ?? 0);
            setTotal(v);
          }}
        ></TextField>
      </Stack>

      <p><b>4) Breakdown</b> </p>
      <p style={{marginTop: "-8px"}}>Each person pays this amount: <code style={{color: "blue"}}>individual_items_total * (subtotal + tax + tip) / subtotal</code></p>

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
                ${((total/itemsSubtotal - 1) * personTotal(name)).toFixed(2)}
              </TableCell>
              <TableCell align="right">
                $
                {(
                  total/itemsSubtotal * personTotal(name)
                ).toFixed(2)}
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
            <TableCell align="right">
              ${peopleSubtotalPlusTaxTip}
            </TableCell>
          </TableRow>

          <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
            <TableCell component="th" scope="row">
              Expected
            </TableCell>
            <TableCell align="right">${itemsSubtotal.toFixed(2)}</TableCell>
            <TableCell align="right">${(total - itemsSubtotal).toFixed(2)}</TableCell>
            <TableCell align="right">
              $
              {(
                parseFloat(peopleSubtotalPlusTaxTip) - total
              ).toFixed(2)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Stack>
  );
}

export default App;
