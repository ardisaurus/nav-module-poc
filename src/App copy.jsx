import { useState, Fragment } from "react";
import Stepper from "@material-ui/core/Stepper";
import Step from "@material-ui/core/Step";
import StepLabel from "@material-ui/core/StepLabel";
import Button from "@material-ui/core/Button";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import CssBaseline from "@material-ui/core/CssBaseline";
import axios from "axios";
import Sketch from "./Sketch";
import SketchSelect from "./SketchSelect";
import SketchSelect2 from "./SketchSelect2";
import "./App.css";
import UploadForm from "./UploadForm";
import {
  CircularProgress,
  IconButton,
  MenuItem,
  TextField,
  Tooltip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@material-ui/core";
import InfoIcon from "@material-ui/icons/Info";
import LoadingLayer from "./LoadingLayer";
import { Add } from "@material-ui/icons";

const steps = [
  { index: 0, text: "Select Floorplan" },
  { index: 1, text: "Edit Nodes" },
  { index: 2, text: "Select Entry Point" },
  { index: 3, text: "Select Destinations" },
];

const StepperComponent = () => {
  const [activeStep, setActiveStep] = useState(0);

  const handleNextActiveStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handlePrevActiveStep = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // ==========

  const [file, setFile] = useState(null);
  const [dataRes, setDataRes] = useState([]);
  const [dataRes2, setDataRes2] = useState([]);
  const [newRoomName, setNewRoomName] = useState("");
  const [destinationArr, setDestinationArr] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState("");

  const [backgroundImage, setBackgroundImage] = useState(null);
  const [imageDimensions, setImageDimensions] = useState({
    width: 0,
    height: 0,
  });

  const [isAddMode, setIsAddMode] = useState(true);

  const [selectedNodes, setSelectedNodes] = useState([]);

  const handleUpload = () => {
    if (!file) {
      setUploadMessage("Please select a file to upload.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    setIsLoading(true);
    axios
      .post("http://localhost:5050/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        setDataRes(response.data);
        setDataRes2(response.data);
        // setUploadMessage("File uploaded successfully!");
        handleNextActiveStep();
      })
      .catch((error) => {
        setUploadMessage("Upload failed. Please try again later.");
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSelectedNodes = (value) => {
    setSelectedNodes(value);
  };

  const handleRemoveNodes = () => {
    const handleRemove = ({ array1, array2 }) => {
      // Function to check if two objects have the same x and y values
      function areEqual(item1, item2) {
        return item1.x === item2.x && item1.y === item2.y;
      }

      const filteredArray = array2.filter(
        (item2) => !array1.some((item1) => areEqual(item1, item2))
      );

      // p5CanvasRef.current.reset();
      return filteredArray;
    };

    const filteredNodes = handleRemove({
      array1: selectedNodes,
      array2: dataRes,
    });
    setDataRes(filteredNodes);
    setDataRes2(filteredNodes);
    setSelectedNodes([]);
  };

  const handleNextClick = () => {
    if (activeStep === 0) {
      handleUpload();
    } else {
      handleNextActiveStep();
    }
  };

  const handleBackClick = () => {
    handlePrevActiveStep();
  };

  const handleSwitchEditMode = () => {
    setSelectedNodes([]);
    setIsAddMode((curr) => !curr);
  };

  const getTooltipText = () => {
    if (isAddMode) {
      return "Click over the image to add new nodes";
    }
    return "Select node to remove";
  };

  const NavigationButton = () => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "0 2em",
        marginBottom: "16px",
      }}
    >
      <Button
        variant="outlined"
        disabled={activeStep === 0}
        onClick={handleBackClick}
      >
        Back
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={handleNextClick}
        endIcon={
          isLoading ? <CircularProgress size={24} color="inherit" /> : null
        }
      >
        {isLoading
          ? "Loading"
          : activeStep === steps.length - 1
          ? "Finish"
          : "Next"}
      </Button>
    </div>
  );

  const SimpleTable = () => {
    return (
      <TableContainer component={Paper}>
        <Table>
          <TableHead
            style={{
              fontWeight: "bold",
              backgroundColor: "#3f50b5",
              color: "#ffffff",
            }}
          >
            <TableRow>
              <TableCell
                style={{
                  color: "#ffffff",
                }}
              >
                Name
              </TableCell>
              <TableCell
                style={{
                  color: "#ffffff",
                }}
              >
                X
              </TableCell>
              <TableCell
                style={{
                  color: "#ffffff",
                }}
              >
                Y
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {destinationArr.map((row, index) => (
              <TableRow key={index}>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.x}</TableCell>
                <TableCell>{row.y}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  };

  const handleAddDestination = () => {
    const { x, y } = selectedNodes[0];
    setDestinationArr([...destinationArr, { name: newRoomName, x, y }]);
    setNewRoomName("");
  };

  return (
    <div>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6">Nav Demo</Typography>
        </Toolbar>
      </AppBar>
      <Stepper activeStep={activeStep}>
        {steps.map(({ index, text }) => (
          <Step key={index}>
            <StepLabel>{text}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <div>
        <div>
          {activeStep === steps.length ? (
            <div>
              <p>All steps completed!</p>
            </div>
          ) : (
            <div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  padding: "0 2em",
                }}
              >
                <div>
                  {activeStep === 1 && dataRes.length > 0 ? (
                    <div style={{ marginBottom: "1em", display: "flex" }}>
                      <TextField
                        value={isAddMode}
                        onChange={handleSwitchEditMode}
                        defaultValue={true}
                        select
                        variant="outlined"
                        fullWidth
                      >
                        <MenuItem value={true}>Create new nodes</MenuItem>
                        <MenuItem value={false}>Remove Node(s)</MenuItem>
                      </TextField>
                      <Tooltip title={getTooltipText()} placement="top">
                        <IconButton>
                          <InfoIcon />
                        </IconButton>
                      </Tooltip>
                    </div>
                  ) : null}
                  <div className="background-container">
                    {imageDimensions.width > 0 && imageDimensions.height > 0 ? (
                      <Fragment>
                        {activeStep === 2 ? (
                          <SketchSelect
                            dotColor={"red"}
                            imageDimensions={imageDimensions}
                            dataRes={dataRes}
                            handleSelectedNodes={handleSelectedNodes}
                            isAddMode={isAddMode}
                          />
                        ) : activeStep === 3 ? (
                          <SketchSelect2
                            dotColor={"red"}
                            imageDimensions={imageDimensions}
                            dataRes={dataRes2}
                            handleSelectedNodes={handleSelectedNodes}
                            isAddMode={isAddMode}
                          />
                        ) : (
                          <Sketch
                            dotColor={"red"}
                            imageDimensions={imageDimensions}
                            dataRes={dataRes}
                            handleSelectedNodes={handleSelectedNodes}
                            isAddMode={isAddMode}
                          />
                        )}
                      </Fragment>
                    ) : null}
                    {backgroundImage && (
                      <img src={backgroundImage} alt="Background" />
                    )}
                  </div>
                  {activeStep === 1 && dataRes.length > 0 && !isAddMode ? (
                    <div style={{ marginTop: "1em" }}>
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={handleRemoveNodes}
                        fullWidth
                        disabled={!selectedNodes.length > 0}
                        flo
                      >
                        Remove Node(s)
                      </Button>
                    </div>
                  ) : null}
                  {activeStep === 3 ? (
                    <div
                      style={{
                        marginTop: "1em",
                        display: "flex",
                        alignItems: "center",
                        marginBottom: "1em",
                      }}
                    >
                      <TextField
                        id="newRoomName"
                        name="newRoomName"
                        label="Room Name"
                        variant="outlined"
                        size="small"
                        value={newRoomName}
                        onChange={(e) => setNewRoomName(e.target.value)}
                        fullWidth
                      />
                      <Button
                        aria-label="delete"
                        size="large"
                        color="primary"
                        variant="contained"
                        onClick={handleAddDestination}
                        disabled={newRoomName.length === 0}
                      >
                        <Add />
                      </Button>
                    </div>
                  ) : null}
                  {activeStep === 3 && destinationArr.length > 0 ? (
                    <div>{SimpleTable()}</div>
                  ) : null}
                </div>

                {activeStep === 0 ? (
                  <Fragment>
                    <UploadForm
                      setFile={setFile}
                      setUploadMessage={setUploadMessage}
                      setDataRes={setDataRes}
                      setBackgroundImage={setBackgroundImage}
                      setImageDimensions={setImageDimensions}
                      isLoading={isLoading}
                      uploadMessage={uploadMessage}
                    />
                  </Fragment>
                ) : null}
              </div>

              {NavigationButton()}
            </div>
          )}
        </div>
      </div>
      {isLoading && <LoadingLayer />}
    </div>
  );
};

export default StepperComponent;
