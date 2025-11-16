# 💳 Payment Verification System

## 🎯 Overview

The EcoMarket payment system now includes:
1. **QR Code Generation** - Automatic UPI QR code for easy scanning
2. **Manual Verification** - User enters transaction ID
3. **Backend Verification** - API validates and updates order status
4. **Payment Gateway Integration** - Ready for Razorpay/PayU

## 🔄 Payment Flow

### Current Implementation (Manual Verification)

```
1. User places order with UPI
   ↓
2. UPI Payment Modal opens
   ↓
3. QR Code displayed + UPI details shown
   ↓
4. User scans QR or opens UPI app
   ↓
5. User completes payment in UPI app
   ↓
6. User enters Transaction ID in modal
   ↓
7. Frontend calls /api/payments/verify
   ↓
8. Backend updates order status to 'paid'
   ↓
9. Success message shown
   ↓
10. Modal closes, order confirmed
```

## 📱 QR Code Payment

### How It Works:

1. **QR Code Generation**
   - Uses `qrcode` library
   - Encodes UPI payment string
   - Format: `upi://pay?pa=UPI_ID&am=AMOUNT&tn=ORDER_ID`

2. **User Scans QR**
   - Opens any UPI app (GPay, PhonePe, Paytm, etc.)
   - Payment details pre-filled
   - User enters UPI PIN
   - Payment completes

3. **Transaction ID**
   - UPI app shows transaction ID
   - User copies and enters in modal
   - System verifies payment

### QR Code Features:
- ✅ 250x250px size
- ✅ High contrast (black/white)
- ✅ Border and padding
- ✅ Embedded payment details
- ✅ Works with all UPI apps

## 🔐 Payment Verification

### Manual Verification (Current)

**Frontend:**
```javascript
const handlePaymentConfirmation = async () => {
  const result = await paymentsAPI.verify({
    orderId,
    transactionId,
    paymentMethod: 'upi'
  });
  
  if (result.success) {
    // Payment verified
    setPaymentStatus('success');
  }
};
```

**Backend:**
```javascript
app.post('/api/payments/verify', async (req, res) => {
  const { orderId, transactionId } = req.body;
  
  // Find order
  const order = await Order.findById(orderId);
  
  // Update status
  order.status = 'paid';
  order.transactionId = transactionId;
  order.paymentVerifiedAt = new Date();
  await order.save();
  
  res.json({ success: true, order });
});
```

### Limitations:
- ❌ No actual payment gateway verification
- ❌ User can enter fake transaction ID
- ❌ No automatic verification
- ⚠️ Suitable for demo/testing only

## 🚀 Production: Payment Gateway Integration

### Option 1: Razorpay (Recommended for India)

#### Setup:

1. **Install Razorpay SDK**
```bash
npm install razorpay
```

2. **Backend Integration**
```javascript
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Create order
app.post('/api/payments/create-order', async (req, res) => {
  const { amount, currency, receipt } = req.body;
  
  const options = {
    amount: amount * 100, // amount in paise
    currency: currency || 'INR',
    receipt: receipt
  };
  
  try {
    const order = await razorpay.orders.create(options);
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify payment
app.post('/api/payments/verify-razorpay', async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  
  const crypto = require('crypto');
  const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
  hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
  const generated_signature = hmac.digest('hex');
  
  if (generated_signature === razorpay_signature) {
    // Payment verified
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, message: 'Invalid signature' });
  }
});
```

3. **Frontend Integration**
```javascript
const loadRazorpay = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const handleRazorpayPayment = async () => {
  const res = await loadRazorpay();
  
  if (!res) {
    alert('Razorpay SDK failed to load');
    return;
  }
  
  // Create order
  const orderData = await fetch('/api/payments/create-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ amount: total, receipt: orderId })
  }).then(res => res.json());
  
  const options = {
    key: 'YOUR_RAZORPAY_KEY_ID',
    amount: orderData.amount,
    currency: orderData.currency,
    name: 'EcoMarket',
    description: 'Order Payment',
    order_id: orderData.id,
    handler: async function (response) {
      // Verify payment
      const result = await fetch('/api/payments/verify-razorpay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(response)
      }).then(res => res.json());
      
      if (result.success) {
        alert('Payment successful!');
      }
    },
    prefill: {
      name: currentUser.name,
      email: currentUser.email,
      contact: currentUser.phone
    },
    theme: {
      color: '#667eea'
    }
  };
  
  const paymentObject = new window.Razorpay(options);
  paymentObject.open();
};
```

### Option 2: PayU

Similar integration with PayU SDK for payment processing.

### Option 3: Stripe (International)

For international payments, integrate Stripe.

## 🔔 Webhook Integration

### Why Webhooks?

- ✅ Automatic payment verification
- ✅ Real-time status updates
- ✅ No user input required
- ✅ Secure and reliable

### Razorpay Webhook Example:

```javascript
app.post('/api/webhooks/razorpay', async (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  
  const crypto = require('crypto');
  const shasum = crypto.createHmac('sha256', secret);
  shasum.update(JSON.stringify(req.body));
  const digest = shasum.digest('hex');
  
  if (digest === req.headers['x-razorpay-signature']) {
    // Webhook verified
    const event = req.body.event;
    const payment = req.body.payload.payment.entity;
    
    if (event === 'payment.captured') {
      // Update order status
      const order = await Order.findOne({ razorpayOrderId: payment.order_id });
      if (order) {
        order.status = 'paid';
        order.transactionId = payment.id;
        order.paymentVerifiedAt = new Date();
        await order.save();
        
        // Send confirmation email/SMS
      }
    }
    
    res.json({ status: 'ok' });
  } else {
    res.status(400).json({ error: 'Invalid signature' });
  }
});
```

## 📊 Payment Status Flow

```
pending → awaiting_payment → paid → confirmed → shipped → delivered
```

### Status Meanings:

- **pending**: Order created, payment not initiated
- **awaiting_payment**: Payment initiated, waiting for completion
- **paid**: Payment verified and confirmed
- **confirmed**: Seller confirmed order
- **shipped**: Order shipped
- **delivered**: Order delivered

## 🎨 UI States

### 1. Payment Pending
- Show QR code
- Show UPI details
- Show "Open UPI App" button

### 2. Payment Verifying
- Show spinner
- "Verifying payment..." message
- Disable all buttons

### 3. Payment Success
- Show success icon ✅
- "Payment Verified Successfully!"
- Auto-close after 2 seconds

### 4. Payment Failed
- Show error icon ❌
- Error message
- "Retry" button

## 🔒 Security Best Practices

### Current Implementation:
1. ✅ Transaction ID stored in database
2. ✅ Order status updated atomically
3. ✅ JWT authentication required
4. ⚠️ No actual payment verification

### Production Requirements:
1. ✅ Use payment gateway (Razorpay/PayU)
2. ✅ Verify webhook signatures
3. ✅ Use HTTPS only
4. ✅ Store payment gateway response
5. ✅ Implement refund mechanism
6. ✅ Log all payment attempts
7. ✅ Rate limit payment APIs
8. ✅ Encrypt sensitive data

## 📝 Database Schema

### Order with Payment Details:

```javascript
{
  _id: ObjectId,
  buyerEmail: "buyer@example.com",
  items: [...],
  total: 598,
  paymentMethod: "upi",
  transactionId: "UPI123456789",
  paymentVerifiedAt: ISODate("2024-01-15T10:30:00Z"),
  status: "paid",
  deliveryAddress: "...",
  createdAt: ISODate("2024-01-15T10:25:00Z")
}
```

## 🧪 Testing

### Test QR Code:
1. Place order
2. QR code appears
3. Scan with UPI app
4. Complete payment
5. Enter transaction ID
6. Verify success

### Test Manual Entry:
1. Place order
2. Skip QR code
3. Pay manually in UPI app
4. Enter transaction ID
5. Verify success

### Test Verification API:
```bash
curl -X POST http://localhost:3000/api/payments/verify \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "orderId": "ORDER_ID",
    "transactionId": "UPI123456789",
    "paymentMethod": "upi"
  }'
```

## 🚀 Deployment Checklist

- [ ] Set up payment gateway account (Razorpay/PayU)
- [ ] Get API keys (test and production)
- [ ] Configure webhook URLs
- [ ] Test in sandbox mode
- [ ] Implement error handling
- [ ] Add payment logging
- [ ] Set up monitoring
- [ ] Test refund flow
- [ ] Add email notifications
- [ ] Go live with production keys

## 📚 Resources

- **Razorpay Docs**: https://razorpay.com/docs/
- **PayU Docs**: https://devguide.payu.in/
- **UPI Specification**: https://www.npci.org.in/what-we-do/upi
- **QR Code Library**: https://github.com/soldair/node-qrcode

## ✨ Summary

**Current Features:**
- ✅ QR code generation
- ✅ UPI deep linking
- ✅ Manual transaction ID entry
- ✅ Backend verification API
- ✅ Order status updates

**For Production:**
- 🔄 Integrate Razorpay/PayU
- 🔄 Implement webhooks
- 🔄 Add automatic verification
- 🔄 Enable refunds
- 🔄 Add email notifications

**Test it now at http://localhost:5173!** 🎉
