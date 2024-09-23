// App.js

import "./react-datepicker.css";
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import CustomerDetailsScreen from './CustomerDetailsScreen';
import CalculationScreen from './CalculationScreen';
import ProductDetailsScreen from './ProductDetailsScreen';
import OrderConfirmationScreen from './OrderConfirmationScreen';
import OrderReviewAndPayment from './OrderReviewAndPayment';
import LoginScreen from './LoginScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';


/*import { AuthProvider, useAuth } from './AuthContext';
import LoginScreen from './Login';
import OrderList from './OrdersList';

const AppNavigator = () => {
  const { user } = useAuth();

  return (
    <Stack.Navigator>
      {user ? (
        <Stack.Screen name="OrderList" component={OrderList} />
      ) : (
        <Stack.Screen name="Login" component={LoginScreen} />
      )}
    </Stack.Navigator>
  );
};*/
const Stack = createStackNavigator();

const App = () => {
  return (
  /*  <NavigationContainer>
    
      <Stack.Navigator initialRouteName="Calculation">
      
        <Stack.Screen
          name="CustomerDetails"
          component={CustomerDetailsScreen}
          options={{
            title: '',
            headerBackTitleVisible: false, // Hide the label next to the back arrow
          }}
        />
        <Stack.Screen
          name="Calculation"
          component={CalculationScreen}
          options={{
            title: '',
            headerBackTitleVisible: false, // Hide the label next to the back arrow
          }}
        />
        <Stack.Screen
          name="ProductDetails"
          component={ProductDetailsScreen}
          options={{
            title: '',
            headerBackTitleVisible: false, // Hide the label next to the back arrow
          }}
        />
        <Stack.Screen
          name="OrderConfirmation"
          component={OrderConfirmationScreen}
          options={{
            title: '',
            headerBackTitleVisible: false, // Hide the label next to the back arrow
          }}
        />
        <Stack.Screen name="OrderList" component="OrderList" />
      </Stack.Navigator>
    </NavigationContainer> */

    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen}
        options={{
            title: '',
            headerBackTitleVisible: false, // Hide the label next to the back arrow
          }}
           />
         <Stack.Screen
          name="CustomerDetails"
          component={CustomerDetailsScreen}
          options={{
            title: '',
            headerBackTitleVisible: false, // Hide the label next to the back arrow
          }}
        />
        <Stack.Screen
          name="Calculation"
          component={CalculationScreen}
          options={{
            title: '',
            headerBackTitleVisible: false, // Hide the label next to the back arrow
          }}
        />
        <Stack.Screen
          name="ProductDetails"
          component={ProductDetailsScreen}
          options={{
            title: '',
            headerBackTitleVisible: false, // Hide the label next to the back arrow
          }}
        />
        <Stack.Screen
          name="OrderReviewAndPayment"
          component={OrderReviewAndPayment}
          options={{
            title: '',
            headerBackTitleVisible: false, // Hide the label next to the back arrow
          }}
        />
        <Stack.Screen
          name="OrderConfirmation"
          component={OrderConfirmationScreen}
          options={{
            title: '',
            headerBackTitleVisible: false, // Hide the label next to the back arrow
          }}
        />
        <Stack.Screen name="OrderList" component="OrderList" />
        <Stack.Screen name="StatusUpdate" component="UpdateOrderStatusScreen" />
        <Stack.Screen name="EditOrder" component="EditOrderScreen"
        options={{
            title: 'Edit Order Details',
            headerBackTitleVisible: false, // Hide the label next to the back arrow
          }}
         />
         
     
      </Stack.Navigator>
       
      
    </NavigationContainer>
  );
};

export default App;
