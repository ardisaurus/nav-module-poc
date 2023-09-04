import { Fragment } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      margin: theme.spacing(1),
    },
  },
  input: {
    display: "none",
  },
}));

export default function UploadForm({
  setFile,
  setUploadMessage,
  setDataRes,
  setBackgroundImage,
  setImageDimensions,
  uploadMessage,
}) {
  const classes = useStyles();

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setUploadMessage("");
    setDataRes([]);

    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      setBackgroundImage(reader.result);
      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
      };
      img.src = reader.result;
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  return (
    <Fragment>
      <input
        className={classes.input}
        accept="image/*"
        id="contained-button-file"
        multiple
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="contained-button-file">
        <Button variant="contained" color="primary" component="span">
          Choose Image File
        </Button>
      </label>
      {uploadMessage && <p>{uploadMessage}</p>}
    </Fragment>
  );
}
