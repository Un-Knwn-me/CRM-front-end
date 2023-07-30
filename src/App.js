import './App.css';
import { Route, Routes } from 'react-router-dom';
import Signin from './components/Signin';
import Dashboard from './components/Dashboard';
import Contact from './components/Contact';
import Sales from './components/Sales';
import Service from './components/Service';
import Lead from './components/Lead';
import User from './components/User';
import { useEffect, useState } from 'react';
import ContactEdit from './components/ContactEdit';
import LeadEdit from './components/LeadEdit';
import ServiceEdit from './components/ServiceEdit';
import Signup from './components/Signup';
import jwtDecode from 'jwt-decode';
import axios from "axios";
import { toast } from "react-toastify";
import UserEdit from './components/UserEdit';
import SaleEdit from './components/SaleEdit';
import ResetPassword from './components/ResetPassword';
import MailService from './components/MailService';
import Nopage from './components/Nopage';


export const URL = "http://localhost:12000"
export const token = sessionStorage.getItem('token');

function App() {
  const [greeting, setGreeting] = useState('');
  const [userName, setUserName] = useState('');
  const [contacts, setContacts] = useState([]);
  const [users, setUsers] = useState([]);
  const [overall,setOverall]=useState(0);
  const [ overpending, setOverpending] = useState(0);
  const currentDate = new Date();
  const monthName = currentDate.toLocaleString('default', { month: 'long' });
  const year = currentDate.toLocaleString('default', {year: 'numeric'});
  const [totalAmountMonth, setTotalAmountMonth] = useState(0);
  const [totalAmountYear, setTotalAmountYear] = useState(0);
  
  const [totalNoYear, setTotalNoYear] = useState(0);
  const [totalNoMonth, setTotalNoMonth] = useState(0);

  useEffect(() => {
    getContacts();
    getUsers();
    getoveralldata();
    getMonthlyData();
    getyeardata();
    getUser();
    getCurrentGreeting();
  }, [])

  
    // Fetching time to greet user
    const getCurrentGreeting = () => {
      const currentHour = new Date().getHours();
      let greetingMessage = '';

      if (currentHour >= 0 && currentHour < 12) {
        greetingMessage = 'Good morning';
      } else if (currentHour >= 12 && currentHour < 18) {
        greetingMessage = 'Good afternoon';
      } else {
        greetingMessage = 'Good evening';
      }

      setGreeting(greetingMessage);
    };

    // Fetching user name
    const getUser = async() => {
      const token = sessionStorage.getItem('token');
      if (token) {
        const decodedToken = jwtDecode(token);
        const { firstName, lastName } = decodedToken;
        const fullName = `${firstName} ${lastName}`;
        setUserName(fullName);
      }
    };

  // Get contacts
  const getContacts = async () => {
    try {
      const res = await axios.get(`${URL}/contacts/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setContacts(res.data.contacts);
    } catch (error) {
      toast.error(error.res.data.message);
    }
  };

      // Get users
  const getUsers = async () => {
    try {
      const res = await axios.get(`${URL}/users/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(res.data.users);
    } catch (error) {
      toast.error(error.res.data.message);
    }
  };


     // Fetching data of overall sales
     const getoveralldata = async () =>{
      try {
        const res = await axios.get(`${URL}/sales/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setOverall(res.data.totalAmount);
        setOverpending(res.data.pendingAmount);
      } catch (error) {
        console.log('Error fetching overall data:', error);       
      }
    }

    // Fetching data of current month
  const getMonthlyData = async () => {
    try {
      const currentDate = new Date();
      const currentYear = currentDate.getFullYear();
      const currentMonth = currentDate.getMonth() + 1;

      const resp = await axios.get(`${URL}/sales/list/${currentYear}/${currentMonth}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { totalAmount, count } = resp.data;
      setTotalAmountMonth(totalAmount);
      setTotalNoMonth(count);
    } catch (error) {
      console.error('Error fetching monthly data:', error);
    }
  };

  // Fetching data of current month
const getyeardata = async () => {
  try {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    const response = await axios.get(`${URL}/sales/list/${currentYear}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const { totalAmount, count } = response.data;
    setTotalAmountYear(totalAmount);
    setTotalNoYear(count); 
  } catch (error) {
    console.log('Error fetching yearly data:', error);
  }
}

  return (
    <Routes>

      <Route exact path="/" element={<Signin/>}/>

      <Route exact path="/register" element={<Signup/>}/>

      <Route path='/dashboard' element={<Dashboard
      overall={overall} overpending={overpending} 
      monthName={monthName} year={year}
      totalAmountMonth={totalAmountMonth}
      totalAmountYear={totalAmountYear}
      greeting={greeting} userName={userName}
      />}/>

      <Route path='/contact' element={<Contact contacts={contacts} setContacts={setContacts}/>}/>

      <Route path='/edit/contact/:id' element={<ContactEdit contacts={contacts} setContacts={setContacts}/>}/>

      <Route path='/sales' element={<Sales 
      overall={overall} overpending={overpending}
      monthName={monthName} year={year}
      totalAmountMonth={totalAmountMonth} 
      totalAmountYear={totalAmountYear}
      totalNoYear={totalNoYear}
      totalNoMonth={totalNoMonth} contacts={contacts}
      />}/>

      <Route path='/edit/sale/:id' element={<SaleEdit />} />

      <Route path='/service' element={<Service />}/>

      <Route path='/edit/service/:id' element={<ServiceEdit />}/>

      <Route path='/leads' element={<Lead/>}/>

      <Route path='/edit/lead/:id' element={<LeadEdit/>}/>

      <Route path='/user-management' element={<User users={users} setUsers={setUsers}/>}/>

      <Route path='/edit/user/:id' element={<UserEdit users={users} setUsers={setUsers}/>}/>

      <Route path="/confirm-mail" element={<MailService />} />

      <Route path="/reset-password/:id/:token" element={<ResetPassword/>} />

      <Route path="**" element={<Nopage />} />

    </Routes>
  );
}

export default App;
