const config = {
  nodeEnv: process.env["NODE_ENV"] || "development",
  validation: {
    email: {
      regexp: {
        emailRegex: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
      },
    },
  },
};

export default config;



// const config = {
//   nodeEnv: process.env["NODE_ENV"] || "development",
//   session: {
//     secret: process.env["SESSION_SECRET"] || "e646e77f-1c80-454a-9e98-2b2833c4c617",
//     maxAge: 24 * 60 * 60 * 1000, // 24 hours
//   },
//   validation: {
//     email: {
//       regexp: {
//         emailRegex: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
//       },
//     },
//   },
// };

// export default config;
