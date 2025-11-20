import React, { useState } from "react";
import "./CheckoutFlow.css";
import { useNavigate } from "react-router-dom";

const CheckoutFlow = () => {
  const navigate = useNavigate();

  // Example cart data (you can connect to backend later)
  const [cartItems, setCartItems] = useState([
    { id: 1, name: "AWS Cloud Practitioner", price: 49 },
    { id: 2, name: "Python for Developers", price: 39 },
  ]);

  const [coupon, setCoupon] = useState("");
  const [discount, setDiscount] = useState(0);
  const [step, setStep] = useState("cart"); // cart | checkout | success

  // Coupon handler
  const applyCoupon = () => {
    if (coupon.toLowerCase() === "edulearn15") {
      setDiscount(15);
      alert("✅ Coupon applied! 15% discount added.");
    } else {
      alert("❌ Invalid coupon code.");
    }
  };

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);
  const total = subtotal - (subtotal * discount) / 100;

  // Remove from cart
  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  // Proceed to checkout
  const handleCheckout = () => {
    setStep("checkout");
  };

  // Complete payment simulation
  const handlePayment = () => {
    setStep("success");
  };

  return (
    <div className="checkout-container">
      <header className="checkout-header">
        <div className="brand">EduLearn</div>
        <h1>Secure Checkout</h1>
      </header>

      {step === "cart" && (
        <section className="cart-section">
          <h2>Your Cart</h2>
          {cartItems.length === 0 ? (
            <p>Your cart is empty.</p>
          ) : (
            <div className="cart-list">
              {cartItems.map((item) => (
                <div key={item.id} className="cart-item">
                  <span>{item.name}</span>
                  <span>${item.price}</span>
                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="coupon-area">
            <input
              type="text"
              placeholder="Have a coupon?"
              value={coupon}
              onChange={(e) => setCoupon(e.target.value)}
            />
            <button className="apply-btn" onClick={applyCoupon}>
              Apply
            </button>
          </div>

          <div className="summary">
            <p>Subtotal: ${subtotal}</p>
            <p>Discount: {discount}%</p>
            <h3>Total: ${total.toFixed(2)}</h3>
          </div>

          <button
            className="primary-btn"
            onClick={handleCheckout}
            disabled={cartItems.length === 0}
          >
            Proceed to Checkout →
          </button>
        </section>
      )}

      {step === "checkout" && (
        <section className="checkout-form">
          <h2>Payment Details</h2>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handlePayment();
            }}
          >
            <input type="text" placeholder="Full Name" required />
            <input type="email" placeholder="Email Address" required />
            <input type="text" placeholder="Card Number" required />
            <div className="row">
              <input type="text" placeholder="MM/YY" required />
              <input type="text" placeholder="CVC" required />
            </div>
            <button type="submit" className="primary-btn pay-btn">
              Pay & Enroll
            </button>
          </form>
        </section>
      )}

      {step === "success" && (
        <section className="success-screen">
          <div className="success-box">
            <div className="checkmark">✅</div>
            <h2>Payment Successful!</h2>
            <p>
              Thank you! You are now enrolled in your selected certifications.
            </p>
            <button className="primary-btn" onClick={() => navigate("/dashboard")}>
              Go to Dashboard →
            </button>
          </div>
        </section>
      )}
    </div>
  );
};

export default CheckoutFlow;
