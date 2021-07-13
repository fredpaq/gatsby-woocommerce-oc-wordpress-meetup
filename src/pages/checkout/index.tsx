import React from 'react'
import { Elements } from '@stripe/react-stripe-js'
import { loadStripe } from '@stripe/stripe-js'
import Layout from '../../components/Layout'
import { Heading } from '@chakra-ui/react'
import CheckoutForm  from '../../components/checkout.js'

const stripePromise = loadStripe(
 `pk_test_51H9EI1GIk06rLptrvciiWdPj949WssBJG4qzq1cU8F8ItPahbvH7yxiWwLMdSUxLv9Wme2uRcpy1kFJ6SsWF42jS00G5JWlwQx`
)

const Checkout: React.FC = () => {   
  return (
    <Layout>
      <Heading as="h1" mb={6}>
        Checkout   
      </Heading>
      <Elements stripe={stripePromise}>
        <CheckoutForm />
      </Elements>
    </Layout>
  )
}

export default Checkout
