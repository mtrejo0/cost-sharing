import { useState } from "react";
import {
  Button,
  Card,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  useMediaQuery,
} from "@mui/material";
import { Add, Clear, Delete, RemoveCircle } from "@mui/icons-material";

interface Item {
  name: string;

  cost: number;
}

interface Person {
  name: string;
  items: Item[];
}

const buttonStyle = { width: { md: "150px", xs: "100%" } };

const inputStyle = { width: { md: "150px", xs: "100%" } };

const paperStyle = { padding: "16px", marginBottom: "16px" };

const gridSpacing = 4;

function App() {
  const isMobile = useMediaQuery("(max-width:600px)");

  const initialItem = {
    name: "Item 1",
    cost: 1,
  };

  const initialPerson = {
    name: "Person 1",
    items: [initialItem],
  };

  const [people, setPeople] = useState<Person[]>([initialPerson]);

  const [newPersonIndex, setNewPersonIndex] = useState(2);
  const [newItemIndex, setNewItemIndex] = useState(2);

  const [totalPreTaxTip, setTotalPreTaxTip] = useState(20.22);

  const [taxDollars, setTaxDollars] = useState(0);
  const [taxPercentage, setTaxPercentage] = useState(0);

  const totalPlusTax = totalPreTaxTip + taxDollars ?? 0;

  const [tipDollars, setTipDollars] = useState(0);
  const [tipPercentage, setTipPercentage] = useState(0);

  const totalAllIncluded = totalPreTaxTip + taxDollars + tipDollars ?? 0;

  const personTotal = (person: Person) =>
    person.items.map((item) => item.cost).reduce((a, s) => a + s, 0);

  const peopleTotal = people.reduce((a, s) => a + personTotal(s), 0).toFixed(2);

  const peopleTotalTax = people
    .reduce((a, s) => a + (personTotal(s) * taxPercentage) / 100, 0)
    .toFixed(2);

  const peopleTotalTip = people
    .reduce((a, s) => a + (personTotal(s) * tipPercentage) / 100, 0)
    .toFixed(2);

  const peopleTotalAllIncluded = parseFloat(
    people
      .reduce(
        (a, s) =>
          a + personTotal(s) * (1 + taxPercentage / 100 + tipPercentage / 100),
        0
      )
      .toFixed(2)
  );

  const itemNameSelection = (item: Item, i: number, j: number) => (
    <TextField
      sx={inputStyle}
      value={item.name}
      label="Item Name"
      onChange={(e) => {
        const newName = e.target.value;

        setPeople((s) => {
          const copyState = [...s];
          copyState[i].items[j].name = newName;
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
              setPeople((s) => {
                const copyState = [...s];
                copyState[i].items[j].name = "";
                return copyState;
              });
            }}
          >
            <Clear />
          </IconButton>
        ),
      }}
    ></TextField>
  );

  return (
    <Stack sx={{ padding: "16px" }}>
      <b>
        <p>How much was the bill (no tip, no tax)</p>
      </b>
      <TextField
        sx={inputStyle}
        value={totalPreTaxTip}
        label="in $"
        type="number"
        InputProps={{ inputProps: { min: 0} }}
        onChange={(e) => setTotalPreTaxTip(parseFloat(e.target.value ?? 0))}
      ></TextField>

      <b>
        <p>How much was tax?</p>
      </b>
      <Stack direction="row" spacing={gridSpacing}>
        <TextField
          sx={inputStyle}
          value={taxDollars}
          type="number"
          label="in $"
          InputProps={{ inputProps: { min: 0 } }}
          onChange={(e) => {
            const v = parseFloat(e.target.value ?? 0);
            setTaxDollars(v);

            setTaxPercentage(Math.round((v / totalPreTaxTip) * 100));
          }}
        ></TextField>
        <TextField
          sx={inputStyle}
          value={taxPercentage}
          type="number"
          label="in %"
          InputProps={{ inputProps: { min: 0 } }}
        ></TextField>
      </Stack>

      <b>
        <p>How much was tip?</p>
      </b>
      <Stack direction="row" spacing={gridSpacing}>
        <TextField
          sx={inputStyle}
          label="in $"
          value={tipDollars}
          type="number"
          InputProps={{ inputProps: { min: 0 } }}
          onChange={(e) => {
            const v = parseFloat(e.target.value ?? 0);
            setTipDollars(v);

            setTipPercentage(Math.round((v / totalPlusTax) * 100));
          }}
        ></TextField>
        <TextField
          sx={inputStyle}
          label="in %"
          value={tipPercentage}
          type="number"
          InputProps={{ inputProps: { min: 0 } }}
        ></TextField>
      </Stack>

      <p>Total all included: ${totalAllIncluded}</p>

      <b>
        <p>What did each person get?</p>
      </b>
      {people.map((person, i) => (
        <Card sx={paperStyle} variant="outlined">
          <Stack spacing={gridSpacing}>
            <Stack direction="row" spacing={1} alignItems="center">
              <TextField
                sx={inputStyle}
                value={person.name}
                label="Person Name"
                onChange={(e) => {
                  const newName = e.target.value;

                  setPeople((s) => {
                    const copyState = [...s];

                    copyState[i].name = newName;

                    return copyState;
                  });
                }}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      sx={{ visibility: person.name ? "visible" : "hidden" }}
                      onClick={() => {
                        setPeople((s) => {
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

              <p style={{ whiteSpace: "nowrap" }}>
                Total: ${personTotal(person)}
              </p>

              <Button
                color="error"
                onClick={() => {
                  setPeople((s) => s.filter((_, j) => i !== j));
                }}
              >
                <Delete />
              </Button>
            </Stack>

            {person.items.map((item, j) => (
              <Stack direction="row" spacing={1}>
                {itemNameSelection(item, i, j)}
                <TextField
                  sx={inputStyle}
                  value={item.cost}
                  label="Item Cost"
                  type="number"
                  InputProps={{ inputProps: { min: 0 } }}
                  onChange={(e) => {
                    const newCost = parseFloat(e.target.value);

                    setPeople((s) => {
                      const copyState = [...s];
                      copyState[i].items[j].cost = newCost;
                      return copyState;
                    });
                  }}
                ></TextField>

                <Button
                  color="error"
                  onClick={() => {
                    setPeople((s) => {
                      const copyState = [...s];
                      copyState[i].items = copyState[i].items.filter(
                        (_, k) => k !== j
                      );
                      return copyState;
                    });
                  }}
                >
                  <RemoveCircle />
                </Button>
              </Stack>
            ))}

            <Button
              sx={buttonStyle}
              variant="contained"
              startIcon={<Add />}
              onClick={() => {
                setPeople((s) => {
                  const copyState = [...s];
                  const newItem = {
                    ...initialItem,
                    name: `Item ${newItemIndex}`,
                  };
                  copyState[i].items = [...copyState[i].items, newItem];
                  return copyState;
                });
                setNewItemIndex((s) => s + 1);
              }}
            >
              Item
            </Button>
          </Stack>
        </Card>
      ))}
      <Button
        sx={buttonStyle}
        variant="contained"
        startIcon={<Add />}
        onClick={() => {
          setPeople((s) => {
            const newPerson = {
              ...initialPerson,
              name: `Person ${newPersonIndex}`,
            };
            return [...s, newPerson];
          });
          setNewPersonIndex((v) => v + 1);
        }}
      >
        Person
      </Button>
      <p>Breakdown</p>

      <Table sx={{ ml: isMobile ? -2 : 0 }}>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell align="right">Cost</TableCell>
            <TableCell align="right">Tax</TableCell>
            <TableCell align="right">Tip</TableCell>
            <TableCell align="right">Owes</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {people.map((person, i) => (
            <TableRow
              key={person.name}
              sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {person.name}
              </TableCell>
              <TableCell align="right">${personTotal(person)}</TableCell>
              <TableCell align="right">
                ${((personTotal(person) * tipPercentage) / 100).toFixed(2)}
              </TableCell>
              <TableCell align="right">
                ${((personTotal(person) * taxPercentage) / 100).toFixed(2)}
              </TableCell>
              <TableCell align="right">
                $
                {(
                  personTotal(person) *
                  (1 + tipPercentage / 100 + taxPercentage / 100)
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
            <TableCell align="right">${peopleTotal}</TableCell>
            <TableCell align="right">${peopleTotalTax}</TableCell>
            <TableCell align="right">${peopleTotalTip}</TableCell>
            <TableCell align="right">${peopleTotalAllIncluded}</TableCell>
          </TableRow>

          <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
            <TableCell component="th" scope="row">
              Expected
            </TableCell>
            <TableCell align="right">${totalPreTaxTip}</TableCell>
            <TableCell align="right">${taxDollars}</TableCell>
            <TableCell align="right">${tipDollars}</TableCell>

            <TableCell align="right">
              ${(peopleTotalAllIncluded - totalAllIncluded).toFixed(2)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Stack>
  );
}

export default App;
