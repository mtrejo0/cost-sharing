import { useState } from "react";
import {
  Button,
  Checkbox,
  FormControl,
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
import { Add, Delete } from "@mui/icons-material";
import CurrencyTextField from "@unicef/material-ui-currency-textfield";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";

const buttonStyle = { width: { md: "150px", xs: "100%" } };

const inputStyle = { width: { md: "150px", xs: "100%" } };

const paperStyle = { padding: "16px" };

const gridSpacing = 4;

function App() {
  const initialItem = {
    name: "",
    cost: 0,
    people: [],
  };

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [names, setNames] = useState(["Me", "You"]);

  const [items, setItems] = useState([
    { ...initialItem, people: ["Me"] },
    { ...initialItem, people: ["You"] },
  ]);

  const [total, setTotal] = useState(0);

  const itemsSubtotal = items.reduce((a, s) => a + parseFloat(s.cost), 0);

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

  const peopleSubtotal = names
    .reduce((a, s) => a + personTotal(s), 0)
    .toFixed(2);
  const peopleSubtotalPlusTax = names
    .reduce((a, s) => a + (total / itemsSubtotal - 1) * personTotal(s), 0)
    .toFixed(2);

  const peopleSubtotalPlusTaxTip = names
    .reduce((a, s) => a + (total / itemsSubtotal) * personTotal(s), 0)
    .toFixed(2);

  const handleChange = (itemIndex, name) => (e) => {
    const checked = e.target.checked;

    setItems((s) => {
      const copyState = [...s];
      const people = copyState[itemIndex].people;

      if (checked) {
        copyState[itemIndex].people = [...people, name];
      } else {
        copyState[itemIndex].people = people.filter((p) => p !== name);
      }

      return copyState;
    });
  };

  return (
    <Stack sx={{ padding: "16px" }}>
      <p>
        <b>1) List people</b>
      </p>
      <p style={{ marginTop: "-8px" }}>
        List everyone who joined on the bill! Separated by commas
      </p>

      <TextField
        multiline
        rows={2}
        sx={{ width: isMobile ? "100%" : "50vw" }}
        onChange={(e) => {
          const newNames = e.target.value;
          setNames(newNames.split(","));
        }}
        value={names.join(",")}
      />

      <p>
        <b>2) List items</b>{" "}
      </p>
      <p style={{ marginTop: "-8px" }}>
        Add each item from the bill and check who joined for each item
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
                  <Delete />
                </Button>
              </Stack>

              <FormControl sx={{ width: { xs: "100%", md: 310 } }}>
                <FormGroup row>
                  {names.map((name) => (
                    <FormControlLabel
                      key={name}
                      control={
                        <Checkbox
                          checked={items[i].people.includes(name)}
                          onChange={handleChange(i, name)} // Use the handleChange function with the corresponding item index
                          name={name}
                        />
                      }
                      label={name}
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </Stack>
          </Paper>
        ))}
        <Button
          sx={buttonStyle}
          variant="contained"
          startIcon={<Add />}
          onClick={() => {
            setItems((s) => {
              const newItem = {
                ...initialItem,
                name: ``,
              };
              return [...s, newItem];
            });
          }}
        >
          Item
        </Button>
      </Stack>

      <b>
        <p>Subtotal: ${itemsSubtotal}</p>
      </b>

      <b>
        <p>3) Final bill (subtotal + tax + tip)?</p>
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
