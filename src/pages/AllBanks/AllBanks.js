import React, { useEffect, useState } from "react";
import {
  Tabs,
  Tab,
  Grid,
  makeStyles,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@material-ui/core";
import "./AllBanks.css";
import MenuIcon from "@material-ui/icons/Menu";
import Table from "../../components/TableComponent/Table"
import { Link } from "react-router-dom";
import { FavoriteBorderOutlined, List } from "@material-ui/icons";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
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


const Controls = () => {
  const [city, setCity] = useState("Mumbai");
  const [category, setCategory] = useState("");
  const [data, setData] = useState([]);
  const classes = useStyles();
  const materialUITheme = useTheme();
  const [isLoaded, setIsLoaded] = useState(false);
  const [openDrawer, setOpenDrawer] = useState(false);
  const isMobile = useMediaQuery(materialUITheme.breakpoints.down("md"));
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: loader,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice"
    }
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
            expiry: now.getTime() + 60 * 6000, 
          };
          localStorage.setItem(val, JSON.stringify(item));
          setIsLoaded(true);
        })
        .catch((err) => {
          console.log("Error : ", err);
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

    if (
      localStorage.getItem(val) === null ||
      localStorage.getItem(val) === []
    ) {
      var api = `https://vast-shore-74260.herokuapp.com/banks?city=${val}`;
      fetch(api)
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
            expiry: now.getTime() + 60 * 6000, 
          };
          localStorage.setItem(val, JSON.stringify(item));
          setIsLoaded(true);
        })
        .catch((err) => {
          console.log("Error : ", err);
        });
    }
  }, []);

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
                  orientation="vertical"
                  classes={{ indicator: classes.indicator }}
                >
                  <Link to="/" style={{ textDecoration: "none", color: "#000" }}>
                    <Tab
                      label="All Banks"
                      icon={<List />}
                      id = "simple-tab-0"
                    />
                  </Link>
                  <Link
                    to="/favourites"
                    style={{ textDecoration: "none", color: "#000" }}
                  >
                    <Tab
                      label="Favourites"
                      icon={<FavoriteBorderOutlined />}
                      id= "simple-tab-1"
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
                        >
                          <MenuItem value={"Mumbai"} onClick={() => {
                                fetchapi("MUMBAI");
                                setCity("Mumbai");
                              }}>Mumbai</MenuItem>
                          <MenuItem value={"Bhopal"} onClick={() => {
                                fetchapi("BHOPAL");
                                setCity("Bhopal");
                              }}>Bhopal</MenuItem>
                          <MenuItem value={"Indore"} onClick={() => {
                                fetchapi("INDORE");
                                setCity("Indore");
                              }}>Indore</MenuItem>
                          <MenuItem value={"Delhi"} onClick={() => {
                                fetchapi("DELHI");
                                setCity("Delhi");
                              }}>Delhi</MenuItem>
                          <MenuItem value={"Lucknow"} onClick={() => {
                                fetchapi("LUCKNOW");
                                setCity('Lucknow');
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
                          value={category}
                          label="Category"
                        >
                          <MenuItem value={" "} onClick={() => {
                                setCategory(" ");
                              }}>None</MenuItem>
                          <MenuItem value={"ifsc"} onClick={() => {
                                setCategory("ifsc");
                              }}>IFSC</MenuItem>
                          <MenuItem value={"bank_name"} onClick={() => {
                                setCategory("bank_name");
                              }}>Bank Name</MenuItem>
                          <MenuItem value={"branch"} onClick={() => {
                                setCategory("branch");
                              }}>Branch</MenuItem>
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


