import React from 'react'
import PropTypes from 'prop-types'

import FormErrorItem from './FormErrorItem'

const FormErrors = (props) =>
  <div>
    {
      Object.keys(props.formErrors).map((errorField) => {
        return (
          props.formErrors[errorField].map((error, i) => {
            return (
              <FormErrorItem key={i} errorField={errorField} message={error} />
            )
          })
        )
      })
    }
  </div>

FormErrors.propTypes = {
  formErrors: PropTypes.object
}

export default FormErrors;
