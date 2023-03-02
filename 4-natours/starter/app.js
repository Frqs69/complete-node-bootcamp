const express = require('express');
const fs = require('fs');

const app = express();

//middleware - between requests and responses
app.use(express.json());

// create own middleware
app.use((req, res, next) => {
  console.log('Hello from middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

//read tours from file and convert to JSON
const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);

// Routes functions
const getAllTours = (req, res) => {
  console.log(req.requestTime);
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    result: tours.length,
    data: {
      tours,
    },
  });
};

const getTour = (req, res) => {
  //   console.log(req.params);

  //convert id to number
  const id = parseInt(req.params.id);

  //get tour with given id
  const tour = tours.find((el) => el.id === id);

  //check if tour exists
  //   if (id > tours.length) {
  if (!tour) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }

  res.status(200).json({
    status: 'success',
    data: {
      tour,
    },
  });
};

const addTour = (req, res) => {
  // console.log(req.body);

  // create next id for data
  const newID = tours[tours.length - 1].id + 1;

  // add new it to next data
  const newTour = Object.assign({ id: newID }, req.body);

  // add new data to tours array
  tours.push(newTour);

  //write data to tour file and stringify it
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    (err) => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour,
        },
      });
    }
  );
};

const updateTour = (req, res) => {
  //check if tour exists
  if (parseInt(req.params.id) > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }

  res.status(200).json({
    status: 'success',
    data: { tour: '<Updated tour here..>' },
  });
};

const deleteTour = (req, res) => {
  //check if tour exists
  if (parseInt(req.params.id) > tours.length) {
    return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
};

// ------- ROUTES ----------------
// get method for tours api - show all data
// app.get('/api/v1/tours', getAllTours);

// get method for tours api with parameter - show all data by ID
// app.get('/api/v1/tours/:id', getTour);

// post method for tours api - add data
// app.post('/api/v1/tours', addTour);

// patch method for tours api - update existing properties in tours
// app.patch('/api/v1/tours/:id', updateTour);

// delete method for tours api - delete data
// app.delete('/api/v1/tours/:id', deleteTour);

// ------------- ROUTES better way ---------------------------
app.route('/api/v1/tours').get(getAllTours).post(addTour);

app
  .route('/api/v1/tours/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(deleteTour);

// create server on port 3000
const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
