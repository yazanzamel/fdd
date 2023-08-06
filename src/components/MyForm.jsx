import React, { useState } from 'react';
import {Button, Container, FormControl, FormControlLabel, FormLabel, Radio, RadioGroup, Select, MenuItem, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { TimePicker } from '@mui/x-date-pickers';


const FormLabelStyle = { fontWeight: 'bold' };
const FormControlStyle = { textAlign: 'left' , color: 'white'};
const InputPropStyle = {style: {backgroundColor: '#313742', color: '#E1E2E4'}  }
const labelStyle = { fontWeight: 'bold', fontSize: '1.2rem', paddingTop: '20px', color: '#E1E2E4' };

export default function FormDataComponent() {
  const [response, setResponse] = useState(null);

  const [formData, setFormData] = useState({
    amt: '',
    gender: 1,
    hour: '',
    age: '',
    category: 1,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: parseFloat(value),
    }));
  };

  const isInputValid = (value) => parseFloat(value) > 0;

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!isInputValid(formData.amt) || !isInputValid(formData.hour) || !isInputValid(formData.age)) {
      // If any of the inputs are invalid, do not submit the form
      alert('Please enter valid values for all fields.');
      return;
    }
    console.log(formData);

    const apiEndpoint = 'http://127.0.0.1:8000/predict';
    axios
      .post(apiEndpoint, formData)
      .then((response) => {
        console.log('API response:', response.data);
        //TODO: handle response and present it to the user
        setResponse(response.data);
      })
      .catch((error) => {
        console.error('API error:', error);
      });
  };

  const desc = {
    'personal_care': 1,
    'health_fitness': 2,
    'misc_pos': 3,
    'travel': 4,
    'kids_pets': 5,
    'shopping_pos': 6,
    'food_dining': 7,
    'home': 8,
    'entertainment': 9,
    'shopping_net': 10,
    'misc_net': 11,
    'grocery_pos': 12,
    'gas_transport': 13,
    'grocery_net': 14,
  };

  return (
    <div style={{backgroundColor: '#171E2E', margin: '30px', padding: '30px', borderRadius: '15px'}}>
      <Typography variant="h2" align="center" sx={{ fontWeight: 'bold' }}>
        Fraud detection
      </Typography>
      <hr></hr>
      <Typography variant="body1" align="left" >
        We've trained a model to predict whether a transaction is a fraud or not <br/>
        based on testing and evaluating, we've concluded that these are the most important factors which <br/>
        indicates whether its a fradulant transaction or not  
      </Typography>
      <hr></hr>
      <Container maxWidth="sm" sx={{ py: 2 }}>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth variant="outlined" sx={FormControlStyle}>
            <FormLabel sx={labelStyle}>Amount</FormLabel>
            <TextField
              id="filled"
              required
              type="number"
              name="amt"
              value={formData.amt}
              onChange={handleChange}
              InputLabelProps={{ style: FormLabelStyle }}
              InputProps={InputPropStyle}
              error={!isInputValid(formData.amt)}
              helperText={!isInputValid(formData.amt) ? 'Invalid amount' : ''}
              placeholder="Enter the amount"
            />
          </FormControl>
          <FormControl fullWidth variant="outlined" sx={FormControlStyle}>
            <FormLabel sx={labelStyle}>Time of the transaction</FormLabel>
            <TextField
              id="filled"
              fullWidth
              required
              type="number"
              name="hour"
              value={formData.hour}
              onChange={handleChange}
              InputProps={InputPropStyle}
              InputLabelProps={{ style: FormLabelStyle }}
              error={!isInputValid(formData.hour)}
              helperText={!isInputValid(formData.hour) ? 'Invalid time' : ''}
              placeholder="Enter the time"
            />
          </FormControl>
          <FormControl fullWidth variant="outlined" sx={FormControlStyle}>
            <FormLabel sx={labelStyle}>Age</FormLabel>
            <TextField
              id="filled"
              fullWidth
              required
              type="number"
              name="age"
              value={formData.age}
              InputProps={InputPropStyle}
              onChange={handleChange}
              InputLabelProps={{ style: FormLabelStyle }}
              error={!isInputValid(formData.age)}
              helperText={!isInputValid(formData.age) ? 'Invalid age' : ''}
              sx={{ '& .MuiFilledInput-root': { marginTop: '15px' } }}
              placeholder="Enter the age"
            />
          </FormControl>
          
          <FormControl fullWidth variant="outlined" sx={{ textAlign: 'left' }}>
            <FormLabel sx={labelStyle}>Gender</FormLabel>
            <RadioGroup
              row
              required
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <FormControlLabel value="1" control={<Radio />} label="Male" />
              <FormControlLabel value="2" control={<Radio />} label="Female" />
            </RadioGroup>
          </FormControl>

          <FormControl fullWidth variant="outlined" sx={{ textAlign: 'left' }}>
            <FormLabel sx={labelStyle}>Purchase Category</FormLabel>
            <Select
              size="small"
              name="category"
              value={formData.category}
              onChange={handleChange}
              label="Category"
              sx={{ outlineColor: 'white', color:'white'}}
              placeholder="Select a category"
            >
              {Object.keys(desc).map((key) => (
                <MenuItem key={desc[key]} value={desc[key]}>
                  {key.replace("_", " ")}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* <FormControl fullWidth>
            <FormLabel sx={labelStyle}>Hour of the Transaction</FormLabel>
          <TimePicker 

              value={formData.hour ? LuxonDateTime.fromObject({ hour: formData.hour }) : null}
              views={['hours']}
              onChange={() => console.log(formData.hour)}
          >
          </TimePicker>
          
          </FormControl> */}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 ,color: 'black',}}>
            Detect
          </Button>
        </form>
        {response !== null && (
          <div>
            <Typography variant="h5">
              Result: {JSON.parse(response.prediction) === 0 ? "Not a Fraud" : "Fraud"}
            </Typography>
          </div>
        )}
      </Container>
    </div>
  );
};



