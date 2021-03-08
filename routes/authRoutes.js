const express = require('express')
const router = express.Router()
const { addUser } = require('../modules/users/service/userService')
const { registerSchema } = require('../modules/users/validations/authValidation')
const { joiErrorFormatter, mongooseErrorFormater } = require('../utils/validationFormator')

/**
 * Shows page for user registration
 */

router.get('/register', (req, res) => {
  return res.render('register', {
    message: {},
    errors: {},
    formData: {}
  })
})

/**
 * Handles user registration
 */

router.post('/register', async (req, res) => {
  try {
    // validating the user input present in req.body
    const validationResult = registerSchema.validate(req.body, {
      abortEarly: false
    })
    if (validationResult.error) {
      console.log(joiErrorFormatter(validationResult.error))
      return res.render('register', {
        message: {
          type: 'error',
          body: 'Validation Errors'
        },
        errors: joiErrorFormatter(validationResult.error),
        formData: req.body
      })
    }
    const user = await addUser(req.body)
    return res.render('register', {
      message: {
        type: 'success',
        body: 'successfully registered'
      },
      errors: {},
      formData: req.body
    })
  } catch (e) {
    console.error(e)
    return res.status(400).render('register', {
      message: {
        type: 'error',
        body: 'Validation Errors'
      },
      errors: mongooseErrorFormater(e),
      formData: req.body
    })
  }
})

module.exports = router
