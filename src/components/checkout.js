import React, { useState } from 'react'
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { gql, useMutation } from '@apollo/client'
import { Source } from '@stripe/stripe-js'
import { navigate } from 'gatsby'
import { Button, toast, useToast } from '@chakra-ui/react'
import { useAppState } from './context'


function CheckoutForm () {
  const toast = useToast()
  const [formState, setFormState] = useState('IDLE')
  const { setCart } = useAppState()
  const stripe = useStripe()
  const elements = useElements()

  const [checkout] = useMutation(CHECKOUT, {
    onCompleted({ checkout }) {
      console.log(  checkout)
      handleSuccessfulCheckout({ order: checkout.order })
      console.log(  formState)
    },
    onError(error) {
      toast({
        title: 'Error',
        description: 'There was an error with your checkout',
        status: 'error',
      })
      console.error(error)
      setFormState('ERROR')
      console.log(  formState)
    },
  })

  const handleSubmit = async (event) => {
    event.preventDefault()
    setFormState('LOADING')
    const source = (await handleStripe())   
    const  Source = source
    console.log(Source.id)   

      await checkout({
        variables: {
          input: {
            clientMutationId: '121',
            paymentMethod: 'stripe',
            shipping:{
              address1: `2 rue du bois`,
              city:`Lyon`,
              email: `john@test.fr`,
              phone:`0984578963`
            },
            billing: {   
              firstName: 'john',
              address1: `2 rue du bois`,
              city: `Lyon`,
              postcode: `69001`,
            },
            metaData: [
              {
                key: `_stripe_source_id`,
                value: Source.id,
              },
            ],
          },
        },
      })
 
  }

  async function handleStripe(){
    if (!stripe || !elements) {
      throw Error(`stripe or elements undefined`)
    }

    const cardElements = elements.getElement(CardElement)

    if (!cardElements) {
      throw Error(`Card elements not found`)
    }

    const { source, error: sourceError } = await stripe.createSource(
      cardElements,
      {
        type: 'card',
      }
    )

    if (sourceError || !source) {
      throw Error(sourceError?.message || `Unknown error generating source`)
    }

    return source
  }

  function handleSuccessfulCheckout({ order }){
    setFormState('IDLE')
    localStorage.removeItem('woo-session')
    setCart(undefined)
    navigate('/checkout/order-received', { state: order })
  }

  return (
    <form onSubmit={handleSubmit}>
      <CardElement
        options={{
          hidePostalCode: true,
          style: { base: { fontSize: `18px` } },
        }}
      />
      <Button
        mt={10}
        type="submit"
        disabled={!stripe}
        isLoading={formState === 'LOADING'}
      >
        Pay
      </Button>
    </form>
  )
}
const CHECKOUT = gql`
  mutation Checkout($input: CheckoutInput!) {
    checkout(input: $input) {
      order {
        databaseId
        orderNumber
        total
        lineItems {
          nodes {
            product {
              name
              databaseId
            }
          }
        }
      }
    }
  }
`
// const CHECKOUT = gql`
// mutation CreateOrder($input: CreateOrderInput!) {
//       createOrder(input: $input) {
//         order {
//           databaseId
//           orderNumber
//           total
//           lineItems {
//             nodes {
//               product {
//                 name
//                 databaseId
//               }
//             }   
//           }
//         }
//       }
//     }
// `
export default CheckoutForm
