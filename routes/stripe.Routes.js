const express = require("express");
const router = express.Router();
const Order = require("../models/orders.model");

const { createSession } = require("../controllers/stripe.controller");
const { default: Stripe } = require("stripe");
const isLoggedIn = require("../middlewares/isLoggedIn");

const stripe = Stripe(
  "sk_test_51N90TmCmDfnXlQ6glt0vFDaIfQiVJs7HHli4ME2hv6ulwwqTJVNcysFELhgrAT37kdIxylh67PmPpz5Bccq5dee800Rl2THMbw"
);

router.post("/create-checkout-session", isLoggedIn, createSession);

// stripe listen --forward-to localhost:4000/api/stripe/webhook

// create order function
const createOrder = async (customer, data) => {
  try {
    const order = await Order.create({
      firstName: customer.metadata.firstName,
      lastName: customer.metadata.lastName,
      address: customer.metadata.address,
      city: customer.metadata.city,
      phoneNumber: customer.metadata.phoneNumber,
      user: customer.metadata.id,
      product: customer.metadata.productId,
      subtotal: data.amount_subtotal / 100,
      total: data.amount_total / 100,
      shipping: data.customer_details,
      payment_status: data.payment_status,
    });
  } catch (err) {
    console.log(err);
  }
};

// stripe webhook
let endpointSecret;
//"whsec_ce8552cde6b46ee9fecb4ef1c2fdaa010b3940487aa422da7fcd0a30ecffa492";

router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  (req, res) => {
    console.log("comming webhook");

    let sig = req.headers["stripe-signature"];

    let data;
    let eventType;

    if (endpointSecret) {
      let event;

      try {
        event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
        console.log("webhook verifided");
      } catch (err) {
        console.log(`Webhook Error: ${err.message}`);
        res.status(400).send(`Webhook Error: ${err.message}`);
        return;
      }

      data = event.data.object;
      eventType = event.type;
    } else {
      data = req.body.data.object;
      eventType = req.body.type;
    }

    // Handle the event
    if (eventType === "checkout.session.completed") {
      stripe.customers
        .retrieve(data.customer)
        .then((customer) => {
          createOrder(customer, data);
        })
        .catch((err) => console.log(err.message));
    }
    // Return a 200 response to acknowledge receipt of the event
    res.send().end();
  }
);

// router.post('/webhook', express.raw({type: 'application/json'}), (req, res) => {
//   let event = req.body;
//   // Only verify the event if you have an endpoint secret defined.
//   // Otherwise use the basic event deserialized with JSON.parse
//   if (endpointSecret) {
//     // Get the signature sent by Stripe
//     const signature = req.headers['stripe-signature'];
//     try {

//       event = stripe.webhooks.constructEvent(
//         req.body,
//         signature,
//         endpointSecret
//       );
//       console.log("yes verified")
//     } catch (err) {
//       console.log(`⚠️  Webhook signature verification failed.`, err.message);
//       return res.sendStatus(400);
//     }
//   }

//   // Handle the event
//   switch (event.type) {
//     case 'payment_intent.succeeded':
//       const paymentIntent = event.data.object;
//       console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
//       // Then define and call a method to handle the successful payment intent.
//       // handlePaymentIntentSucceeded(paymentIntent);
//       break;
//     case 'payment_method.attached':
//       const paymentMethod = event.data.object;
//       // Then define and call a method to handle the successful attachment of a PaymentMethod.
//       // handlePaymentMethodAttached(paymentMethod);
//       break;
//     default:
//       // Unexpected event type
//       console.log(`Unhandled event type ${event.type}.`);
//   }

//   // Return a 200 response to acknowledge receipt of the event
//   res.send();
// });

module.exports = router;
