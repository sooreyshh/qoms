import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity, Alert } from 'react-native';
import  DateTimePickerModal from 'react-native-modal-datetime-picker' ;
import moment from 'moment'

const OrderReviewAndPayment = ({ navigation, route }) => {
  const { orderDetails } = route.params; // Assuming order details are passed from the previous screen
  const [amountPaid, setAmountPaid] = useState('');
  const [balance, setBalance] = useState(orderDetails.totalCost);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState('');
  

  const calculateBalance = (paidAmount) => {
    const balanceAmount = orderDetails.totalCost - parseFloat(paidAmount || 0);
    setBalance(balanceAmount.toFixed(2));
  };

  const placeOrder = () => {
    const handleSaveOrder = async () => {
      try {
        let payload = {
          customerId: orderDetails.customerDetails.id,
          products: orderDetails.products,
          totalCost: orderDetails.totalCost,
          totalArea: orderDetails.totalArea,
          status: 'Order Placed',
          amtPaid: amountPaid,
          balance: balance,
          deliveryDate: deliveryDate,
          placedBy:orderDetails.user._id
        };
        console.log("pl ", payload)
        const response = await fetch('http://localhost:5000/place-order', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const result = await response.json();
          
          orderDetails.orderNumber = result.orderNumber;
          orderDetails.balance = result.order.balance;
          orderDetails.amtPaid = result.order.amtPaid;
          orderDetails.customer = orderDetails.customerDetails;
          orderDetails.orderDate = new Date().toISOString();
          orderDetails.deliveryDate = deliveryDate;
          
          console.log("result order", result);          
          Alert.alert('Success', 'Order and payment details saved successfully');
          navigation.navigate('OrderConfirmation', {orderDetails});
        } else {
          Alert.alert('Error', 'Failed to save order and payment details');
        }
      } catch (error) {
        const errorMessage = error.response?.data?.error || error.message || 'An unknown error occurred';
        Alert.alert('Error', errorMessage, [{ text: 'OK', onPress: () => console.log('Error acknowledged') }], { cancelable: false });
      }
    };

    handleSaveOrder();
  }
   const validateDate = (selectedDate) => {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 60);
    return selectedDate >= today && selectedDate <= maxDate;
  };
 const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    if (date instanceof Date && !isNaN(date)) {
      const selectedDate = moment(date).format('DD-MM-YYYY');
      setDeliveryDate(selectedDate);
      hideDatePicker();
    } else {
      console.error("Invalid date:", date);
    }
  };

  const today = new Date();
  const maxDate = moment().add(60, 'days').toDate(); // Maximum 60 days in the future



  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={styles.header}>Order Review</Text>

        {/* Tabular Structure for Order Details */}
        <View style={styles.table}>
          <View style={styles.tableHeader}>
            <Text style={styles.headerText}>Product</Text>
            <Text style={styles.headerText}>Color</Text>
            <Text style={styles.headerText}>Size</Text>
            <Text style={styles.headerText}>Area (sq ft)</Text>
            <Text style={styles.headerText}>Cost (₹)</Text>
          </View>
          {orderDetails.products.map((product, index) => (
            <View key={index} style={styles.tableRow}>
              <Text style={styles.cellText}>{product.subtype} - {product.type}</Text>
              <Text style={styles.cellText}>{product.color}</Text>
              <Text style={styles.cellText}>{product.size}</Text>
              <Text style={styles.cellText}>{product.area}</Text>
              <Text style={styles.cellText}>{product.cost}</Text>
            </View>
          ))}
          <View style={styles.tableFooter}>
            <Text style={styles.footerText}>Total Area:</Text>
            <Text style={styles.footerValue}>{orderDetails.totalArea} sq ft</Text>
            <Text style={styles.footerText}>Total Cost:</Text>
            <Text style={styles.footerValue}>₹{orderDetails.totalCost}</Text>
          </View>
        </View>

        {/* Payment Section */}
        <Text style={styles.header}>Payment Details</Text>
        <View style={styles.paymentSection}>
          <Text style={styles.detailText}>Total Cost: ₹{orderDetails.totalCost}</Text>
          <Text style={styles.detailText}>Advance: </Text><TextInput
            style={styles.input}
            placeholder="Amount Paid"
            keyboardType="numeric"
            value={amountPaid}
            onChangeText={(value) => {
              setAmountPaid(value);
              calculateBalance(value);
            }}
          />
          <Text style={styles.detailText}>Balance: ₹ {balance}</Text>
           <View style={styles.container}>
      <Text style={styles.header}>Select Delivery Date</Text>

      <TouchableOpacity onPress={showDatePicker} style={styles.dateButton}>
        <Text style={styles.dateText}>{deliveryDate || 'Pick a Delivery Date'}</Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        minimumDate={today}
        maximumDate={maxDate}
        display="default"
      />

      
    </View>

        </View>
        

        <TouchableOpacity style={styles.placeOrderButton} onPress={placeOrder}>
          <Text style={styles.buttonText}>Review & Place Order</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  table: {
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f1f1f1',
    padding: 10,
  },
  tableRow: {
    flexDirection: 'row',
    padding: 10,
  },
  tableFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#f9f9f9',
  },
  headerText: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cellText: {
    flex: 1,
    textAlign: 'center',
  },
  footerText: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'left',
  },
  footerValue: {
    flex: 1,
    fontWeight: 'bold',
    textAlign: 'right',
  },
  paymentSection: {
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 5,
    borderColor: '#ddd',
    borderWidth: 1,
    marginBottom: 20,
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
  },
  input: {
    marginVertical: 10,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  placeOrderButton: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dateButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
  },
});

export default OrderReviewAndPayment;
