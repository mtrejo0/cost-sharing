import { Box } from "@mui/material";
import ResponsiveAppBar from "../components/NavBar";
import FreeWritesList from "../components/freeWrites/FreeWritesList";

const Home = () => {
  return (
    <div>
      <ResponsiveAppBar></ResponsiveAppBar>
      <Box sx={{ marginTop: "32px" }}>
        <FreeWritesList />
      </Box>
    </div>
  );
};

export default Home;
