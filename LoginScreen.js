import React, { useState } from 'react';
import {
  SafeAreaView,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Button,
  View,
  ActivityIndicator,
  FlatList,
  ScrollView, Platform,
} from 'react-native';
import format from 'date-fns';
import moment from 'moment';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import  DateTimePickerModal from 'react-native-modal-datetime-picker' ;

import { Ionicons } from '@expo/vector-icons';

import { Provider as PaperProvider} from 'react-native-paper';
import { DatePickerModal } from 'react-native-paper-dates';



const LoginScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSupvsr, setIsSupvsr] = useState(false);
  const [sOrderNumber, setSOrderNumber] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [mobileNumber, setMobileNumber] = useState('');
  const [verificationId, setVerificationId] = useState(false);
  const [otp, setOtp] = useState('');
  const [orgOrder, setOrgOrders] = useState([]);
  const [user, setUser] = useState({
    mobile: '',
    otp: '',
    role: '',
    otpExpires: '',
  });
  const [orders, setOrders] = useState([]);
  const [fetchingOrders, setFetchingOrders] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [otpErrorMessage, setOtpErrorMessage] = useState('');

  const [editableOrder, setEditableOrder] = useState(null);
   const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);

  const [currentPicker, setCurrentPicker] = useState(null);
const today = new Date();

  const minDate = moment().subtract(45, 'days').toDate();
  const maxDate = moment().add(45, 'days').toDate();
  const tabs = createMaterialTopTabNavigator();

  const handleInputChange = (orderId, productId, key, value) => {
    const updatedOrders = orders.map((order) => {     
        
      if (order._id === orderId) {
        
        let totalArea =  parseFloat(0);
        let totalCost =  parseFloat(0);
        const updatedProducts = order.products.map((product) => {
          if (product.id === productId) {
            const updatedProduct = { ...product, [key]: value };
           if (key === 'widthInches' || key === 'heightInches') {
          const inches = parseInt(value, 10);
          if (isNaN(inches) || inches < 0 || inches > 11) {
            Alert.alert('Invalid Input', `${key === 'widthInches' ? 'Width' : 'Height'} inches must be between 0 and 11.`);
            updatedProducts[key] = '';
            return product;
          }
        }
            // Calculating area, rate, cost based on input changes
            const area =
              (parseFloat(updatedProduct.widthFeet || 0) +
                parseFloat(updatedProduct.widthInches || 0) / 12) *
              (parseFloat(updatedProduct.heightFeet || 0) +
                parseFloat(updatedProduct.heightInches || 0) / 12);
            const cost = area * parseFloat(updatedProduct.rate || 0);
          
           
            return { ...updatedProduct, area, cost };
          }
          return product;
        });
        
          totalArea = updatedProducts.reduce((sum, product) => sum + parseFloat(product.area || 0), 0);
          totalCost = updatedProducts.reduce((sum, product) => sum + parseFloat(product.cost || 0), 0);
          order.totalArea = totalArea;
          order.totalCost = totalCost; 
          order.balance = order.totalCost - parseFloat(order.amtPaid || 0);
      
      if(key === 'updatestatus' ){
        order.status=value;
          
      }
      
      if(key === 'newcomments'){
        order.comments=value;
         
      }
      
      

        return { ...order, products: updatedProducts }
      }
      
    
      return order;
    });
  
   
console.log("updatedOrder", updatedOrders)
    setOrders(updatedOrders);
  };

  

  const handleSave = async (order, orderId) => {
    try {
      
      
      
       let orderToSave = order;
       orderToSave.placedBy = user._id;
       console.log("ordertosave", orderToSave);
      const response = await fetch(`https://omssvc.el.r.appspot.com/orders/${orderId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(orderToSave),
        });
     //orders.find((order) => order._id === orderId);
      
      if(response.ok){
        let result = await response.json();
        alert('Order updated successfully'); 
        console.log("save result", result);
      }
    } catch (error) {
      alert('Failed to update order'+error);
    }
  };

  const toggleEditableOrder = (orderId) => {
    if (editableOrder === orderId && orgOrder && orgOrder.length > 0) {
      let findidx = orgOrder.findIndex((o) => o._id === orderId);
      if (findidx !== -1) {
        const updatedOrders = [...orders];
        updatedOrders[findidx] = { ...orgOrder[findidx] };
        setOrders(updatedOrders);
      }
    }
    setEditableOrder(editableOrder === orderId ? null : orderId);
  };

  const renderProductRow = (orderId, product, order) => (
    <View key={product.id} style={styles.productRow}>
      <Text style={styles.productTitle}>
        {product.subtype} - {product.type}
      </Text>
      <View style={styles.detailsRow}>
      <Text style={styles.productLabels}>Width : </Text>
        <TextInput
          style={styles.inputwh}
          placeholder="Width ft"
          keyboardType="decimal-pad"
          value={product.widthFeet}
          onChangeText={(value) =>
            handleInputChange(orderId, product.id, 'widthFeet', value)
          }
        />
        
        <TextInput
          style={styles.inputwh}
          placeholder="Width in"
          keyboardType="decimal-pad"
          value={product.widthInches}
          onChangeText={(value) =>
            handleInputChange(orderId, product.id, 'widthInches', value)
          }
        />
        <Text style={styles.productLabels}>Height : </Text>
        <TextInput
          style={styles.inputwh}
          placeholder="Height ft"
          keyboardType="decimal-pad"
          value={product.heightFeet}
          onChangeText={(value) =>
            handleInputChange(orderId, product.id, 'heightFeet', value)
          }
        />
        <TextInput
          style={styles.inputwh}
          placeholder="Height in"
          keyboardType="decimal-pad"
          value={product.heightInches}
          onChangeText={(value) =>
            handleInputChange(orderId, product.id, 'heightInches', value)
          }
        />
        <Text style={styles.productLabels}>Rate : </Text>
        <TextInput
          style={styles.inputwh}
          placeholder="Rate"
          keyboardType="decimal-pad"
          value={product.rate}
          onChangeText={(value) =>
            handleInputChange(orderId, product.id, 'rate', value)
          }
        />
      </View>
      <View style={styles.detailsRow}>
        <Text style={styles.productLabels}>Area (sq ft) : {product.area || 'N/A'}    </Text>
        <Text style={styles.productLabels}>Cost  : {formatAmount(product.cost) || 'N/A'}</Text>
        <Text style={styles.productLabels}>Comments : 
        </Text>
        <TextInput
          style={styles.commentsInput}
          placeholder="Comments"
          
          value={product.comments}
          onChangeText={(value) =>
            handleInputChange(orderId, product.id, 'comments', value)
          }
        />
       
      </View>
      
    </View>
  );

  const sendOtp = async () => {
    if (mobileNumber.length !== 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await fetch('https://omssvc.el.r.appspot.com/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile: mobileNumber }),
      });
      setLoading(false);
      if (response.ok) {
        const otpResp = await response.json();
        setOtp(otpResp.user.otp);
        setVerificationId(true);
      } else {
        setErrorMessage('Failed to send OTP');
      }
    } catch (error) {
      setLoading(false);
      setErrorMessage('An error occurred while sending OTP');
    }
  };

  const formatDateToIndian = (dateString) => {
    return moment(dateString).format('DD/MM/YYYY');
  };
   const formatAmount = (amount) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const confirmOtp = async () => {
    if (otp.length === 0) {
      setOtpErrorMessage('Please enter the OTP.');
      return;
    }
    setLoading(true);
    setOtpErrorMessage('');
    try {
      const response = await fetch('https://omssvc.el.r.appspot.com/verify-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ mobile: mobileNumber, otp: otp }),
      });
      setLoading(false);
      if (response.ok) {
        const result = await response.json();
        if (result && result.user) {
          setUser(result.user);
          const { user } = result;
          if (user.role === 'admin') {
            setLoggedIn(true);
            setIsAdmin(true);
            setOrders([]);
            // navigation.navigate('OrderList', { result });
          } else if (user.role === 'sales') {
            navigation.navigate('CustomerDetails', { user });
          } else {
            Alert.alert('Error', 'Unknown role');
          }
        } else {
          setErrorMessage('No user found in response');
        }
      } else {
        setOtpErrorMessage('Failed to verify OTP');
      }
    } catch (error) {
      setLoading(false);
      setOtpErrorMessage('An error occurred while verifying OTP');
    }
  };

  const fetchOrders = async () => {
    setFetchingOrders(true);
    try {
      const response = await fetch('https://omssvc.el.r.appspot.com/orders');
      const result = await response.json();
      if (response.ok) {
        setOrders(result);
        setOrgOrders(result);
      } else {
        Alert.alert('Error', 'Failed to fetch orders');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while fetching orders');
    } finally {
      setFetchingOrders(false);
    }
  };

  const formatDate = (order) => {
    return format(new Date(order.orderDate), 'dd/MM/yyyy');
  };
  // const calculateBalance = (order, paidAmount) => {
  //   const balanceAmount = order.totalCost - parseFloat(paidAmount || 0);
  //   setBalance(balanceAmount.toFixed(2));
  // };

   const validateDate = (selectedDate) => {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 60);
    return selectedDate >= today && selectedDate <= maxDate;
  };
 const showDatePicker = (picker) => {
   setCurrentPicker(picker);

    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    if (currentPicker === 'from') {
      if (date instanceof Date && !isNaN(date)) {
        const selectedDate = moment(date).format('DD-MM-YYYY');
        setFromDate(selectedDate);
      }
    } else if (currentPicker === 'to') {
      if (date instanceof Date && !isNaN(date)) {
         const selectedDate = moment(date).format('DD-MM-YYYY');
      setToDate(selectedDate);
      }
    }
    hideDatePicker();
  };
  const handleFromDate = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      const selectedDate = moment(date).format('DD-MM-YYYY');
        setFromDate(selectedDate);
          
      hideDatePicker();
    } else {
      console.error("Invalid date:", date);
    }
  };
 const handleFromDateChange = ( text) => {
      handleDateChange('from', text);
 }
 const handleToDateChange = ( text) => {
   handleDateChange('to', text);
 }
 const handleDateChange = (criteria, text) => {
    // Remove any non-numeric characters and limit to 8 characters (ddmmyyyy)
    const cleanedText = text.replace(/[^0-9]/g, '').slice(0, 8);

    let formattedText = '';
    if (cleanedText.length >= 2) {
      formattedText += cleanedText.slice(0, 2) + '-';
    }
    if (cleanedText.length >= 4) {
      formattedText += cleanedText.slice(2, 4) + '-';
    }
    if (cleanedText.length > 4) {
      formattedText += cleanedText.slice(4);
    } else {
      formattedText += cleanedText.slice(4);
    }

    

    if (cleanedText.length === 8) {
      const isValidFormat = validateDateFormat(formattedText);
      if (!isValidFormat) {
        setErrorMessage('Invalid date. Please enter a valid date in dd-mm-yyyy format.');
      } else {
        if(criteria === 'from'){
        setFromDate(formattedText);
      }
      if(criteria === 'to'){
        setToDate(formattedText);
      }
        setErrorMessage('');
      }
    } else {
      setErrorMessage('');
    }
  };

  const validateDateFormat = (dateString) => {
    // Regex to match the date format dd-mm-yyyy
    const regex = /^(\d{2})-(\d{2})-(\d{4})$/;
    if (regex.test(dateString)) {
      const [_, day, month, year] = dateString.match(regex);
      const date = new Date(`${year}-${month}-${day}`);
      return (
        date.getDate() === parseInt(day) &&
        date.getMonth() + 1 === parseInt(month) &&
        date.getFullYear() === parseInt(year)
      );
    }
    return false;
  }
  
  const handleToDate = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      const selectedDate = moment(date).format('DD-MM-YYYY');
      
        setToDate(selectedDate);
           
      hideDatePicker();
    } else {
      console.error("Invalid date:", date);
    }
  };

  const search =async()=>{
    searchOrders(sOrderNumber, fromDate, toDate)
  }
  const searchOrders =  async() => {
  let query = '';
  let ords=[];

  if (sOrderNumber) {
    query += `orderNumber=${sOrderNumber}&`;
  }
  if (fromDate) {
      let fDate = moment(fromDate)
    query += `dateFrom=${fromDate}&`;
  }
  if (toDate) {
    let tDate = moment(toDate).format('DD-MM-YYYY');
    query += `dateTo=${toDate}&`;
  }
   try {
     
     
       
      const response = await fetch(`https://omssvc.el.r.appspot.com/search?${query}`);
     //orders.find((order) => order._id === orderId);
      
      if(response.ok){
        let result = await response.json();
        alert('Search successfully'); 
        console.log("orders matching", result);
         setOrders(result);
         setOrgOrders(result);
      }
    } catch (error) {
      alert('Failed to update order'+error);
    }
  

  
  return orders;
};
  const renderHeader = () => (
    <View style={styles.headerRow}>
      <Text style={styles.headerCell}>Order No</Text>
      <Text style={styles.headerCell}>Order Channel No</Text>
      <Text style={styles.headerCell}>Ordered By</Text>
      <Text style={styles.headerCell}>Customer</Text>
      <Text style={styles.headerCell}>Date</Text>
      <Text style={styles.headerCell}>Total Area</Text>
      <Text style={styles.headerCell}>Total Cost</Text>
      <Text style={styles.headerCell}>Amount Paid</Text>
      <Text style={styles.headerCell}>Balance</Text>
      <Text style={styles.headerCell}>Comments</Text>
      <Text style={styles.headerCell}>Status</Text>
    </View>
  );

  const renderOrder = ({ item }) => (
    <TouchableOpacity style={styles.orderContainer}>
      <View style={styles.orderRow}>
        <Text style={styles.cell}>{item.orderNumber}</Text>
        <Text style={styles.cell}>{`${item.placedBy?.chnl || 'N/A'} - ${
          item.orderNumber
        }`}</Text>
        <Text style={styles.cell}>{item.placedBy?.name || 'N/A'}</Text>
        <Text style={styles.cell}>{item.customer?.name || 'N/A'}</Text>
        <Text style={styles.cell}>{formatDateToIndian(item.orderDate)}</Text>
        <Text style={styles.cell}>{item.totalArea}</Text>
        <Text style={styles.cell}>{formatAmount(item.totalCost)}</Text>
        <Text style={styles.cell}>{formatAmount(item.amtPaid)}</Text>
        <Text style={styles.cell}>{formatAmount(item.balance)}</Text>
        <Text style={styles.cell}>{item.status}</Text>
      </View>
      {item.products.map((product, index) => (
        <View key={index} style={styles.productRow}>
          <Text
            style={
              styles.productsInfo
            }>{`${product.subtype} - ${product.type}`}</Text>
          <Text style={styles.productCell}>{product.color}</Text>
          <Text style={styles.productCell}>{product.size}</Text>
          <Text style={styles.productCell}>{product.area}</Text>
          <Text style={styles.productCell}>₹{product.cost}</Text>
          <Text style={styles.productCell}>{product.comments}</Text>
        </View>
      ))}
    </TouchableOpacity>
  );

  if (isAdmin ) {
    return (
         
         
     
  
      <View style={styles.tablecontainer}>
        {
  isAdmin && (
            <ScrollView style={styles.searchContainer} horizontal={true} contentContainerStyle={styles.contentContainer}>
          <View style={styles.sHeaderRow}>
            <Text style={styles.sHeaderCell}>Order Number:</Text>
            <TextInput
              style={styles.sInput}
              placeholder="Order Number"
              value={sOrderNumber}
              onChangeText={setSOrderNumber}
            />
            
            <Text style={styles.sHeaderCell}>Date From:</Text>
             {(Platform.OS === 'web') && 
              <View style={styles.container}>
                <TextInput
                  style={styles.input}
                  value={fromDate}
                  placeholder="Enter Date (dd-mm-yyyy)"
                  onChangeText={handleFromDateChange}
                  keyboardType="numeric"
                />
                {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
              </View>
            }

             {(Platform.OS !== 'web') &&
            <View style={styles.dateInputContainer}>
              
              <TouchableOpacity onPress={() => showDatePicker('from')}>
                <Ionicons name="calendar" size={24} color="blue" />
              </TouchableOpacity>
                      <TextInput
                  style={styles.input}
                  value={fromDate}
                  placeholder="Select Date"
                  editable={false}
                />
            </View>
             }

            <Text style={styles.sHeaderCell}>Date To:</Text>
             {(Platform.OS === 'web') && 
              <View style={styles.container}>
                <TextInput
                  style={styles.input}
                  value={toDate}
                  placeholder="Enter Date (dd-mm-yyyy)"
                  onChangeText={handleToDateChange}
                  keyboardType="numeric"
                />
                {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
              </View>
             }
             {(Platform.OS !== 'web') &&
               <View style={styles.dateInputContainer}>
              
                <TouchableOpacity onPress={() => showDatePicker('to')}>
                  <Ionicons name="calendar" size={24} color="blue" />
                </TouchableOpacity>
                <TextInput
            style={styles.input}
            value={toDate}
            placeholder="Select Date"
            editable={false}
          />
              </View>
            }

           <DateTimePickerModal
            isVisible={isDatePickerVisible}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
            minimumDate={minDate}
            maximumDate={maxDate}
            display="default"
          />        
           
       
          <View style={styles.buttonContainer}>
              <Button title="Search" onPress={searchOrders} />
              <View style={styles.buttonSpacing} />
              <Button title="Fetch Orders" onPress={fetchOrders} />
              </View>
          </View>
        </ScrollView>
  )
}
        
        
        {fetchingOrders ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Loading orders...</Text>
          </View>
        ) : (
          orders && (
            <SafeAreaView style={styles.container}>
              
              <ScrollView>
              <View style={styles.table}>
                {renderHeader()}                
              </View>
        {orders.map((order) => (
             <View key={order._id} style={styles.orderItem}>
                  <View style={styles.orderRow}>
                   <Text style={styles.cell}>{order.orderNumber}</Text>
        <Text style={styles.cell}>{`${order.placedBy?.chnl || 'N/A'} - ${
          order.orderNumber
        }`}</Text>
        <Text style={styles.cell}>{order.placedBy?.name || 'N/A'}</Text>
        <Text style={styles.cell}>{order.customer?.name || 'N/A'}</Text>
        <Text style={styles.cell}>{moment(order.orderDate).format('DD/MM/YYYY')}</Text>
        <Text style={styles.cell}>{order.totalArea}</Text>
        <Text style={styles.cell}>{formatAmount(order.totalCost)}</Text>
        <Text style={styles.cell}>{formatAmount(order.amtPaid)}</Text>
        <Text style={styles.cell}>{formatAmount(order.balance)}</Text>
        <Text style={styles.cell}>{order.comments}</Text>
        <Text style={styles.cell}>{order.status}</Text>
         
            { editableOrder === order._id ? 
              <TouchableOpacity onPress={() => toggleEditableOrder(order._id)}>
                <Ionicons name="close" size={24} color="blue" />
              </TouchableOpacity>
              :
              <TouchableOpacity onPress={() => toggleEditableOrder(order._id)}>
                <Ionicons name="pencil" size={24} color="blue" />
              </TouchableOpacity>
            }
          
         </View>
                    {editableOrder === order._id && (
                      <>
                        {order.products.map((product) =>
                          renderProductRow(order._id, product, order)
                        )} 
           <TextInput
          style={styles.commentsInput}
          placeholder="Update Status"          
          value={order.updatestatus}
          onChangeText={(value) =>
            handleInputChange(order._id, '', 'updatestatus', value)
          }
          /> 
        <TextInput
          style={styles.commentsInput}
          placeholder="New Comments"
          
          value={order.newcomments}
          onChangeText={(value) =>
            handleInputChange(order._id, '', 'newcomments', value)
          }
          />

          <TouchableOpacity onPress={() => handleSave(order, order._id)}>
              <Ionicons name="save" size={24} color="blue" />
          </TouchableOpacity>                       
                      
                      </>
                    )}
                  </View>
          ))}
              </ScrollView>
            </SafeAreaView>
          )
        )}
      </View>
    );
  }
 

  return (
    <View style={styles.container}>
      {!loggedIn && loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator
            size="large"
            color="#007BFF"
            style={styles.spinner}
          />
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      ) : (
        <SafeAreaView style={styles.container}>
          <Text style={styles.loginLabel}>Login</Text>
          <Text style={styles.label}>Enter Mobile Number</Text>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            placeholder="Mobile Number"
            value={mobileNumber}
            maxLength={10}
            onChangeText={(text) => {
              setMobileNumber(text);
              if (text.length === 10) setErrorMessage('');
            }}
          />
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null} 
          <TouchableOpacity
            style={styles.button}
            onPress={sendOtp}
            disabled={mobileNumber.length !== 10}>
            <Text style={styles.buttonText}>Send OTP</Text>
          </TouchableOpacity>
          {verificationId && (
            <>
              <Text style={styles.label}>Enter OTP</Text>
              <TextInput
                style={styles.input}
                keyboardType="number-pad"
                placeholder="Enter OTP"
                value={otp}
                onChangeText={(text) => {
                  setOtp(text);
                  if (text.length > 0) setOtpErrorMessage('');
                }}
              />
              {otpErrorMessage ? (
                <Text style={styles.errorText}>{otpErrorMessage}</Text>
              ) : null}
              <Button
                title="Confirm OTP"
                onPress={confirmOtp}
                color="#4CAF50"
              />
            </>
          )}
        </SafeAreaView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
   searchContainer: {
    padding: 5,
  },
  contentContainer: {
    alignItems: 'top',
    justifyContent: 'space-between',
  },
  sHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sHeaderCell: {
    fontWeight: 'bold',
    marginRight: 10,
  },
  sInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 8,
    marginRight: 10,
    borderRadius: 5,
    minWidth: 100,
  },
  dateInputContainer: {
    flexDirection: 'row',
    alignItems: 'top',
    marginRight: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    alignItems: 'top',
  },
  buttonSpacing: {
    width: 10, // Adjust this to control space between buttons
  },
  container: {
    flex: 1,
    padding: 3,
    justifyContent: 'top',
    backgroundColor: '#f2f2f2',
  },
  loginLabel: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007BFF',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinner: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 12,
    color: '#333',
  },
  tablecontainer: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f8f9fa',
  },
  table: {
    flex: 1,
    marginTop: 20,
  },
  headerRow: {
    flexDirection: 'row',
    fontSize:10,
    backgroundColor: '#f0f0f0',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  headerCell: {
    flex: 1,
    fontSize:10,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  orderContainer: {
    marginBottom: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
  },
  orderRow: {
    flexDirection: 'row',
    backgroundColor: '#fafafa',
    paddingVertical: 10,
  },
  productRow: {
    flexDirection: 'row',
    backgroundColor: '#ffffff',
    paddingVertical: 5,
    paddingLeft: 5,
  },
  cell: {
    flex: 1,
    textAlign: 'center',
  },
  productCell: {
    flex: 1,
    textAlign: 'center',
  },
  productTitle: {
    flex: 0.75,
    textAlign: 'left',
  },
  productsInfo : {
    flex: 6,
    textAlign: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingVertical: 5,
  },

  orderItem: {
    marginBottom: 10,
    padding: 8,
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  orderTitle: { fontSize: 18, fontWeight: 'bold' },

  detailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    
  },
  inputwh: { 
    marginHorizontal: 5,
    height: 40,
    width:80,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 20,
   },

  header: { fontWeight: 'bold', fontSize:10, },
  productLabels: { fontWeight: 'bold' , padding:3,},
  commentsInput: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    marginBottom: 10,
    marginTop: 10
  },
  iconButton: {
    marginHorizontal: 5,
  },
  datePicker: {
    fontFamily: 'Arial', // React Native uses fonts in a different way; ensure font is available
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 2, // Android shadow
  },
  dateHeader: {
    backgroundColor: '#f7f7f7',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    padding: 10,
  },
  day: {
    borderRadius: 50,
    padding: 5,
  },
  daySelected: {
    backgroundColor: '#007bff',
    color: 'white', // Color isn't applied directly; use Text components for text color
  },
  

});

export default LoginScreen;
