export default function formatNumberWithCommas(number) {
    if (typeof number !== 'number' && typeof number !== 'string') {
        return "Invalid input: Must be a number or string.";
    }

    // Convert the number to a string and handle potential errors
    let numStr = String(number);

    // Check for non-numeric characters (except for minus sign and decimal point)
    if (/[^0-9.-]/g.test(numStr)) {
        return "Invalid input: Contains non-numeric characters.";
    }

    // Handle negative numbers
    const isNegative = numStr.startsWith('-');
    if (isNegative) {
        numStr = numStr.slice(1); // Remove the minus sign for processing
    }

    // Convert to number for proper rounding
    const numberValue = parseFloat(numStr);

    // Round to 2 decimal places if greater than 0
    const roundedNumber = numberValue > 0 ? numberValue.toFixed(0) : numberValue;

    const parts = roundedNumber.toString().split('.');
    let integerPart = parts[0];
    const decimalPart = parts.length > 1 ? '.' + parts[1] : '';

    let formattedInteger = '';
    let counter = 0;

    for (let i = integerPart.length - 1; i >= 0; i--) {
        formattedInteger = integerPart[i] + formattedInteger;
        counter++;
        if (counter % 3 === 0 && i !== 0) {
            formattedInteger = ',' + formattedInteger;
        }
    }

    return (isNegative ? '-' : '') + formattedInteger + decimalPart;
}