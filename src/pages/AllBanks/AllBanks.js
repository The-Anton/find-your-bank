import React, { useEffect, useState } from "react";
import {
  Tabs,
  Tab,
  Grid,
  makeStyles,
  withStyles,
  Box,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import "./AllBanks.css";
import MenuIcon from "@material-ui/icons/Menu";
import PropTypes from "prop-types";
import Table from "../../components/TableComponent/Table"
import brand from "../../assets/Groww-Logo.png";
import { Link } from "react-router-dom";
import Loader from "react-loader-spinner";
import { FavoriteBorderOutlined, List } from "@material-ui/icons";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import SearchBar from "material-ui-search-bar";
import Lottie from 'react-lottie';
import loader from '../../assets/lotties/loader.json';

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

const StyledTab = withStyles({
  wrapper: {
    textTransform: "capitalize",
  },
})(Tab);

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const Controls = () => {
  const classes = useStyles();
  const materialUITheme = useTheme();
  const isMobile = useMediaQuery(materialUITheme.breakpoints.down("md"));
  const [value, setValue] = useState(0);
  const [city, setCity] = useState("Mumbai");
  const [cat, setCat] = useState("None");
  const [isLoaded, setIsLoaded] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const [data, setData] = useState([]);
  const [category, setCategory] = useState("");
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loader,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
  };

  const handleCityChange = (event) => {
    setCity(event.target.value);
  };

  const handleCatChange = (event) => {
    setCat(event.target.value);
  };

  const fetchapi = (val) => {
    if (localStorage.getItem(val)) {
      setTimeout(() => {
        setIsLoaded(false);
        const item = JSON.parse(localStorage.getItem(val));
        const now = new Date();
        if (now.getTime() > item.expiry) {
          localStorage.removeItem(val);
        } else {
          setData(item.data);
        }
        setIsLoaded(true);
      }, 200);
      return;
    }

    if (localStorage.getItem(val) === null) {
      setIsLoaded(false);
      var apiLink = `https://vast-shore-74260.herokuapp.com/banks?city=${val}`;
      fetch(apiLink)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
          const now = new Date();
          data = data.map((data) => ({ ...data, favourite: false }));
          setData(data);
          const item = {
            data: data,
            expiry: now.getTime() + 60 * 6000, // 1 hour Expiry Limit
          };
          localStorage.setItem(val, JSON.stringify(item));
          setIsLoaded(true);
        })
        .catch((err) => {
          console.log("Error fetching data : ", err);
        });
    }
  };

  useEffect(() => {
    var val = "MUMBAI";
    if (localStorage.getItem("favourite") === null) {
      localStorage.setItem("favourite", JSON.stringify([]));
    }

    if (localStorage.getItem(val)) {
      const item = JSON.parse(localStorage.getItem(val));
      const now = new Date();
      if (now.getTime() > item.expiry) {
        localStorage.removeItem(val);
      } else {
        setData(item.data);
      }
      setIsLoaded(true);
      return;
    }
    console.log(localStorage.getItem(val));
    if (
      localStorage.getItem(val) === null ||
      localStorage.getItem(val) === []
    ) {
      var apiLink = `https://vast-shore-74260.herokuapp.com/banks?city=${val}`;
      fetch(apiLink)
        .then((res) => {
          return res.json();
        })
        .then((res) => {
          const now = new Date();
          setData(res);
          var info = res.map((data) => ({ ...data, favourite: false }));
          setData(info);
          const item = {
            data: info,
            expiry: now.getTime() + 60 * 6000, // 1 hour Expiry Limit
          };
          localStorage.setItem(val, JSON.stringify(item));
          setIsLoaded(true);
        })
        .catch((err) => {
          console.log("Error fetching data : ", err);
        });
    }
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  if (!isLoaded)
    return (
      <div className="loadingDiv">
        <Lottie 
          options={defaultOptions}
            height={400}
            width={400}
          />
      </div>
    );
  else {
    return (
      <div>

        <div className="homeContents">
        <Grid item container className="leftBar" xs={12} md={12} direction="row" style={{gap: 64}}>
            <Grid item className="leftBar" xs={1} md={1} >
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

            <Grid item className="contentArea" xs={12} md={10} >
              <Grid container className={classes.cont}>            
                <Grid item xs={12} lg={12}>
                  <Grid
                    container
                    style={{ display: "flex", justifyContent: "flex-end", marginTop: 10, gap: 10 }}
                  >
                    <Grid item xs={4} sm={6} lg={2}>
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">City</InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          value={city}
                          label="City"
                          onChange={handleCityChange}
                        >
                          <MenuItem value={"Mumbai"} onClick={() => {
                                fetchapi("MUMBAI");
                              }}>Mumbai</MenuItem>
                          <MenuItem value={"Bhopal"} onClick={() => {
                                fetchapi("BHOPAL");
                              }}>Bhopal</MenuItem>
                          <MenuItem value={"Indore"} onClick={() => {
                                fetchapi("INDORE");
                              }}>Indore</MenuItem>
                          <MenuItem value={"Delhi"} onClick={() => {
                                fetchapi("DELHI");
                              }}>Delhi</MenuItem>
                          <MenuItem value={"Lucknow"} onClick={() => {
                                fetchapi("LUCKNOW");
                              }}>Lucknow</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid item xs={8} sm={6} lg={2} >
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Category</InputLabel>
                        <Select
                          labelId="search-filter-label"
                          id="search-filter"
                          value={cat}
                          label="Category"
                          onChange={handleCatChange}
                        >
                          <MenuItem value={" "} onClick={() => {
                                setCat("None");
                                setCategory(" ");
                              }}>None</MenuItem>
                          <MenuItem value={"IFSC"} onClick={() => {
                                setCat("IFSC");
                                setCategory("ifsc");
                              }}>IFSC</MenuItem>
                          <MenuItem value={"Indore"} onClick={() => {
                                setCat("Bank Name");
                                setCategory("bank_name");
                              }}>Bank Name</MenuItem>
                          <MenuItem value={"branch"} onClick={() => {
                                setCat("Branch");
                                setCategory("branch");
                              }}>Bank Name</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>

                  </Grid>
                </Grid>
              </Grid>
              <Grid item xs={12} lg={12}>
                <Table data={data} category={category} val={city.toUpperCase()}/>
              </Grid>
            </Grid>
        </Grid>
        </div>
      </div> 
    );
  }
};

export default Controls;


