import {
  Grid,
  makeStyles,
  Tabs,
  withStyles,
  Tab,
  useMediaQuery,
  useTheme,
  IconButton,
} from "@material-ui/core";
import {
  FavoriteBorderOutlined,
  List,
} from "@material-ui/icons";
import MuiAlert from "@material-ui/lab/Alert";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Table from "../../components/TableComponent/Table"
import MenuIcon from "@material-ui/icons/Menu";

const useStyles = makeStyles((theme) => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
    height: 20,
  },
  indicator: {
    backgroundColor: "#597AFB",
  },
  cont: {
    justifyContent: "space-between",
  },
}));

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}


const StyledTab = withStyles({
  wrapper: {
    textTransform: "capitalize",
  },
})(Tab);



const Favourite = () => {
  const classes = useStyles();
  const [value, setValue] = useState(1);
  const materialUITheme = useTheme();
  var originalRows = JSON.parse(localStorage.getItem("favourite"));
  const isMobile = useMediaQuery(materialUITheme.breakpoints.down("md"));
  const [rows, setRows] = useState(originalRows);
  const [openDrawer, setOpenDrawer] = useState(false);


  useEffect(() => {
    if (localStorage.getItem("favourite") === null) {
      localStorage.setItem("favourite", JSON.stringify([]));
    }
  });

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  return (
    <div>
      <div className="controlsCard">
        <Grid container className={classes.cont}>
            <Grid item className="leftBar" xs={1} md={1} direction="row" >
              {isMobile ? (
                <IconButton onClick={() => setOpenDrawer(!openDrawer)}>
                  <MenuIcon />
                </IconButton>
              ) : (
                <Tabs
                  value={value}
                  orientation="vertical"
                  onChange={handleChange}
                  classes={{ indicator: classes.indicator }}
                >
                  <Link to="/" style={{ textDecoration: "none", color: "#000" }}>
                    <StyledTab
                      label="All Banks"
                      icon={<List />}
                      {...a11yProps(0)}
                    />
                  </Link>
                  <Link
                    to="/favourites"
                    style={{ textDecoration: "none", color: "#000" }}
                  >
                    <StyledTab
                      label="Favourites"
                      icon={<FavoriteBorderOutlined />}
                      {...a11yProps(1)}
                    />
                  </Link>
                </Tabs>
              )}
              
            </Grid>
            <Grid item className="table" xs={12} md={10} >
            <Table data={rows} />
        </Grid>
        </Grid>
      </div>
      
    </div>
  );
};

export default Favourite;
