import React, { useState, useEffect } from 'react';
import {Button, Container, FormControl,Slider, FormControlLabel, FormLabel, Radio, RadioGroup, Select, MenuItem, TextField, Typography } from '@mui/material';
import axios from 'axios';
import { CircularProgress } from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import dayjs from 'dayjs'


const FormLabelStyle = { fontWeight: 'bold' };
const FormControlStyle = { textAlign: 'left' , color: '#E1E2E4'};
const InputPropStyle = {style: {backgroundColor: '#313742', color: '#E1E2E4'}  }
const labelStyle = { fontWeight: 'bold', fontSize: '1.2rem', paddingTop: '20px', color: '#E1E2E4' };

export default function FormDataComponent() {

  const [response, setResponse] = useState(null);
  const [loading,setLoading] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    amt: '',
    transaction_time: dayjs(),
    age: '',
    category: 1,
  });


  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log(value)
    setFormData((prevData) => ({
      ...prevData,
      [name]: parseFloat(value),
    }));
  };

  
  const handleTime = (value) => {
    setFormData((prevData) => (
      {
      ...prevData,
      transaction_time: dayjs(value).toDate(),
    }))
  }

  function isInputValid(value,name){
    if(name === 'amt'){
      return parseFloat(value) > 0;
    }
    if(name === 'age'){
      return (parseInt(value) > 0 && parseInt(value) < 120) 
    }
    return false
  };


  function handleSubmit(event){


    event.preventDefault();
    setFormSubmitted(true);
  
    if (!isInputValid(formData.amt,'amt') || !isInputValid(formData.age,'age')) {
      // If any of the inputs are invalid, do not submit the form
      console.log("INVALID")
      return;
    }    
    setLoading(true)
    let timeInDate = formData.transaction_time;
    if (dayjs.isDayjs(formData.transaction_time)) {
      timeInDate = formData.transaction_time.toDate().toString();
    }
  const formDataToSend = { ...formData, transaction_time: timeInDate };
  console.log(formDataToSend)
    const apiEndpoint = 'http://127.0.0.1:8000/predict';
    axios
      .post(apiEndpoint, formDataToSend, {
        headers: {
          'Content-Type': 'application/json',
        }})
      .then((response) => {
        console.log('API response:', response.data);
        setResponse(response.data);
      })
      .catch((error) => {
        console.error('API error:', error);
      }).finally(setLoading(false));
      
    setFormSubmitted(true);
  };

  
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const apiEndpoint = 'http://127.0.0.1:8000/category';
    axios
      .get(apiEndpoint)
      .then((response) => {
        const data = response.data.categories;
        setCategories(Object.entries(data)); // Convert the object to an array of key-value pairs
      })
      .catch((error) => {
        console.error('API error:', error);
      });
  }, []);

  


  return (
    <div style={{backgroundColor: '#171E2E', margin: '30px', padding: '30px', borderRadius: '15px'}}>

      <Container maxWidth="sm" sx={{ py: 3 }}>
      <Typography variant="h2" align="center" sx={{ fontWeight: 'bold' }}>
        Fraud detection
      </Typography>
      <hr></hr>
      <Typography variant="body1"  align="left" style={{color: "#D0D0D0"}} >
        We've trained a model to predict whether a transaction is a fraud or not <br/>
        based on testing and evaluating, we've concluded that these are the most important factors which <br/>
        indicates whether its a fradulant transaction or not  
      </Typography>

      <hr></hr>

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
              error={formSubmitted && !isInputValid(formData.amt, 'amt')}
              helperText={formSubmitted && !isInputValid(formData.amt,'amt') ? 'amount must be bigger than 0 ' : ''}
              placeholder="Enter the amount of the transaction"
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
              error={formSubmitted &&!isInputValid(formData.age,'age')}
              helperText={formSubmitted &&!isInputValid(formData.age,'age') ? 'age must be between 1 & 110' : ''}
              sx={{ '& .MuiFilledInput-root': { marginTop: '15px' } }}
              placeholder="Age of transaction doer"
            />
          </FormControl>
          <FormControl  variant="filled" sx={FormControlStyle}>
          
          <FormLabel sx={labelStyle}>Time of the transaction</FormLabel>
          <DateTimePicker
            value={formData.transaction_time}
            fullWidth
            
            id="filled"
            onChange={handleTime}
            
          />
          </FormControl>

          <FormControl fullWidth variant="filled" sx={{ textAlign: 'left' }}>
            <FormLabel sx={labelStyle}>Purchase Category</FormLabel>
            <Select
            disableUnderline
            id='outlined'
              size="large"
              name="category"
              value={formData.category}
              onChange={handleChange}
              label="Category"
              sx={{ outlineColor: 'white', color:'white'}}
              placeholder="Select a category of the purchase"
            >
                        {categories.map(([id, name]) => (
            <MenuItem key={id} value={id}>
              {name}
            </MenuItem>
          ))}
            </Select>
          </FormControl>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 2 ,color: 'black',}}>
            Detect
          </Button>
        </form>
        {loading ? ( 
      <CircularProgress />
    ) : (
      response !== null && ( 
      <div>
          <Typography variant="h5">
            Result: {response.is_fraud === 0 ? "Not a Fraud" : "Fraud"}
          </Typography>
        </div>
      )
    )}
      </Container>
    </div>
  );
};
