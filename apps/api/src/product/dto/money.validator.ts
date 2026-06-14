import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
} from "class-validator";

/**
 * Validates that a value is a non-negative decimal string suitable for a
 * money column, e.g. "399.00", "0", "1250.5". Rejects floats-as-numbers,
 * NaN, negative values, and more than 2 fractional digits (matches the
 * schema's Decimal(12, 2)). Money is string-only per DEV-005 decision.
 */
const MONEY_PATTERN = /^\d+(\.\d{1,2})?$/;

export function IsMoneyString(options?: ValidationOptions) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      name: "isMoneyString",
      target: object.constructor,
      propertyName,
      options,
      validator: {
        validate(value: unknown): boolean {
          if (typeof value !== "string") {
            return false;
          }
          const trimmed = value.trim();
          if (!MONEY_PATTERN.test(trimmed)) {
            return false;
          }
          // Guard the integer-part width against Decimal(12, 2): 10 integer
          // digits + 2 fractional = 12 total precision.
          const [intPart] = trimmed.split(".");
          return intPart.length <= 10;
        },
        defaultMessage(args: ValidationArguments): string {
          return `${args.property} must be a non-negative decimal string with up to 2 decimal places (e.g. "399.00")`;
        },
      },
    });
  };
}
