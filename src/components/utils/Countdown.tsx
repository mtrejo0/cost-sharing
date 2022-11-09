import React, { useState } from "react";
import { Button, Stack, TextField } from "@mui/material";

function Countdown({ ...props }) {
  const [timer, setTimer] = useState<NodeJS.Timer>();
  const [timerLength, setTimerLength] = useState<number>(60);
  const [timeLeft, setTimeLeft] = useState<number>(timerLength);

  const startTimer = () => {
    setTimeLeft(timerLength);
    setTimer(setInterval(countDown, 1000));
  };

  const countDown = () => {
    setTimeLeft((oldTimeLeft) => {
      if (oldTimeLeft <= 0) {
        clearInterval(timer);
        setTimer(undefined);
        return timerLength;
      }
      return oldTimeLeft - 1;
    });
  };

  const resetTimer = () => {
    clearInterval(timer);
    setTimer(undefined);
    setTimeLeft(timerLength);
  };

  return (
    <>
      {timer ? (
        <Stack direction="row">
          <TextField
            label="Time Left"
            value={timeLeft}
            sx={{ width: "100px" }}
            disabled={true}
            onChange={(event) => setTimerLength(parseInt(event.target.value))}
          />
          <Button
            onClick={() => {
              resetTimer();
            }}
            variant={"outlined"}
          >
            Stop Timer
          </Button>
        </Stack>
      ) : (
        <Stack direction="row">
          <TextField
            label="Seconds"
            type="number"
            InputProps={{ inputProps: { min: 0 } }}
            value={timerLength}
            size="small"
            sx={{ width: "100px" }}
            onChange={(event) => setTimerLength(parseInt(event.target.value))}
          />
          <Button
            onClick={() => {
              startTimer();
            }}
            variant={"outlined"}
          >
            Start Timer
          </Button>
        </Stack>
      )}
    </>
  );
}
export default Countdown;
