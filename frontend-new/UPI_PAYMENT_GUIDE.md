# UPI Payment Integration Guide

## 🚀 How UPI Payment Works in EcoMarket

### For Sellers

1. **Setup Payment Details**
   - Go to Seller Dashboard
   - Click "Manage Payment Details"
   - Select "📱 UPI" tab
   - Enter your UPI ID (e.g., `yourname@paytm`, `9876543210@ybl`)
   - Enter Account Holder Name
   - Click "💾 Save Payment Details"

2. **Your UPI ID Format**
   - GPay: `mobilenumber@okaxis`, `mobilenumber@okhdfcbank`
   - PhonePe: `mobilenumber@ybl`
   - Paytm: `mobilenumber@paytm`
   - BHIM: `mobilenumber@upi`

### For Buyers

1. **Shopping & Checkout**
   - Add products to cart
   - Click "Proceed to Checkout"
   - Enter delivery address
   - Select "📱 UPI" as payment method

2. **UPI Payment Information**
   - You'll see the seller's UPI ID displayed
   - Seller's name will be shown
   - Total amount to be paid is displayed
   - Enter your UPI ID for confirmation

3. **Automatic UPI App Launch**
   - Click "Place Order"
   - Your default UPI app will open automatically
   - Payment details are pre-filled:
     - Payee: Seller's UPI ID
     - Amount: Order total
     - Note: Order ID reference

4. **Complete Payment**
   - Verify the payment details in your UPI app
   - Enter your UPI PIN
   - Confirm the payment
   - Return to EcoMarket

5. **If UPI App Doesn't Open**
   - Manual instructions will be displayed
   - Open any UPI app manually
   - Pay to the seller's UPI ID shown
   - Use the order ID as reference

## 📱 UPI Deep Linking

The app uses UPI deep linking protocol:
```
upi://pay?pa=SELLER_UPI_ID&pn=EcoMarket&am=AMOUNT&cu=INR&tn=Order_ID
```

### Parameters:
- `pa` - Payee Address (Seller's UPI ID)
- `pn` - Payee Name (EcoMarket)
- `am` - Amount (Order total)
- `cu` - Currency (INR)
- `tn` - Transaction Note (Order ID)

## 🔄 Order Status Flow

1. **awaiting_payment** - Order placed, payment pending
2. **paid** - Payment completed
3. **pending** - COD orders

## 💡 Features

### In Checkout:
- ✅ Real-time seller UPI validation
- ✅ Visual display of seller's payment details
- ✅ Warning if seller hasn't set up UPI
- ✅ Automatic UPI app detection and launch
- ✅ Fallback manual payment instructions

### In Orders Page:
- ✅ View seller's UPI details for each product
- ✅ "Pay Now" button for pending UPI payments
- ✅ Retry payment if UPI app didn't open
- ✅ Order status tracking

## 🔒 Security Notes

**Current Implementation (Demo):**
- Payment details stored in localStorage
- No actual payment processing
- UPI deep linking for demonstration

**For Production:**
- Use payment gateway (Razorpay, PayU, Cashfree)
- Implement webhook for payment confirmation
- Store payment details securely on backend
- Add payment verification
- Implement refund mechanism
- Add transaction history
- Enable payment notifications

## 🛠️ Supported UPI Apps

The UPI deep link works with:
- Google Pay (GPay)
- PhonePe
- Paytm
- BHIM
- Amazon Pay
- WhatsApp Pay
- Any UPI-enabled banking app

## 📝 Testing

1. **Test as Seller:**
   - Register as seller
   - Add UPI ID: `test@paytm`
   - Add products

2. **Test as Buyer:**
   - Browse products
   - Add to cart
   - Select UPI payment
   - See seller's UPI details
   - Click "Place Order"
   - UPI app should open (if on mobile)

3. **Desktop Testing:**
   - Manual instructions will be shown
   - Copy seller's UPI ID
   - Use mobile UPI app to pay

## 🌐 Browser Compatibility

- **Mobile Browsers:** Full support (Chrome, Safari, Firefox)
- **Desktop Browsers:** Shows manual instructions
- **In-App Browsers:** May require opening in default browser

## 🎯 Best Practices

### For Sellers:
1. Use your primary UPI ID
2. Verify UPI ID is active
3. Keep payment details updated
4. Check for payment notifications

### For Buyers:
1. Ensure UPI app is installed
2. Have sufficient balance
3. Note the order ID
4. Complete payment immediately
5. Check order status after payment

## 🐛 Troubleshooting

**UPI App Not Opening?**
- Check if UPI app is installed
- Try opening UPI app manually
- Use the displayed UPI ID to pay
- Reference the order ID in payment note

**Payment Not Reflecting?**
- Check your UPI app transaction history
- Verify payment was successful
- Contact seller with transaction ID
- Check order status in Orders page

**Seller UPI Not Available?**
- Seller hasn't set up payment details
- Choose different payment method (COD/Card)
- Contact seller to add UPI details

## 📞 Support Flow

1. Buyer places order with UPI
2. UPI app opens with pre-filled details
3. Buyer completes payment
4. Order status updates to "paid"
5. Seller receives payment notification (in production)
6. Order is processed and shipped
