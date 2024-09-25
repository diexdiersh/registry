import { NonCallableProperties } from '../types'

/**
 * Base class for custom errors.
 * This class extends the native Error class to include additional metadata like an error code.
 */
export class CustomError extends Error {
    /**
     * The error code that categorizes the error type.
     */
    readonly code: string

    /**
     * Creates an instance of CustomError.
     *
     * @param message - A message describing the error.
     * @param code - A string representing the error code.
     * @default 'CUSTOM_ERROR'
     * @param stack - An optional stack trace string.
     */
    constructor(message: string, code = 'CUSTOM_ERROR', stack?: string) {
        super(message)
        this.name = this.constructor.name
        this.code = code
        if (stack) {
            this.stack = stack
        }
        Object.setPrototypeOf(this, new.target.prototype)
    }

    /**
     * Converts the error object to a JSON-friendly format.
     *
     * @returns An object with the properties of the CustomError.
     */
    toJSON(): NonCallableProperties<CustomError> {
        return {
            name: this.name,
            message: this.message,
            code: this.code,
            stack: this.stack,
        }
    }
}
