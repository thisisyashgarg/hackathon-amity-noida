import express from "express";
import path from "path";
const __dirname = path.resolve();
import bodyParser from "body-parser";
import exphbs from "express-handlebars";
import { completionCall } from "./public/js/promptCall.js";

const app = express();
const port = 4002;

app.use(express.static(__dirname + "/public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "hbs");
app.engine(
  "hbs",
  exphbs.engine({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: __dirname + "/views/layouts",
    partialsDir: __dirname + "/views/partials",
  })
);

app.get("/", (req, res) => {
  res.render("main", { layout: "landingPage.hbs" });
});

app.get("/homepage", (req, res) => {
  res.render("main", { layout: "homepage.hbs" });
});

app
  .route("/dietchart")
  .get((req, res) => {
    res.render("main", {
      layout: "dietChart.hbs",
      data: ``,
      label: "Your Diet Chart",
    });
  })
  .post((req, res) => {
    const prompt = `Give me a full day ${req.body.veg} diet plan of ${req.body.calories} calories including ${req.body.protein} gm protein for a person living in ${req.body.country} with following health complications: ${req.body.complications}`;
    completionCall(prompt)
      .then((ans) => {
        console.log(ans);
        res.render("main", {
          layout: "dietChart.hbs",
          data: `${ans.trimStart()}`,
          label: "Your Diet Chart",
          calories: req.body.calories,
          veg: req.body.veg,
          protein: req.body.protein,
          country: req.body.country,
          complications: req.body.complications,
        });
      })
      .catch((err) => console.log(err));
  });

app
  .route("/workoutplan")
  .get((req, res) => {
    res.render("main", {
      layout: "workoutplan.hbs",
      data: ``,
      label: "Your Workout Plan",
    });
  })
  .post((req, res) => {
    const prompt = `Give me a weight training plan for person with : ${req.body.bodyweight} body weight, ${req.body.calories} maintenance calories, ${req.body.frequency} times a week with ${req.body.intensity} intensity`;
    completionCall(prompt)
      .then((ans) => {
        console.log(ans);
        res.render("main", {
          layout: "workoutplan.hbs",
          data: `${ans.trimStart()}`,
          label: "Your Workout Plan",
          calories: req.body.calories,
          bodyweight: req.body.bodyweight,
          frequency: req.body.frequency,
          intensity: req.body.intensity,
        });
      })
      .catch((err) => console.log(err));
  });

app
  .route("/personalCoach")
  .get((req, res) => {
    res.render("main", {
      layout: "personalCoach.hbs",
      data: ``,
      label: "Your Coaching Plan",
    });
  })
  .post((req, res) => {
    const prompt = `Give me a personal training plan for person with : ${req.body.age} preparing for ${req.body.sport} where the purpose of traing is:  ${req.body.purpose} 
    Conditional Thing: If ${req.body.purpose} is match of any sport, then prepare the plan according to ${req.body.match} time duration left`;
    completionCall(prompt)
      .then((ans) => {
        console.log(ans);
        res.render("main", {
          layout: "personalCoach.hbs",
          data: `${ans.trimStart()}`,
          label: "Your Coaching Plan",
          age: req.body.age,
          sport: req.body.sport,
          purpose: req.body.purpose,
          match: req.body.match,
        });
      })
      .catch((err) => console.log(err));
  });

app
  .route("/ama")
  .get((req, res) => {
    res.render("main", {
      layout: "askmeanything.hbs",
      data: ``,
      label: "Your response",
    });
  })
  .post((req, res) => {
    const prompt = `${req.body.ama}`;
    completionCall(prompt)
      .then((ans) => {
        console.log(ans);
        res.render("main", {
          layout: "askmeanything.hbs",
          data: `${ans}`,
          label: "Your response",
          ama: `${req.body.ama}`,
        });
      })
      .catch((err) => console.log(err));
  });

app.listen(port, (req, res) => {
  console.log(`listening on ${port}`);
});
