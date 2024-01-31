import './App.css'
import { useState } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function App() {

  const [cartValue, setCartValue] = useState(0);
  const [newCartValue, setNewCartValue] = useState(0);
  const [deliveryDistance, setDeliveryDistance] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState('');
  const [itemCount, setItemCount] = useState(0);
  const [selectedDate, setSelectedDate] = useState('');
  const [subcharge, setSubcharge] = useState(0);
  const [finalPrice, setFinalPrice] = useState(0);
  const [bulkFee, setBulkFee] = useState('');

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  const isFriday = (date) => {
    return date.getDay() === 5;
  };

  const isRushHour = (date) => {
    const hours = date.getHours();
    return hours >= 15 && hours < 19;
  };

  const checkCartValue = (e) => {
    let inputValue = parseFloat(e.target.value, 10);
    setCartValue(inputValue);

    // Check if the entered value is a valid integer
    if (!isNaN(inputValue)) {
      // Calculate the difference if the value is below 10
      if (inputValue < 10) {
        setSubcharge(10 - inputValue);
      } else {
        setSubcharge(0);
      }
      inputValue = Math.max(inputValue, 10);
      setNewCartValue(inputValue);
    }
  };

  const calculateDeliveryFee = () => {
    const baseFee = 2;
    const feePer500m = 1;
    const maxFee = 15;

    // the minimum fee is always 1€
    const totalDistance = Math.max(500, deliveryDistance);

    // Calculate the additional fee based on the distance beyond the first 1000 meters
    const extraFee = Math.ceil((totalDistance - 1000) / 500) * feePer500m;

    // Calculate the total delivery fee
    const totalFee = Math.min(baseFee + extraFee, maxFee);

    setDeliveryFee(totalFee);

  }

  const calculateTotalPrice = () => {
    const baseTotalPrice = newCartValue + deliveryFee + bulkFee;
    const maxAllowedIncrease = 15;

    if (isFriday(selectedDate) && isRushHour(selectedDate)) {
      // Check if applying the 1.2 multiplier exceeds the max allowed increase (15)
      const totalPriceWithMultiplier = baseTotalPrice * 1.2;
      const finalTotalPrice = totalPriceWithMultiplier
        > baseTotalPrice + maxAllowedIncrease
        ? baseTotalPrice + maxAllowedIncrease
        : totalPriceWithMultiplier;

      setFinalPrice(finalTotalPrice);
    } else {
      setFinalPrice(baseTotalPrice);
    }
  }

  const calculateBulkFee = () => {
    let totalBulkFee = 0;

    if (itemCount < 5) {
      setBulkFee(0);
    } else {
      // Increase bulk fee by 50 per item over 4
      let bulkAmount = 0;
      for (let i = 4; i < itemCount; i++) {
        bulkAmount++
      }
      totalBulkFee = (bulkAmount * 50) / 100;

      if (itemCount > 12 ) {
        totalBulkFee = totalBulkFee + 1.2;
      }

      // bulk fee cannot exceed 15
      if (totalBulkFee > 15) {
        setBulkFee(15);
      } else {
        setBulkFee(totalBulkFee);
      }
    }
  }


  return (
    <div className="container">
      <div className="vertical">
        <h2>Delivery Fee Calculator</h2>
        <label htmlFor="cartValue">Input cart value:</label>
        <div className="input-wrapper">
          <input
            type="number"
            id="cartValue"
            value={cartValue}
            onChange={checkCartValue}
          />
          <span className="horizontal">Cart value is: {cartValue} and subcharge is: {subcharge} --> totaling: {newCartValue} €</span>
        </div>

        <label htmlFor='deliveryDist'>Input delivery distance:</label>
        <div className="input-wrapper">
          <input
            type="number"
            id="deliveryDist"
            value={deliveryDistance}
            onChange={(e) => {
              setDeliveryDistance(parseInt(e.target.value, 10));
              calculateDeliveryFee();
            }}
          />
          <span>Delivery distance is {deliveryDistance} meters and the delivery fee is: {deliveryFee} € </span>
        </div>

        <label htmlFor='itemCount'>Input amount of items:</label>
        <div className="input-wrapper">
          <input
            type='number'
            id='itemCount'
            value={itemCount}
            onChange={(e) => {
              setItemCount(e.target.value);
            }}
          />
          <button onClick={calculateBulkFee}>Calc</button>
          <span>Item count is {itemCount} and bulk fee is: {bulkFee} €</span>
        </div>

        <label htmlFor='date'>Choose date and time:</label>
        <div className="input-wrapper">
          <DatePicker
            id='date'
            placeholderText="Click here to select date"
            showIcon
            dateFormat="eee MMMM d, yyyy h:mm aa"
            calendarStartDay={1}
            showTimeSelect
            timeFormat="HH:mm"
            timeIntervals={15}
            timeCaption="time"
            selected={selectedDate}
            onChange={handleDateChange}
          />
          <span>{selectedDate.toString()}</span>
        </div>

        <button onClick={calculateTotalPrice}>Calculate total price</button>
        <p>Total price is: {finalPrice} €</p>
      </div>
    </div>
  );

}

export default App;