# ReactNative Payments

[![npm version](https://badge.fury.io/js/%40rnw-community%2Fnestjs-webpack-swc.svg)](https://badge.fury.io/js/%40rnw-community%2Freact-native-payments)
[![npm downloads](https://img.shields.io/npm/dm/%40rnw-community%2Freact-native-payments.svg)](https://www.npmjs.com/package/%40rnw-community%2Freact-native-payments)

> Accept Payments with Apple Pay and Android Pay using the Payment Request API.

Implementation of [W3C Payment Request API(version 08 September 2022)](https://www.w3.org/TR/payment-request/) for React
Native.

> Currently not all the features described for the browsers are supported by this lib. Please feel free to open a PR.
> See [TODO](#todo)

This library represents a significant improvement over the
fantastic [react-native-payments](https://github.com/naoufal/react-native-payments) library, with the following enhancements:

- Complete Rewrite: The library has undergone a comprehensive refactoring and is now fully written
  in [TypeScript](https://www.typescriptlang.org).
- Native Type Support: We have introduced native types for both IOS and Android, ensuring full typing and detailed
  documentation.
- Unified API: With the aim of simplifying usage, the library now offers a unified API for both IOS and Android. You will no
  longer need code-dependent logic when utilizing the library, thanks to unified `interfaces/enums/types`.
- Enhanced Native Code: The IOS and JAVA native code has been thoroughly updated, refactored, and simplified. All deprecated
  code has been removed, ensuring better performance and stability.
- Streamlined Gateway Support: While Stripe/Braintree built-in gateway support has been removed, we continue to support
  custom gateways. The removal of built-in gateway support enables us to focus on providing better integration for custom
  solutions, especially since Stripe and Braintree already have their dedicated libraries.
- ReactNative's New Architecture: The library now
  supports [Turbo Modules](https://reactnative.dev/docs/the-new-architecture/pillars-turbomodules)., ensuring compatibility
  with ReactNative's latest architecture.

These enhancements ensure that the library is more efficient, maintainable, and future-proof, offering a seamless payment
integration experience for your applications.

## Features

- Streamlined. Say goodbye to complicated checkout forms.
- Efficient. Accelerate checkouts for higher conversion rates.
- Forward-looking. Utilize a [W3C Standards API](https://www.w3.org/) endorsed by major companies such as Google, Firefox, and more.
- Versatile. Share payment code seamlessly across iOS, Android, and web applications.

## Installation

1. Install package `@rnw-community/react-native-payments` using your package manager.

### ApplePay setup

- Create [Apple developer account](https://developer.apple.com/programs/enroll/).
- Follow [this guide](https://developer.apple.com/library/archive/ApplePay_Guide/Configuration.html) to setup ApplePay in
  your application.

### AndroidPay setup

- Create [Google developer account](https://support.google.com/googleplay/android-developer/answer/6112435?hl=en).
- Follow [this guide](https://developers.google.com/pay/api/android/guides/setup) to setup Google Pay Api in your
  application.

## Usage

> Detailed guide should be found
> at [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/API/Payment_Request_API/Using_the_Payment_Request_API)
> as API is fully compliant.

The PaymentRequest class is designed to facilitate the integration of payment processing into your React Native application.
It leverages TypeScript for robust typing and ensures seamless payment experiences across both iOS and Android platforms.
Below is a comprehensive guide on how to use the PaymentRequest class effectively:

### 1. Importing the class

```ts
import {PaymentRequest} from '@rnw-community/react-native-payments';
```

### 2. Creating an Instance

```ts
const methodData = [
    // Specify payment methods supported in your application
];

const paymentDetails = {
    // Provide payment details such as total amount, currency, and other relevant information
};

const paymentRequest = new PaymentRequest(methodData, paymentDetails);
```

> Note: The `methodData` parameter is an array of `PaymentMethodData` objects that represent
> the supported payment methods in your application. Each `PaymentMethodData` object should have a `supportedMethods`
> property specifying the type of payment method (e.g., `PaymentMethodNameEnum.AndroidPay`
> or `PaymentMethodNameEnum.ApplePay`)
> and a data property containing the corresponding platform-specific data.

#### 2.1 PaymentDetailsInterface

The `PaymentDetailsInterface` is a mapping interface used in React Native Payments to represent the payment details required
for initiating a payment request. It extends the `PaymentDetailsInit` interface from the [W3C Payment Request API(version 08 September 2022)](https://www.w3.org/TR/payment-request/)
specification and includes additional fields specific to React Native Payments.

The `PaymentDetailsInterface` includes the following additional properties:

- `environment`: This property represents the Android environment for the payment.
- `requestBilling`: An optional boolean field that, when present and set to true, indicates that the `PaymentResponse` will
  include the billing address of the payer.
- `requestEmail`: An optional boolean field that, when present and set to true, indicates that the `PaymentResponse` will
  include the email address of the payer.
- `requestShipping`: An optional boolean field that, when present and set to true, indicates that the `PaymentResponse` will
  include the shipping address of the payer.
- `total`: This property is required and represents the total amount to be paid by the user for the transaction. It includes
  both the monetary value and its corresponding currency.

### 3. Checking Payment Capability

Before displaying the payment sheet to the user, you can check if the current device supports the payment methods specified:

```ts
const isPaymentPossible = await paymentRequest.canMakePayment();
```

This method returns a boolean value indicating whether the device supports the specified payment methods.

> The `PaymentRequest` class automatically handles platform-specific payment data based on the provided methodData.

### 4. Displaying the Payment Sheet

Once you have verified the device's capability, you can proceed to display the payment sheet for the user to complete the
transaction:

```ts
try {
    const paymentResponse = await paymentRequest.show();
    // Handle the payment response here
} catch (error) {
    // Handle errors or user cancellation
}

// or Promise style
const paymentResponse = paymentRequest.show().then(...).catch(...);
```

The `paymentRequest.show()` method returns a promise that resolves with a `PaymentResponse` object representing the user's
payment response.

### 5. Processing the PaymentResponse

To send all the relevant payment information to the backend (BE) for further processing and validation, you need to extract
the required data from the `PaymentResponseDetailsInterface` object.
The `PaymentResponseDetailsInterface` provides various properties that encompass essential details about the payment,
including the payment method used, the payer's information, and transaction-related information.

```ts
const paymentResponse = paymentRequest.show().then((paymentResponse) => {
    // Will provide all plaform related information needed for transaction processing
    paymentDetails.details
    // Aditionally if was requested, shipping, billing and payer info would be available
}).catch(...);
```

### 6. Closing the Payment Sheet

Once the payment process is successfully completed, it's essential to close the payment sheet by calling the
`PaymentResponse.complete()` method. This method takes a parameter from the `PaymentComplete` enum to indicate the outcome of the
payment and hide the payment sheet accordingly.

```ts
paymentResponse.complete(PaymentComplete.Success) // OR PaymentComplete.Fail
```

> This will have no affect in the Android platform due to AndroidPay implementation.

### 7. Aborting the Payment
The `PaymentRequset.abort()` method in the Payment Request API allows developers to programmatically cancel an ongoing payment request or dismiss
the payment sheet when it is in an interactive state. This method is used to handle scenarios where the user decides to cancel the
payment process or when specific conditions require the payment request to be aborted.

> This will have no affect in the Android platform due to AndroidPay implementation.


## Example

You can find working example in the `App` component of
the [react-native-payments-example](../react-native-payments-example/README.md) package.

## TODO

- [ ] Investigate and implement unified shipping option selection between IOS and Android.(PR are welcome =)) W3C Payment
  Request does not provide anything related to the Shipping options selection, only mentiones
  it [here](https://www.w3.org/TR/payment-request/#describing-what-is-being-paid-for) as a part of the `PaymentRequest`
  details.
- [ ] Implement events:
    - [ ] [PaymentRequestUpdateEvent](https://www.w3.org/TR/payment-request/#dom-paymentrequestupdateevent)
    - [ ] [PaymentMethodChangeEvent](https://www.w3.org/TR/payment-request/#dom-paymentmethodchangeevent)
- [ ] Add unit tests
- [ ] Add web support
- [ ] Improve and unify errors according to the spec
- [ ] Merge react-native-payments-example into this package, and setup it properly
- [ ] CI/CD:
    - [ ] check/setup pull request
    - [ ] check/setup push to master and release to NPM
    - [ ] add e2e via maestro for IOS
    - [ ] add e2e via maestro for Android
- [ ] Rewrite IOS to swift?
- [ ] Rewrite Android to Kotlin?
- [x] Improve, update and finish the docs
- [x] Implement canMakePayments
- [x] Implement Android implementation
- [x] Add lib.dom and comply with the spec - We do not need it
- [x] Create TurboModule
- [x] Transfer JS and convert to TS
- [x] Implement iOS implementation
- [x] Improve PaymentRequest usage, no index.js changes
- [x] External dependencies:
    - [x] Do we need validator lib? - Yes, for now
    - [x] Do we need uuid lib? - Yes, for now
- [x] Check `package.json` files and react-native config, can we use `dist/esm` for metro?



