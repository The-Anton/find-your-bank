import { Container, Grid, Button } from "@material-ui/core";
import React from "react";
import { Link } from "react-router-dom";
import "./NotFoundPage.css";
import brand from "../../assets/Groww-Logo.png";
import { Block, MoodBad } from "@material-ui/icons";

const NotFoundPage = () => {
  return (
    <Container>
      <Grid container style={{ textAlign: "center" }}>
        <Grid item xs={12} sm={2} md={3}></Grid>
        <Grid
          item
          xs={12} sm={8} md={6}
          className="notFoundCard"
          style={{ marginTop: 30, textAlign: "center" }}
        >
          <h1>4<MoodBad/>4</h1>
          <h2>
            Page Not Found <Block />
          </h2>
          <img src={brand} alt="logo" className="logoImage" />
          <h4>Seems like a Messed Up URL!!</h4>
          <div className="buttonBottom">
            <Link to="/all-banks">
              <Button
                variant="outlined"
                style={{
                  textDecoration: "none",
                  backgroundColor: "#597AFB",
                  color: "#fff",
                }}
              >
                Back To Home
              </Button>
            </Link>
          </div>
        </Grid>
      </Grid>
    </Container>
  );
};

export default NotFoundPage;
