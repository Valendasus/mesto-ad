const showInputError = (formElement, inputElement, errorMessage, settings) => {
	const errorElement = formElement.querySelector(`#${inputElement.id}-error`)
	inputElement.classList.add(settings.inputErrorClass)
	errorElement.textContent = errorMessage
	errorElement.classList.add(settings.errorClass)
}

const hideInputError = (formElement, inputElement, settings) => {
	const errorElement = formElement.querySelector(`#${inputElement.id}-error`)
	inputElement.classList.remove(settings.inputErrorClass)
	errorElement.classList.remove(settings.errorClass)
	errorElement.textContent = ''
}

const checkInputValidity = (formElement, inputElement, settings) => {
	if (!inputElement.validity.valid) {
		let errorMessage = inputElement.validationMessage
		if (
			inputElement.validity.patternMismatch &&
			inputElement.dataset.errorMessage
		) {
			errorMessage = inputElement.dataset.errorMessage
		}
		showInputError(formElement, inputElement, errorMessage, settings)
	} else {
		hideInputError(formElement, inputElement, settings)
	}
}

const hasInvalidInput = inputList => {
	return inputList.some(inputElement => {
		return !inputElement.validity.valid
	})
}

const disableSubmitButton = (buttonElement, settings) => {
	buttonElement.classList.add(settings.inactiveButtonClass)
	buttonElement.disabled = true
}

const enableSubmitButton = (buttonElement, settings) => {
	buttonElement.classList.remove(settings.inactiveButtonClass)
	buttonElement.disabled = false
}

function toggleButtonState(inputList, buttonElement, settings) {
	if (hasInvalidInput(inputList)) {
		disableSubmitButton(buttonElement, settings)
	} else {
		enableSubmitButton(buttonElement, settings)
	}
}

const setEventListeners = (formElement, settings) => {
	const inputList = Array.from(
		formElement.querySelectorAll(settings.inputSelector),
	)
	const buttonElement = formElement.querySelector(settings.submitButtonSelector)

	if (!buttonElement) {
		console.error('Button not found for form:', formElement)
		return
	}

	toggleButtonState(inputList, buttonElement, settings)
	inputList.forEach(inputElement => {
		inputElement.addEventListener('input', function () {
			checkInputValidity(formElement, inputElement, settings)
			toggleButtonState(inputList, buttonElement, settings)
		})
	})
}

export const clearValidation = (formElement, settings) => {
	const inputList = Array.from(
		formElement.querySelectorAll(settings.inputSelector),
	)
	const buttonElement = formElement.querySelector(settings.submitButtonSelector)

	if (!buttonElement) {
		console.error('Button not found for form:', formElement)
		return
	}

	inputList.forEach(inputElement => {
		hideInputError(formElement, inputElement, settings)
	})
	toggleButtonState(inputList, buttonElement, settings)
}

export const enableValidation = settings => {
	const formList = Array.from(document.querySelectorAll(settings.formSelector))
	formList.forEach(formElement => {
		formElement.addEventListener('submit', function (evt) {
			evt.preventDefault()
		})
		setEventListeners(formElement, settings)
	})
}
