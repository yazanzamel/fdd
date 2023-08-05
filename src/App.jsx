import FormDataComponent from './components/MyForm'; 
import './App.css'
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',

  },
  typography:{
    fontFamily: ['Roboto', 'sans-serif'],
  }
});

function App() {

  
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <ThemeProvider theme={darkTheme}>
    <FormDataComponent/>
    </ThemeProvider>
    </LocalizationProvider>
  )
}

export default App
