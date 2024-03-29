const Stripe = require("stripe");
const Order = require("../models/orders.model");

const stripe = Stripe(
  "sk_test_51N90TmCmDfnXlQ6glt0vFDaIfQiVJs7HHli4ME2hv6ulwwqTJVNcysFELhgrAT37kdIxylh67PmPpz5Bccq5dee800Rl2THMbw"
);

const createSession = async (req, res) => {
  try {
    const { firstName, lastName, address, city, phoneNumber } = req.body;
    const { _id, price, title, description, image_link } = req.body.product;
    const customer = await stripe.customers.create({
      metadata: {
        id: req.userAuthId,
        productId: _id,
        firstName,
        lastName,
        address,
        city,
        phoneNumber,
      },
    });

    const line_items = [
      {
        price_data: {
          currency: "usd",
          product_data: {
            name: title,
            images: [image_link],
            description: description,
          },
          unit_amount: price * 100,
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      // payment_method_types: ["card"],
      // shipping_address_collection: {
      //   allowed_countries: ["US", "BD", "IN", "PK", "RU"],
      // },
      // shipping_options: [
      //   {
      //     shipping_rate_data: {
      //       type: "fixed_amount",
      //       fixed_amount: {
      //         amount: 0,
      //         currency: "usd",
      //       },
      //       display_name: "Free shipping",
      //       // Delivers between 5-7 business days
      //       delivery_estimate: {
      //         minimum: {
      //           unit: "business_day",
      //           value: 5,
      //         },
      //         maximum: {
      //           unit: "business_day",
      //           value: 7,
      //         },
      //       },
      //     },
      //   },
      //   {
      //     shipping_rate_data: {
      //       type: "fixed_amount",
      //       fixed_amount: {
      //         amount: 1500,
      //         currency: "usd",
      //       },
      //       display_name: "Next day air",
      //       // Delivers in exactly 1 business day
      //       delivery_estimate: {
      //         minimum: {
      //           unit: "business_day",
      //           value: 1,
      //         },
      //         maximum: {
      //           unit: "business_day",
      //           value: 1,
      //         },
      //       },
      //     },
      //   },
      // ],
      // phone_number_collection: {
      //   enabled: true,
      // },
      customer: customer.id,
      line_items,
      mode: "payment",
      success_url: `${process.env.CLIENT_URL}/checkout-success`,
      cancel_url: `${process.env.CLIENT_URL}/products`,
    });
    res.send({ url: session.url });
  } catch (error) {
    res.json({ error: error.message });
  }
};

module.exports = {
  createSession,
};
